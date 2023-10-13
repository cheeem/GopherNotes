#![allow(unused_imports)]
use tokio;
use axum::routing::{ get, post };
use axum::Router;
use axum::extract::{ Query, Form, Multipart, multipart };
use axum::response::Json;
use axum::body::Bytes;
use axum_typed_multipart::{ TryFromMultipart, TypedMultipart };
use http::{ Method, StatusCode };
use tower_http::cors::{ CorsLayer, Any };
use serde::Deserialize;
use std::net::SocketAddr;
use std::fs::{ write, File };

#[derive(TryFromMultipart)]
struct FileUpload {
    title: String,
    image_filename: String,
    image: Bytes,
}

// #[derive(Deserialize)]
// struct SearchRequest  {
//     file: String,
// }

#[tokio::main]
async fn main() {

    let cors: CorsLayer = CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_origin(Any);

    let app: Router = Router::new()
        .route("/form", post(upload))
        .layer(cors);

    let addr: SocketAddr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("Listening on {addr}");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
    
}

async fn upload(TypedMultipart(upload): TypedMultipart<FileUpload>) -> StatusCode {

    let title: &str = &upload.title;
    let filename: &str = &upload.image_filename; 
    let path: &str = &format!("./img/{filename}");

    File::create(path).unwrap();

    write(path, &upload.image).unwrap();

    println!("Uploaded {filename} Under The Title \"{title}\"");

    StatusCode::CREATED

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
