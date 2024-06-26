use sqlx::MySqlPool;


pub mod handlers;
pub mod models;
pub mod schema;

pub struct AppState {
    pub db: MySqlPool,
}