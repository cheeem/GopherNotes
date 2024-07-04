// external libraries
use dotenv::dotenv;
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
    // img_path: String, 
    // img_count: Mutex<u32>,
}

#[tokio::main]
async fn main() {

    dotenv().ok();

    let db_url: &str = &env::var("DB_URL").expect("db url env");

    let server_addr: &str = &env::var("SERVER_ADDR").expect("server addr env");
    let client_addr: &str = &env::var("CLIENT_ADDR").expect("client addr env");
    
    // let img_path: String = env::var("IMG_PATH").expect("img path env");

    // let img_count: Mutex<u32> = Mutex::new(get_img_count(&img_path));

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
        // img_path,
        // img_count,
    });

    let app: Router = Router::new() 
        .route("/home/get_classes_by_code", get(routes::home::get_classes_by_code))
        .route("/home/get_classes_by_professor", get(routes::home::get_classes_by_professor))
        .route("/home/get_posts_by_classes_and_department", get(routes::posts::get_posts_by_class_and_department))
        // .route("/upload/upload", post(routes::upload::upload))
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

fn get_img_count(img_path: &str) -> u32 {

    let dir: fs::ReadDir = fs::read_dir(img_path).expect("read img dir");

    let mut img_count: u32 = 0;

    for entry in dir {
        
        let file_name: ffi::OsString = entry.expect("img entry error").file_name();
        let file_name: &str = file_name.to_str().expect("img file name not found");

        let dot_pos: usize = file_name.rfind('.').expect("img file has not file extension");
        let file_name: &str = &file_name[..dot_pos];
        
        let img_idx: u32 = file_name.parse().expect("img file name is not numerical");
        
        if img_idx > img_count {
            img_count = img_idx
        }

    }

    img_count

}
