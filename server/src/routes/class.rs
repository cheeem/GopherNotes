use axum::extract::{ State, Query, Path };
use axum::response;
use axum::http::StatusCode;
// use sqlx::types::chrono;
use sqlx::FromRow;
use sqlx::mysql::{ MySql, MySqlArguments };
use serde::{ Deserialize, Serialize };
use chrono::{ DateTime, Utc };
use std::sync::Arc;
use crate::AppState;
// use sqlx::types::chrono::{DateTime, Utc};

#[derive(Serialize, FromRow, Deserialize)]
pub struct Post {
    id: u32,
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
pub struct PostSearch {
    input: Option<String>,
}

pub async fn get_posts_by_title(
    State(state): State<Arc<AppState>>, 
    Path((department_code, class_code)): Path<(String, String)>,
    Query(PostSearch { input }): Query<PostSearch>,
) -> Result<response::Json<Vec<Post>>, StatusCode> {

    let sql: &str = match input {
        Some(_) => "
            SELECT 
                posts.id,
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
            AND departments.code = ? 
            AND classes.code = ? 
            AND LOWER(title) LIKE LOWER(?)
        ",
        None => "
            SELECT 
                posts.id,
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
            AND departments.code = ?
            AND classes.code = ?
        "
    };

    let mut query: sqlx::query::QueryAs<MySql, Post, MySqlArguments> = sqlx::query_as(sql)
        .bind(department_code.to_uppercase())
        .bind(class_code);

    if let Some(input) = input {
        query = query.bind(format!("%{input}%"));
    }
        
    let posts: Vec<Post> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| { println!("{:#?}", e); return StatusCode::INTERNAL_SERVER_ERROR })?;
    

    Ok(response::Json(posts))

}

pub async fn get_posts_by_professor(
    State(state): State<Arc<AppState>>, 
    Path((department_code, class_code)): Path<(String, String)>,
    Query(PostSearch { input }): Query<PostSearch>,
) -> Result<response::Json<Vec<Post>>, StatusCode> {

    let sql: &str = match input {
        Some(_) => "
            SELECT 
                posts.id,
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
            AND departments.code = ? 
            AND classes.code = ? 
            AND LOWER(professor.name) LIKE LOWER(?)
        ",
        None => "
            SELECT 
                posts.id,
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
            AND departments.code = ?
            AND classes.code = ?
        "
    };

    let mut query: sqlx::query::QueryAs<MySql, Post, MySqlArguments> = sqlx::query_as(sql)
        .bind(department_code.to_uppercase())
        .bind(class_code);

    if let Some(input) = input {
        query = query.bind(format!("%{input}%"));
    }
        
    let posts: Vec<Post> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| { println!("{:#?}", e); return StatusCode::INTERNAL_SERVER_ERROR })?;
    

    Ok(response::Json(posts))

}