// external libraries
use dotenv::dotenv;
use lazy_static::lazy_static;
use tokio;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use axum::routing::{ get, post, put };
use axum::Router;
use axum::http::{ HeaderValue, Method };
use axum::http::header::{ ACCEPT, AUTHORIZATION, CONTENT_TYPE };
// use axum::middleware::from_fn_with_state;
use sqlx::{ MySql, Pool, };
use sqlx::mysql::MySqlPoolOptions;
// standard library
use std::env;
use std::sync::Arc;
use std::sync::Mutex;
use std::fs;
use std::ffi;
// internal modules
mod routes;

pub struct AppState {
    db: Pool<MySql>,
    upload_count: Mutex<u32>,
}

lazy_static! {
    static ref UPLOAD_PATH: String = env::var("UPLOAD_PATH").expect("upload path env");
}

#[tokio::main]
async fn main() {

    dotenv().ok();

    let db_url: &str = &env::var("DB_URL").expect("db url env");

    let server_addr: &str = &env::var("SERVER_ADDR").expect("server addr env");
    let client_addr: &str = &env::var("CLIENT_ADDR").expect("client addr env");
    
    let upload_count: Mutex<u32> = Mutex::new(get_upload_count());

    let cors: CorsLayer = CorsLayer::new()
        .allow_origin(client_addr.parse::<HeaderValue>().expect("client addr parse"))
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    let db: Pool<MySql> = MySqlPoolOptions::new()
        .connect(db_url)
        .await
        .expect("database connection");

    let state: Arc<AppState> = Arc::new(AppState {
        db,
        upload_count,
    });

    let app: Router = Router::new() 
        .route("/class/:department_code/:class_code/get_posts_by_title", post(routes::class::get_posts_by_title))
        .route("/class/:department_code/:class_code/get_posts_by_professor", post(routes::class::get_posts_by_professor))
        .route("/home/get_classes_by_code", get(routes::home::get_classes_by_code))
        .route("/home/get_classes_by_professor", get(routes::home::get_classes_by_professor))
        .route("/post/get_post", get(routes::post::get_post))
        .route("/upload/upload", post(routes::upload::upload))
        .layer(cors)
        .with_state(state.clone());

    let listener: TcpListener = TcpListener::bind(server_addr)
        .await
        .expect("tcp listener");

    println!("Server listening on {:#?}", listener.local_addr().expect("local addr"));

    axum::serve(listener, app)
        .await
        .expect("axum serve");

}

fn get_upload_count() -> u32 {

    let dir: fs::ReadDir = fs::read_dir(&*UPLOAD_PATH).expect("read img dir");

    let mut upload_count: u32 = 0;

    for entry in dir {
        
        let file_name: ffi::OsString = entry.expect("img entry error").file_name();
        let file_name: &str = file_name.to_str().expect("img file name not found");

        let dot_pos: usize = file_name.rfind('.').expect("img file has not file extension");
        let file_name: &str = &file_name[..dot_pos];
        
        let upload_idx: u32 = file_name.parse().expect("img file name is not numerical");
        
        if upload_idx > upload_count {
            upload_count = upload_idx
        }

    }

    upload_count

}