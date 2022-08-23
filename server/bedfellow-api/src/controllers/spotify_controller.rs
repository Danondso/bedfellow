use actix_web::{post, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use::std::env;
use base64;

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

#[post("/swap")]
pub async fn swap(req_body: String) -> impl Responder {
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
