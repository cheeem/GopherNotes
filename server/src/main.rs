#![allow(unused_imports)]
use tokio;
use axum::routing::{ get, post };
use axum::Router;
use axum::http::{ Method, StatusCode };
use axum::extract::{ Query, Form, Multipart, multipart, State };
use axum::response::Json;
use axum::body::Bytes;
use axum_typed_multipart::{ TryFromMultipart, TypedMultipart };
use tower_http::cors::{ CorsLayer, Any };
use serde::{ Deserialize, Serialize };
use std::net::SocketAddr;
use std::fs::{ write, File };
use std::sync::Arc;
use sqlx::{ FromRow, Pool };
use sqlx::mysql::{ MySql, MySqlPoolOptions, };
//use chrono::DateTime;

struct AppState {
    db: Pool<MySql>,
}

#[derive(TryFromMultipart)]
struct Upload {
    x500: String,
    title: String,
    filename: String,
    image: Bytes,
}

#[derive(FromRow, Serialize)]
struct Post {
    title: String,
    x500: String, 
    img: String,
    likes: i32,
    //date: DateTime,
}

// #[derive(Deserialize)]
// struct SearchRequest  {
//     file: String,
// }

#[tokio::main]
async fn main() {

    let db: Pool<MySql> = MySqlPoolOptions::new()
        .connect("mysql://cheemie:ex_pw@localhost:3306/gophernotes")
        .await
        .unwrap();

    let state: Arc<AppState> = Arc::new(AppState { db });

    let cors: CorsLayer = CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_origin(Any);

    let app: Router = Router::new()
        .route("/upload", post(upload))
        .route("/posts", get(posts))
        .layer(cors)
        .with_state(state);

    let addr: SocketAddr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("Listening on {addr}");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
    
}

async fn upload(State(state): State<Arc<AppState>>, TypedMultipart(Upload { x500, title, filename, image }): TypedMultipart<Upload>) -> Result<(), StatusCode> {
    
    let path: &str = &format!("./../client/public/img/{filename}");

    File::create(path).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

    write(path, &image).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

    println!("Uploaded {filename} Under The Title \"{title}\"");

    let sql = format!("
        INSERT INTO posts (
            x500, title, img, likes, date
        ) VALUES (
            '{x500}', '{title}', '{filename}', 0, '2023-08-08'
        )
    ");

    sqlx::query(&sql)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;

    Ok(())

}

async fn posts(State(state): State<Arc<AppState>>) -> Result<Json<Vec<Post>>, StatusCode> {

    let sql: &str = "
        SELECT 
            x500,
            title,
            img,
            likes 
        FROM posts 
    ";

    let posts: Vec<Post> = sqlx::query_as(sql)
        .fetch_all(&state.db)
        .await
        .map_err(|e| {println!("{:#?}", e); return StatusCode::UNPROCESSABLE_ENTITY})?;
    
    Ok(Json(posts))

}

// async fn form(Form(data): Form<FormData>) -> Html<String> {

//     let FormData { input, input2 } = data;

//     Html(format!("
//         <p> 
//             Here's what you submitted
//         </p>
//         <ul> 
//             <li> {input} </li>
//             <li> {input2} </li>
//         </ul>
//     "))

// }
