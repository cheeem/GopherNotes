use axum::extract::{ State, Query };
use axum::response;
use axum::http::StatusCode;
use sqlx::types::chrono;
use sqlx::{Database, FromRow};
use sqlx::mysql::{ MySql, MySqlArguments };
use serde::{ Deserialize, Serialize };
use std::sync::Arc;
use crate::AppState;
use chrono::{DateTime, Utc};



#[derive(Serialize, FromRow)]
pub struct Post {
    id: i32,
    file_type: String,
    path: String,
    dt: DateTime<Utc>,
    class_name: String,
    department_name: String, 
    professor_name: String
}

#[derive(Deserialize)]
pub struct PostSearch {
    input: Option<String>,
}


pub async fn get_posts_by_class_and_department(
    State(state): State<Arc<AppState>>, 
    Query(PostSearch{input}): Query<PostSearch>
) -> Result<response::Json<Vec<Post>>, StatusCode> {
    let sql = "SELECT 
    posts.id,
    posts.title,
    posts.file_type,
    posts.path,
    posts.dt,
    classes.name AS class_name,
    departments.name AS department_name,
    professors.name AS professor_name
    FROM posts
    JOIN classes ON posts.class_id = classes.id
    JOIN departments ON classes.department_id = departments.id
    LEFT JOIN professors ON posts.professor_id = professors.id
    WHERE CONCAT(departments.code, classes.code) LIKE ?";


    let mut query: sqlx::query::QueryAs<MySql, Post, MySqlArguments> = sqlx::query_as(sql);
    
    if let Some(input) = input.map(|str| str.replace(' ', "")) {
        query = query.bind(format!("%{input}%"));
    }


    let posts: Vec<Post> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| {
            println!("{:#?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(response::Json(posts))

}

