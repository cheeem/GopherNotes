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
pub struct ProfessorSearch {
    input: String,
}

pub async fn get_professors(
    State(state): State<Arc<AppState>>,
    Query(ProfessorSearch{input}): Query<ProfessorSearch>
) -> impl IntoResponse {

    let sql = "
    SELECT 
    c.course_number AS class_code, 
    d.code AS department_code
FROM 
    professor p
JOIN 
    professor_classes pc ON p.id = pc.professor_id
JOIN 
    classes c ON pc.class_id = c.id
JOIN 
    department d ON c.department_id = d.id
WHERE 
    p.name LIKE ?;

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
