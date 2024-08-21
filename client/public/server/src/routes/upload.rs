// use axum::extract::State;
// use axum::extract::multipart;
// use axum::body::Bytes;
// use axum::response;
// use axum::http::StatusCode;
// use sqlx::Pool;
// use sqlx::mysql::MySql;
// use serde::Serialize;
// use std::sync::{ Arc, Mutex, MutexGuard, };
// use std::fs;
// use std::io::Write;
// use crate::AppState;

// #[derive(Serialize)]
// struct UploadError {
//     status: u16,
//     field: Option<&'static str>,
//     msg: String,
// }

// enum UploadType {
//     File, 
//     Text,
// }

// struct Upload {
//     title: Option<String>, 
//     upload_type: Option<UploadType>,
//     file_ext: Option<String>, 
//     bytes: Option<Bytes>,
//     text: Option<String>,
//     department_code: Option<String>,
//     class_code: Option<String>,
//     professor_id: Option<u32>,
// }

// enum Download {
//     File(DownloadFile), 
//     Text(DownloadText),
// }

// struct DownloadFile {
//     title: String,
//     class_id: u32,
//     professor_id: Option<u32>,
//     path: String,
// }

// struct DownloadText {
//     title: String,
//     class_id: u32,
//     professor_id: Option<u32>,
//     text: String,
// }

// impl Upload {

//     fn new() -> Self {
//         Self {
//             title: None, 
//             file_ext: None, 
//             upload_type: None,
//             bytes: None,
//             text: None,
//             department_code: None,
//             class_code: None,
//             professor_id: None,
//         }
//     }
    
//     async fn field<'a>(mut self, field: multipart::Field<'a>) -> Result<Self, StatusCode> {

//         let field_name: Option<&str> = field.name();

//         if field_name.is_none() {
//             return Ok(self)
//         }
       
//         match field_name.unwrap() {
//             "file" => {

//                 if self.upload_type.is_some() {
//                     return Err(StatusCode::CONFLICT);
//                 }

//                 let file_name: &str = field.file_name().ok_or(StatusCode::UNPROCESSABLE_ENTITY)?;

//                 let dot_pos: usize = file_name.rfind('.').ok_or(StatusCode::UNPROCESSABLE_ENTITY)?;

//                 self.file_ext = Some(file_name[dot_pos..file_name.len()].to_owned());

//                 self.bytes = Some(field.bytes().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?);

//                 self.upload_type = Some(UploadType::File);

//             },
//             "text" => {

//                 if self.upload_type.is_some() {
//                     return Err(StatusCode::CONFLICT);
//                 }

//                 self.text = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?); 

//                 self.upload_type = Some(UploadType::Text);

//             },
//             "title" => {
//                 self.title = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?);
//             },
//             "department_code" => {
//                 self.department_code = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?);
//             },
//             "class_code" => {
//                 self.class_code = Some(field.text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?);
//             },
//             "professor_id" => {
//                 self.class_code = Some(
//                     field
//                         .text().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?
//                         .parse().map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?
//                 );
//             }
//             _ => (),
//         }

//         Ok(self)

//     }

//     async fn from_multipart(mut multipart: multipart::Multipart) -> Result<Self, StatusCode> {

//         let mut upload: Self = Self::new();

//         while let Some(field) = multipart.next_field().await.map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)? {
//             upload = upload.field(field).await?;
//         }

//         Ok(upload)

//     }

//     async fn download(self, state: &Arc<AppState>) -> Result<Download, StatusCode> {

//         let sql: &str = "
//             SELECT classes.id 
//             FROM classes 
//             JOIN departments ON departments.id = classes.department_id 
//             WHERE classes.code = ? 
//             AND departments.code = ? 
//         ";

//         let class_id: u32 = sqlx::query_scalar(sql)
//             .bind(self.class_code)
//             .bind(self.department_code)
//             .fetch_one(&state.db)
//             .await
//             .map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

//         if self.upload_type.is_none() {
//             return Err(StatusCode::UNPROCESSABLE_ENTITY);
//         }

//         let upload: Download = match self.upload_type.unwrap() {

//             UploadType::File => Download::File(DownloadFile::new(
//                 &state.img_path,
//                 &state.img_count,
//                 self.title.ok_or(StatusCode::UNPROCESSABLE_ENTITY)?, 
//                 &self.file_ext.ok_or(StatusCode::UNPROCESSABLE_ENTITY)?,
//                 &self.bytes.ok_or(StatusCode::UNPROCESSABLE_ENTITY)?,
//                 class_id,
//                 self.professor_id,
//             )?),
//             UploadType::Text => Download::Text(DownloadText::new(
//                 self.title.ok_or(StatusCode::UNPROCESSABLE_ENTITY)?,
//                 self.text.ok_or(StatusCode::UNPROCESSABLE_ENTITY)?,
//                 class_id,
//                 self.professor_id,
//             )),
//         };

//         Ok(upload)

//     }

// }

// impl DownloadFile {

//     fn new(img_path: &str, img_count: &Mutex<u32>, title: String, file_ext: &str, bytes: &Bytes, class_id: u32, professor_id: Option<u32>) -> Result<Self, StatusCode> {

//         let path: String = Self::download(img_path, img_count, file_ext, bytes)?;

//         Ok(Self {
//             title,
//             path,
//             class_id,
//             professor_id,
//         })
        
//     }

//     fn download(img_path: &str, img_count: &Mutex<u32>, file_ext: &str, bytes: &Bytes) -> Result<String, StatusCode> {

//         let path: String = format!("{img_path}{}", Self::name_file(img_count, file_ext));

//         let mut file: fs::File = fs::File::create(&path).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

//         //let (mut file, path): (fs::File, String) = Self::new_file(img_count, path, file_ext)?;

//         file.write(&bytes).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

//         Ok(path)

//     }

//     fn name_file(img_count: &Mutex<u32>, file_ext: &str) -> String {

//         let mut img_count: MutexGuard<u32> = img_count.lock().unwrap();

//         *img_count += 1;

//         let mut file_name: String = img_count.to_string();

//         file_name.push_str(file_ext);

//         file_name

//     }

//     // fn new_file(img_count: &Mutex<u32>, mut path: String, file_ext: &str) -> Result<(fs::File, String), StatusCode> {

//     //     loop {

//     //         println!("{path}");
            
//     //         match fs::File::create(&path) {
//     //             Ok(file) => return Ok((file, path)),
//     //             Err(error) => {

//     //                 if let io::ErrorKind::AlreadyExists = error.kind() {

//     //                     let slash_pos: usize = path.rfind('/').ok_or(StatusCode::UNPROCESSABLE_ENTITY)?;

//     //                     path.truncate(slash_pos + 1);

//     //                     let file_name: &str = &Self::name_file(file_ext);

//     //                     path.push_str(file_name);

//     //                     continue;
//     //                 }

//     //                 return Err(StatusCode::UNPROCESSABLE_ENTITY);

//     //             }
//     //         }
                
//     //     }

//     // }

//     async fn log(&self, db: &Pool<MySql>) -> bool {

//         let sql: &str = "INSERT INTO posts (upload_type, title, path, class_id, professor_id, dt) VALUES (0, ?, ?, ?, ?, NOW())";

//         sqlx::query(sql)
//             .bind(&self.title)
//             .bind(&self.path)
//             .bind(&self.class_id)
//             .bind(&self.professor_id)
//             .execute(db)
//             .await
//             .is_ok()

//     }

//     fn remove_file(&self) -> Result<(), Self> {

//         todo!();

//     }

// }

// impl DownloadText {

//     fn new(title: String, text: String, class_id: u32, professor_id: Option<u32>) -> Self {

//         Self {
//             title,
//             text, 
//             class_id,
//             professor_id,
//         }

//     }

//     async fn log(&self, db: &Pool<MySql>) -> bool {

//         let sql: &str = "INSERT INTO posts (upload_type, title, text, class_id, professor_id, dt) VALUES (1, ?, ?, ?, ?, NOW())";

//         sqlx::query(sql)
//             .bind(&self.title)
//             .bind(&self.text)
//             .bind(&self.class_id)
//             .bind(&self.professor_id)
//             .execute(db)
//             .await
//             .is_ok()

//     }

// }

// pub async fn upload(State(state): State<Arc<AppState>>, multipart: multipart::Multipart) -> Result<(), StatusCode> {

//     let download: Download = Upload::from_multipart(multipart)
//         .await?
//         .download(&state)
//         .await?;

//     let no_error: bool = match &download {
//         Download::File(download_file) => download_file.log(&state.db).await,
//         Download::Text(download_text) => download_text.log(&state.db).await,
//     };

//     if no_error {
//         return Ok(())
//     }
        
//     if let Download::File(download_file) = download {
//         let _ = download_file.remove_file(); // handle error case later
//     }

//     return Err(StatusCode::UNPROCESSABLE_ENTITY)?;

// }
