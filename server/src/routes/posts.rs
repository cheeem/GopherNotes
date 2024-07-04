use axum::extract::{ State, Query };
use axum::response;
use axum::http::StatusCode;
// use sqlx::types::chrono;
use sqlx::{Database, FromRow};
use sqlx::mysql::{ MySql, MySqlArguments };
use serde::{ Deserialize, Serialize };
use std::sync::Arc;
use crate::AppState;
// use sqlx::types::chrono::{DateTime, Utc};
use chrono::{DateTime, Utc};


#[derive(Serialize, FromRow, Deserialize)]
pub struct Post {
    id: u8,
    title: String,
    upload_type: u8,
    path: String,

    #[serde(with = "chrono::serde::ts_seconds")]
    dt: DateTime<Utc>,

    text: String,
    professor_name: String, // TODO: add text field
}

#[derive(Deserialize)]
pub struct PostSearch {
    department_code: String,
    class_code: String, // TODO, add professor, tags, weeks tags
    // professor: String,
}


pub async fn get_posts_by_class_and_department(
    State(state): State<Arc<AppState>>, 
    Query(PostSearch{department_code,class_code}): Query<PostSearch>
) -> Result<response::Json<Vec<Post>>, StatusCode> {
    let sql = "SELECT 
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
    AND classes.code = ?";


    let mut query: sqlx::query::QueryAs<MySql, Post, MySqlArguments> = sqlx::query_as(sql);
    
    // if let department_code = department_code.map(|str| str.replace(' ', "")) {
    query = query
                .bind(department_code.to_uppercase())
                .bind(class_code.to_uppercase());
    // }


    let posts: Vec<Post> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| {
            println!("{:#?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(response::Json(posts))

}

