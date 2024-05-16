use axum::response;
use serde::Serialize;

#[derive(Serialize)]
pub struct Class {
    class_code: String,
    department_code: String,
    professors: Vec<String>,
}

pub async fn get_classes() -> response::Json<Vec<Class>> {

    let classes: Vec<Class> = vec![
        Class {
            department_code: "CSCI".to_string(),
            class_code: "1001".to_string(),
            professors: vec!["Jessica".to_string(), "Francesca".to_string()],
        },
    ];

    response::Json(classes)

}