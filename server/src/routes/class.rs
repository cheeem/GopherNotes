use axum::{
    extract::{State, Query},
    Json,
    response::IntoResponse,
    http::StatusCode,
};
use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::AppState;

#[derive(Serialize, FromRow)]
pub struct Class {
    class_code: i32,
    department_code: String,
}

#[derive(Deserialize)]
pub struct ClassSearch {
    input: String,
}

pub async fn get_classes(
    State(state): State<Arc<AppState>>,
    Query(ClassSearch{input}): Query<ClassSearch>
) -> impl IntoResponse {

    let sql = "
        SELECT 
            classes.course_number AS class_code,
            department.code AS department_code 
        FROM classes 
        JOIN department ON department.id = classes.department_id 
        WHERE CONCAT(department.code, classes.course_number) LIKE ?
    ";

    let pattern = format!("%{input}%").replace(" ","");

    match sqlx::query_as::<_, Class>(sql)
        .bind(pattern)
        .fetch_all(&state.db)
        .await
    {
        Ok(classes) => Ok(Json(classes)),
        Err(e) => {
            println!("Database error: {:?}", e); 
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
