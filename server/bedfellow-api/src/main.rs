
use actix_web::{get, web, post, App, HttpServer, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use::std::env;
use base64;
use std::process::{Command};


#[derive(Serialize, Deserialize, Debug)]
struct ApiResponse {
    access_token: String,
    token_type: String,
    scope: String,
    expires_in: i32,
    refresh_token: String
}

#[derive(Serialize, Deserialize, Debug)]
struct ApiRequest {
    grant_type: String,
    redirect_uri: String,
    code: String
}

#[derive(Serialize, Deserialize, Debug)]
struct Track {
    track_name: String,
    artist: String,
    year: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct WhoSampledResponse {
    samples: Vec<Track>,
    sampled_by: Vec<Track>,
    covers: Vec<Track>
}

#[post("/swap")]
async fn swap(req_body: String) -> impl Responder {
    let spotify_client_id: String = env::var("SPOTIFY_CLIENT_ID").ok().unwrap().to_owned();
    let spotify_client_secret: String = env::var("SPOTIFY_CLIENT_SECRET").ok().unwrap(); 
    let authz_token: String = format!("Basic {}", base64::encode(spotify_client_id + ":" + &spotify_client_secret));

    let spotify_client_callback: String = env::var("SPOTIFY_CLIENT_CALLBACK").ok().unwrap();
    let _encryption_secret: String = env::var("ENCRYPTION_SECRET").ok().unwrap();
    let _encryption_method: &str = "aes-256-ctr";

    let parsed_req_body: Vec<&str> = req_body.split("=").collect();

    let request: ApiRequest = ApiRequest { 
        grant_type: "authorization_code".into(),
        redirect_uri: spotify_client_callback.into(),
        code: parsed_req_body[1].into()
    };

    debug!("{:?}", request);
    // TODO make this a singleton once refresh is present
    let result = reqwest::Client::new().post("https://accounts.spotify.com/api/token")
        .header("Authorization", authz_token)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&request)
        .send()
        .await;

    if result.is_ok() {
      let payload: ApiResponse = result.unwrap().json().await.ok().unwrap();
      debug!("Spotify Token API Result: {:#?}", payload);
      info!("{:?}",payload);
      return HttpResponse::Ok().json(payload);
    } else {
        return HttpResponse::BadRequest().json(result.err().unwrap().to_string());
    }
}

#[get("/sample-info/{artist}/{track_name}")]
async fn sample_info(path: web::Path<(String, String)>) -> impl Responder {
    let (artist, track_name) = path.into_inner();
    let python_output = Command::new("./run_python.sh")
        .arg(format!("/{}/{}", artist, track_name))
        .output();
    if python_output.is_ok() {
        let unwrapped_results = python_output.unwrap();
        let sample_results: String = String::from_utf8_lossy(&unwrapped_results.stdout).to_string();
        return HttpResponse::Ok().json(&sample_results);
    } else {
        let unwrapped_error = python_output.unwrap_err();
        return HttpResponse::BadRequest().json(&unwrapped_error.to_string());
    }
} 


#[macro_use] extern crate log;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(|| {
        App::new()
            .service(swap)
            .service(sample_info)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

