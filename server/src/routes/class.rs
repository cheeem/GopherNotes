use axum::extract::{ State, Query };
use axum::response;
use axum::http::StatusCode;
// use sqlx::types::chrono;
use sqlx::FromRow;
use serde::{ Deserialize, Serialize };
use chrono::{ DateTime, Utc };
use std::sync::Arc;
use crate::AppState;
// use sqlx::types::chrono::{DateTime, Utc};

#[derive(Serialize, FromRow, Deserialize)]
pub struct Post {
    id: u8,
    title: String,
    upload_type: u8,
    path: String,
    #[serde(with = "chrono::serde::ts_seconds")]
    dt: DateTime<Utc>,
    text: Option<String>,
    professor_name: String, // TODO: add text field
}

#[derive(Deserialize)]
pub struct DepartmentClassCode {
    department_code: String,
    class_code: String,
}

pub async fn get_posts(
    State(state): State<Arc<AppState>>, 
    Query(DepartmentClassCode { department_code, class_code }): Query<DepartmentClassCode>
) -> Result<response::Json<Vec<Post>>, StatusCode> {

    let sql = "
        SELECT 
            posts.id,
            posts.title,
            posts.upload_type,
            posts.path,
            posts.dt,
            posts.text,
            professors.name AS professor_name
        FROM posts
        JOIN classes ON posts.class_id = classes.id
        JOIN departments ON classes.department_id = departments.id
        LEFT JOIN professors ON posts.professor_id = professors.id
        WHERE departments.code = ?
        AND classes.code = ?
    ";

    let posts: Vec<Post> = sqlx::query_as(sql)
        .bind(department_code.to_uppercase())
        .bind(class_code.to_uppercase())
        .fetch_all(&state.db)
        .await
        .map_err(|e| {
            println!("{:#?}", e);
            StatusCode::UNPROCESSABLE_ENTITY
        })?;

    Ok(response::Json(posts))

}