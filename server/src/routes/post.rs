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
    title: String, 
    score: i32,
    upload_type: u8,
    file_name: Option<String>,
    #[serde(with = "chrono::serde::ts_seconds")]
    dt: DateTime<Utc>,
    text: Option<String>,
    professor_name: Option<String>,
}

#[derive(Deserialize)]
pub struct PostId {
    id: u32,
}

pub async fn get_post(
    State(state): State<Arc<AppState>>, 
    Query(PostId { id }): Query<PostId>,
) -> Result<response::Json<Post>, StatusCode> {

    let sql: &str = "
        SELECT 
            posts.title, 
            posts.score,
            posts.upload_type,
            posts.file_name,
            posts.dt,
            posts.text,
            professors.name AS professor_name,
            users.id as user_id,
            users.username 
        FROM posts
        JOIN classes ON posts.class_id = classes.id
        JOIN departments ON classes.department_id = departments.id
        LEFT JOIN professors ON posts.professor_id = professors.id
        LEFT JOIN users ON posts.user_id = users.id 
        WHERE posts.deleted = 0 
        AND posts.id = ? 
    ";
        
    let post: Post = sqlx::query_as(sql)
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| { println!("{:#?}", e); return StatusCode::INTERNAL_SERVER_ERROR })?;

    Ok(response::Json(post))

}