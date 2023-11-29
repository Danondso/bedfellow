use actix_web::{post, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use::std::env;
use base64;

#[derive(Serialize, Deserialize, Debug)]
struct SpotifyLoginApiResponse {
    access_token: String,
    token_type: String,
    scope: String,
    expires_in: i32,
    refresh_token: String
}

#[derive(Serialize, Deserialize, Debug)]
struct SpotifyApiErrorResponse {
    error: String,
    error_description: String,
}

#[derive(Serialize, Deserialize, Debug)]
 struct SpotifyLoginApiRequest {
    grant_type: String,
    redirect_uri: String,
    code: String
}

fn create_auth_header() -> String {
    let spotify_client_id: String = env::var("SPOTIFY_CLIENT_ID").ok().unwrap().to_owned();
    let spotify_client_secret: String = env::var("SPOTIFY_CLIENT_SECRET").ok().unwrap(); 
    return format!("Basic {}", base64::encode(spotify_client_id + ":" + &spotify_client_secret));
}

async fn send_request<T: serde::Serialize>(request_body: T) -> Result<reqwest::Response, reqwest::Error> {
    let result = reqwest::Client::new().post("https://accounts.spotify.com/api/token")
    .header("Authorization", create_auth_header())
    .header("Content-Type", "application/x-www-form-urlencoded")
    .form(&request_body)
    .send()
    .await;
    return result;
}

#[post("/token")]
pub async fn swap(req_body: String) -> impl Responder {
    let spotify_client_callback: String = env::var("SPOTIFY_CLIENT_CALLBACK").ok().unwrap();
    let _encryption_secret: String = env::var("ENCRYPTION_SECRET").ok().unwrap();
    let _encryption_method: &str = "aes-256-ctr";
    let parsed_req_body: Vec<&str> = req_body.split("=").collect();

    let request: SpotifyLoginApiRequest = SpotifyLoginApiRequest { 
        grant_type: "authorization_code".into(),
        redirect_uri: spotify_client_callback.into(),
        code: parsed_req_body[1].trim_end_matches("&client_id").into()
    };

    debug!("REQUEST::: {:?}", request);
    let result = send_request(request).await;

    if result.is_ok() {
        let response = result.unwrap();
        if response.status().is_success() {
            let payload: SpotifyLoginApiResponse = response.json().await.ok().unwrap();
            debug!("Spotify Token API Result: {:#?}", payload);
            return HttpResponse::Ok().json(payload);
        } else {
            let payload: SpotifyApiErrorResponse = response.json().await.ok().unwrap();
            error!("Spotify Token API Error {:?}", payload);
            return HttpResponse::BadRequest().json(payload);
        }
    } 
    // TODO augment this or pass back the response from Spotify..
    return HttpResponse::InternalServerError().into();
    
}

#[derive(Serialize, Deserialize, Debug)]
struct SpotifyRefreshApiResponse {
    access_token: String,
    token_type: String,
    scope: String,
    expires_in: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct SpotifyRefreshRequestBody {
    grant_type: String,
    refresh_token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RefreshRequestBody {
    refresh_token: String,
}

#[post("/refresh")]
pub async fn refresh(req_body: String) -> impl Responder {
    let refresh_request_body: RefreshRequestBody = serde_json::from_str(&req_body).unwrap();
    let request: SpotifyRefreshRequestBody = SpotifyRefreshRequestBody { 
        grant_type: "refresh_token".to_string(),
        refresh_token: refresh_request_body.refresh_token,
    };
    debug!("{:?}", request);
    let result = send_request(request).await;

    if result.is_ok() {
        let payload: SpotifyRefreshApiResponse = result.unwrap().json().await.ok().unwrap();
        debug!("Spotify Token API Refresh Result: {:#?}", payload);
        return HttpResponse::Ok().json(payload);
    } else {
        return HttpResponse::InternalServerError().json(result.err().unwrap().to_string());
    }
}
