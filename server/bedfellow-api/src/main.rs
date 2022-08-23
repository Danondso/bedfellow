use actix_web::{App, HttpServer};
mod controllers;

#[macro_use] extern crate log;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(|| {
        App::new()
            .service(controllers::spotify_controller::swap)
            .service(controllers::whosampled_controller::sample_info)
            .service(controllers::whosampled_controller::search)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
