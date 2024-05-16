use axum::response;
use serde::Serialize;


#[derive(Serialize)]
pub struct Note {
    id: u32,
    title: String,
    course_number: String,
    professor: String,
    semester: String,
    description: String,
}

pub async fn get_notes() -> response::Json<Vec<Note>> {
    let initial_notes: Vec<Note> = vec![
    Note {
        id: 1,
        title: "Machine Learning Fundamentals".to_string(),
        course_number: "CSCI 5521".to_string(),
        professor: "Catherine Zhao".to_string(),
        semester: "Spring 2024".to_string(),
        description: "CSCI 5521- Machine Learning Fundamentals - Catherine Zhao - (Spring 2024).pdf".to_string()
    },
    Note {
        id: 2,
        title: "Natural Language Processing".to_string(),
        course_number: "CSCI 5541".to_string(),
        professor: "Dongyeop Kang".to_string(),
        semester: "Spring 2024".to_string(),
        description: "CSCI 5541-Natural Language Processing-Dongyeop Kang-(Spring 2024).pdf".to_string()
    },
    Note {
        id: 3,
        title: "Introduction to Artificial Intelligence".to_string(),
        course_number: "CSCI 4511W".to_string(),
        professor: "Maria Gini".to_string(),
        semester: "Spring 2024".to_string(),
        description: "CSCI4511W-Introduction to Artificial Intelligence-Maria Gini-(Spring 2024).pdf".to_string()
    },
    Note {
        id: 4,
        title: "Machine Learning: Analysis and Methods".to_string(),
        course_number: "CSCI 5525".to_string(),
        professor: "Paul Schrater".to_string(),
        semester: "Spring 2024".to_string(),
        description: "CSCI5525-Machine Learning_ Analysis and Methods-Paul Schrater-(Spring 2024).pdf".to_string()
    },
    Note {
        id: 5,
        title: "Advanced Programming Principles".to_string(),
        course_number: "CSSI 2041".to_string(),
        professor: "James Moen".to_string(),
        semester: "Spring 2024".to_string(),
        description: "CSSI2041-Advanced Programming Principles-James Moen-(Spring 2024).pdf".to_string()
    },
];

    response::Json(initial_notes)
}
