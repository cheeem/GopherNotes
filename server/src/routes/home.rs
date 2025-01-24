use axum::extract::{ State, Query };
use axum::response;
use axum::http::StatusCode;
use sqlx::FromRow;
use sqlx::mysql::{ MySql, MySqlArguments };
use serde::{ Deserialize, Serialize };
use std::sync::Arc;
use crate::AppState;

#[derive(Serialize, FromRow)]
pub struct Class {
    class_code: String,
    department_code: String,
    name: String,
    post_count: u32,
}

#[derive(Deserialize)]
pub struct ClassSearch {
    input: Option<String>,
    page: Option<u32>,
}

const CLASS_PAGE_SIZE: u32 = 30;

pub async fn get_classes_by_code(State(state): State<Arc<AppState>>, Query(ClassSearch { input, page }): Query<ClassSearch>) -> Result<response::Json<Vec<Class>>, StatusCode> {

    let page: u32 = page.unwrap_or(0);

    let sql: &str = match input {
        Some(_) => "
            SELECT 
                classes.code AS class_code,
                departments.code AS department_code, 
                classes.name, 
                CAST(COUNT(posts.id) AS UNSIGNED) AS post_count 
            FROM classes 
            JOIN departments ON departments.id = classes.department_id 
            LEFT JOIN posts on posts.class_id = classes.id 
            GROUP BY departments.id, classes.id 
            HAVING LOWER(CONCAT(departments.code, classes.code)) LIKE LOWER(?) 
            ORDER BY 4 DESC, 1, 2 
            LIMIT ? OFFSET ? 
        ",
        None => "
            SELECT 
                classes.code AS class_code,
                departments.code AS department_code, 
                classes.name, 
                CAST(COUNT(posts.id) AS UNSIGNED) AS post_count 
            FROM classes 
            JOIN departments ON departments.id = classes.department_id 
            LEFT JOIN posts on posts.class_id = classes.id 
            GROUP BY departments.id, classes.id 
            ORDER BY 4 DESC, 1, 2 
            LIMIT ? OFFSET ? 
        "
    };

    let mut query: sqlx::query::QueryAs<MySql, Class, MySqlArguments> = sqlx::query_as(sql);

    if let Some(input) = input.map(|str| str.replace(' ', "")) {
        query = query.bind(format!("%{input}%"));
    }

    query = query
        .bind(CLASS_PAGE_SIZE)
        .bind(page * CLASS_PAGE_SIZE);
    
    let classes: Vec<Class> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| { println!("{:#?}", e); return StatusCode::INTERNAL_SERVER_ERROR })?;

    Ok(response::Json(classes))

}

pub async fn get_classes_by_professor(State(state): State<Arc<AppState>>, Query(ClassSearch { input, page }): Query<ClassSearch>) -> Result<response::Json<Vec<Class>>, StatusCode> {
    
    let page: u32 = page.unwrap_or(0);

    let sql: &str = match input {
        Some(_) => "
            SELECT 
                classes.code AS class_code,
                departments.code AS department_code, 
                classes.name, 
                CAST(COUNT(posts.id) AS UNSIGNED) AS post_count 
            FROM classes 
            JOIN professor_classes ON professor_classes.class_id = classes.id
            JOIN professors ON professors.id = professor_classes.professor_id
            JOIN departments ON departments.id = classes.department_id 
            LEFT JOIN posts on posts.class_id = classes.id 
            WHERE LOWER(professors.name) LIKE LOWER(?) 
            GROUP BY departments.id, classes.id 
            ORDER BY 4 DESC, 1, 2 
            LIMIT ? OFFSET ? 
        ",
        None => "
            SELECT 
                classes.code AS class_code,
                departments.code AS department_code, 
                classes.name, 
                CAST(COUNT(posts.id) AS UNSIGNED) AS post_count 
            FROM classes 
            JOIN departments ON departments.id = classes.department_id 
            LEFT JOIN posts on posts.class_id = classes.id 
            GROUP BY departments.id, classes.id 
            ORDER BY 4 DESC, 1, 2 
            LIMIT ? OFFSET ? 
        "
    };

    let mut query: sqlx::query::QueryAs<MySql, Class, MySqlArguments> = sqlx::query_as(sql);

    if let Some(input) = input {
        query = query.bind(format!("%{input}%"));
    }

    query = query
        .bind(CLASS_PAGE_SIZE)
        .bind(page * CLASS_PAGE_SIZE);
    
    let classes: Vec<Class> = query
        .fetch_all(&state.db)
        .await
        .map_err(|e| { println!("{:#?}", e); return StatusCode::INTERNAL_SERVER_ERROR })?;

    Ok(response::Json(classes))

}
