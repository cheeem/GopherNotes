use axum::extract::State;
use axum::extract::multipart;
use axum::body::Bytes;
use axum::http::StatusCode;
use axum::response::Json;
use sqlx::Pool;
use sqlx::mysql::MySql;
use serde::Serialize;
use std::sync::{ Arc, Mutex, MutexGuard, };
use std::fs;
use std::io::Write;
use crate::{ AppState, UPLOAD_PATH };

type UploadResult = (StatusCode, Json<UploadError>);

trait UploadErrorResponse {
    fn to_response(self, field: Option<&'static str>, msg: &'static str) -> UploadResult;
}

#[derive(Serialize)]
pub struct UploadError {
    status: u16,
    field: Option<&'static str>,
    msg: &'static str,
}

enum UploadType {
    File, 
    Text,
}

struct Upload {
    title: Option<String>, 
    upload_type: Option<UploadType>,
    file_ext: Option<String>, 
    bytes: Option<Bytes>,
    text: Option<String>,
    department_code: Option<String>,
    class_code: Option<String>,
    professor_id: Option<u32>,
}

enum Download {
    File(DownloadFile), 
    Text(DownloadText),
}

#[derive(Debug)]
struct DownloadFile {
    title: String,
    class_id: u32,
    professor_id: Option<u32>,
    file_name: String,
    file_type: FileType,
}

#[derive(Debug)]
enum FileType {
    Image,
    Pdf,
}

struct DownloadText {
    title: String,
    class_id: u32,
    professor_id: Option<u32>,
    text: String,
}

impl UploadErrorResponse for StatusCode {
    fn to_response(self, field: Option<&'static str>, msg: &'static str) -> (Self, Json<UploadError>) where Self: Sized {
        
        let upload_error: Json<UploadError> = Json(UploadError {
            status: self.as_u16(),
            field,
            msg,
        });

        (self, upload_error)

    }
}

impl Upload {

    fn new() -> Self {
        Self {
            title: None, 
            file_ext: None, 
            upload_type: None,
            bytes: None,
            text: None,
            department_code: None,
            class_code: None,
            professor_id: None,
        }
    }
    
    async fn field<'a>(mut self, field: multipart::Field<'a>) -> Result<Self, UploadResult> {

        let field_name: Option<&str> = field.name();

        if field_name.is_none() {
            return Ok(self)
        }
       
        match field_name.unwrap() {
            "file" => {

                if self.upload_type.is_some() {
                    return Err(StatusCode::CONFLICT.to_response(Some("file"), "Uploads Can Only Have One Upload Type"));
                }

                let file_name: &str = field.file_name().ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "Upload Did Not Include a Filename"))?;

                let dot_pos: usize = file_name.rfind('.').ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "Filename Does Not Have a File Extension"))?;

                self.file_ext = Some(file_name[dot_pos+1..file_name.len()].to_owned());

                self.bytes = Some(field.bytes().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "File is Improperly Formatted"))?);

                self.upload_type = Some(UploadType::File);

            },
            "text" => {

                if self.upload_type.is_some() {
                    return Err(StatusCode::CONFLICT.to_response(Some("text"), "Uploads Can Only Have One Upload Type"));
                }

                self.text = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("text"), "Text is Improperly Formatted"))?); 

                self.upload_type = Some(UploadType::Text);

            },
            "title" => {
                self.title = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("title"), "Title is Improperly Formatted"))?);
            },
            "department_code" => {
                self.department_code = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("department_code"), "Department Code is Improperly Formatted"))?);
            },
            "class_code" => {
                self.class_code = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("class_code"), "Class Code is Improperly Formatted"))?);
            },
            "professor_id" => {
                self.professor_id = Some(
                    field
                        .text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("professor_id"), "Professor ID is Improperly Formatted"))?
                        .parse().map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("professor_id"), "Professor ID is Not Numeric"))?
                );
            }
            _ => (),
        }

        Ok(self)

    }

    async fn from_multipart(mut multipart: multipart::Multipart) -> Result<Self, UploadResult> {

        let mut upload: Self = Self::new();

        while let Some(field) = multipart.next_field().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(None, "Multipart Field is Improperly Formatted"))? {
            upload = upload.field(field).await?;
        }

        Ok(upload)

    }

    async fn download(self, state: &Arc<AppState>) -> Result<Download, UploadResult> {

        let sql: &str = "
            SELECT classes.id 
            FROM classes 
            JOIN departments ON departments.id = classes.department_id 
            WHERE classes.code = ? 
            AND departments.code = ? 
        ";

        let class_id: u32 = sqlx::query_scalar(sql)
            .bind(self.class_code)
            .bind(self.department_code)
            .fetch_one(&state.db)
            .await
            .map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("code"), "Class Not Found"))?;

        if self.upload_type.is_none() {
            return Err(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("upload_type"), "Upload Type Not Found"));
        }

        let upload: Download = match self.upload_type.unwrap() {
            UploadType::File => Download::File(DownloadFile::new(
                &state.upload_count,
                self.title.ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("title"), "Title Not Found"))?, 
                &self.file_ext.ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "File Extension Not Found"))?,
                &self.bytes.ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "File Bytes Not Found"))?,
                class_id,
                self.professor_id,
            )?),
            UploadType::Text => Download::Text(DownloadText::new(
                self.title.ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("title"), "Title Not Found"))?,
                self.text.ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("text"), "Text Not Found"))?,
                class_id,
                self.professor_id,
            )),
        };

        Ok(upload)

    }

}

impl DownloadFile {

    fn new(upload_count: &Mutex<u32>, title: String, file_ext: &str, bytes: &Bytes, class_id: u32, professor_id: Option<u32>) -> Result<Self, UploadResult> {

        let file_type: FileType = FileType::from_file_ext(file_ext).ok_or(StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "Unsupported File Type"))?;
        let file_name: String = Self::download(upload_count, file_ext, bytes)?;

        Ok(Self {
            title,
            file_name,
            file_type,
            class_id,
            professor_id,
        })
        
    }

    fn download(upload_count: &Mutex<u32>, file_ext: &str, bytes: &Bytes) -> Result<String, UploadResult> {

        let file_name: String = Self::name_file(upload_count, file_ext);

        let mut file: fs::File = fs::File::create(&format!("{}{file_name}", &*UPLOAD_PATH)).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "File Could Not Be Downloaded"))?;

        file.write(&bytes).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY.to_response(Some("file"), "File Could Not Be Downloaded"))?;

        Ok(file_name)

    }

    fn name_file(upload_count: &Mutex<u32>, file_ext: &str) -> String {

        let mut upload_count: MutexGuard<u32> = upload_count.lock().unwrap();

        *upload_count += 1;

        let mut file_name: String = upload_count.to_string();

        file_name.push('.');
        file_name.push_str(file_ext);

        file_name

    }

    async fn log(&self, db: &Pool<MySql>, user_id: u32) -> bool {

        let sql: &str = "INSERT INTO posts (user_id, upload_type, title, file_name, class_id, professor_id, dt) VALUES (?, ?, ?, ?, ?, ?, NOW())";

        sqlx::query(sql)
            .bind(user_id)
            .bind(self.file_type.as_u8())
            .bind(&self.title)
            .bind(&self.file_name)
            .bind(self.class_id)
            .bind(self.professor_id)
            .execute(db)
            .await.is_ok()

    }

    fn remove_file(self) -> Result<(), Self> {

        if fs::remove_file(&format!("{}{}", &*UPLOAD_PATH, self.file_name)).is_err() {
            return Err(self);
        }

        Ok(())

    }

}

impl FileType {

    fn from_file_ext(file_ext: &str) -> Option<Self> {

        match file_ext.to_lowercase().as_str() {
            "jpg" | "jpeg" | "png" => Some(FileType::Image),
            "pdf" => Some(FileType::Pdf),
            _ => None,
        }
    }

    fn as_u8(&self) -> u8 {
        match self {
            FileType::Image => 0,
            FileType::Pdf => 1,
        }
    }

}

impl DownloadText {

    fn new(title: String, text: String, class_id: u32, professor_id: Option<u32>) -> Self {

        Self {
            title,
            text, 
            class_id,
            professor_id,
        }

    }

    async fn log(&self, db: &Pool<MySql>, user_id: u32) -> bool {

        let sql: &str = "INSERT INTO posts (user_id, upload_type, title, text, class_id, professor_id, dt) VALUES (?, 2, ?, ?, ?, ?, NOW())";

        sqlx::query(sql)
            .bind(user_id)
            .bind(&self.title)
            .bind(&self.text)
            .bind(self.class_id)
            .bind(self.professor_id)
            .execute(db)
            .await
            .is_ok()

    }

}

#[axum::debug_handler]
pub async fn upload(State(state): State<Arc<AppState>>, multipart: multipart::Multipart) -> Result<(), UploadResult> {

    let user_id: u32 = 1;

    let download: Download = Upload::from_multipart(multipart)
        .await?
        .download(&state)
        .await?;

    let file_logged: bool = match &download {
        Download::File(download_file) => download_file.log(&state.db, user_id).await,
        Download::Text(download_text) => download_text.log(&state.db, user_id).await,
    };

    if file_logged {
        return Ok(());
    }
        
    if let Download::File(download_file) = download {
        download_file.remove_file().expect("failed to delete unlogged file"); // handle error case later
    }

    return Err(StatusCode::UNPROCESSABLE_ENTITY.to_response(None, "Upload Could Not Be Logged"));

}
