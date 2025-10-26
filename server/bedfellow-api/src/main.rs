use std::env;
use actix_web::{App, HttpServer};
mod spotify;
mod lastfm;

// comment to test actions

#[macro_use] extern crate log;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(|| {
        App::new()
            .service(spotify::spotify_controller::swap)
            .service(spotify::spotify_controller::refresh)
            .service(lastfm::lastfm_controller::auth_handler)
            .service(lastfm::lastfm_controller::validate_handler)
    })
    .bind((env::var("HOST_IP").unwrap_or("127.0.0.1".to_string()), 8085))?
    .run()
    .await
}
