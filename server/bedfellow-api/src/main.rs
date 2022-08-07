
use actix_web::{post, App, HttpServer, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use base64;


#[derive(Serialize, Deserialize, Debug)]
struct ApiResponse {
    access_token: String,
    token_type: String,
    scope: String,
    expires_in: i32,
    refresh_token: String
}

#[derive(Serialize, Deserialize)]
struct ApiRequest {
    grant_type: String,
    redirect_uri: String,
    code: String
}

#[post("/swap")]
async fn swap(req_body: String) -> impl Responder {
    let spotify_client_id="".to_owned();
    let spotify_client_secret="";
    let authz_token: String = format!("Basic {}", base64::encode(spotify_client_id + ":" + spotify_client_secret));

    let spotify_client_callback="org.danondso.bedfellow://callback";
    let _encryption_secret="";
    let _encryption_method="aes-256-ctr";


    let parsed_req_body: Vec<&str> = req_body.split("=").collect();

    let request = ApiRequest { 
        grant_type: "authorization_code".into(),
        redirect_uri: spotify_client_callback.into(),
        code: parsed_req_body[1].into()
    };

    let client = reqwest::Client::new();
    // TODO make this unwrap safer
    let result: ApiResponse = client.post("https://accounts.spotify.com/api/token")
        .header("Authorization", authz_token)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&request)
        .send()
        .await.ok().unwrap().json().await.ok().unwrap();

    debug!("Spotify Token API Result: {:#?}", result);
    return HttpResponse::Ok().json(result);
}


#[macro_use] extern crate log;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(|| {
        App::new()
            .service(swap)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

