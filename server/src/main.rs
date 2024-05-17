// external libraries
use axum::http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use axum::http::{HeaderValue, Method};
use axum::routing::{get, post, put};
use axum::Router;
use dotenv::dotenv;
use tokio;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use axum::middleware::from_fn_with_state;

// use sqlx;
use sqlx::{ MySql, Pool, };
use sqlx::mysql::MySqlPoolOptions;
use sqlx::query;

// standard library
use std::env;
use std::num::ParseIntError;
use std::sync::Arc;

use serde::Serialize;
// internal modules
mod routes;

pub struct AppState {
    db: Pool<MySql>,
}

#[derive(Serialize,Debug)]
struct Department {
    id: i32,
    name: String,
    code: String,
}


#[tokio::main]
async fn main() {
    dotenv().ok();

    let db_url: &str = &env::var("DB_URL").expect("db url env");

    let server_addr: &str = &env::var("SERVER_ADDR").expect("server addr env");
    let client_addr: &str = &env::var("CLIENT_ADDR").expect("client addr env");

    let cors: CorsLayer = CorsLayer::new()
        .allow_origin(
            client_addr
                .parse::<HeaderValue>()
                .expect("client addr parse"),
        )
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    let db: Pool<MySql> = MySqlPoolOptions::new()
        .connect(db_url)
        .await
        .expect("database connection");

    let state: Arc<AppState> = Arc::new(AppState {
        db,
    });

    let result = sqlx::query_as!(Department,"SELECT id, name, code FROM department")
    .fetch_one(&state.db)
    .await;



    // let auth_secret: Arc<str> = Arc::from(auth_secret);

    let app: Router = Router::new()
        .route("/", get(routes::home::get_notes))
        // .route("/client/my/balance/", get(client::balance::balance).route_layer(from_fn_with_state(auth_secret.clone(), utils::auth::auth)))
        .layer(cors)
        .with_state(state.clone());

    let listener: TcpListener = TcpListener::bind(server_addr).await.expect("tcp listener");

    println!(
        "Server listening on {:#?}",
        listener.local_addr().expect("local addr")
    );

    axum::serve(listener, app).await.expect("axum serve");
}
