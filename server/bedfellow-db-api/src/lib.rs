use sqlx::MySqlPool;


pub mod handlers;
pub mod models;
pub mod schema;
pub mod pagination;
pub mod queries;

pub struct AppState {
    pub db: MySqlPool,
}