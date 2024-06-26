use std::env;
use actix_web::{App, HttpServer};
mod spotify;
mod whosampled;

// comment to test actions

#[macro_use] extern crate log;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(|| {
        App::new()
            .service(spotify::spotify_controller::swap)
            .service(spotify::spotify_controller::refresh)
            .service(whosampled::whosampled_controller::sample_info)
            .service(whosampled::whosampled_controller::search)
    })
    .bind((env::var("HOST_IP").unwrap_or("127.0.0.1".to_string()), 8080))?
    .run()
    .await
}
