use sqlx::MySqlPool;


pub mod handlers;
pub mod models;
pub mod schema;
pub mod pagination;

pub struct AppState {
    pub db: MySqlPool,
}