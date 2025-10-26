use actix_web::{post, web, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
struct LastFmAuthRequest {
    session_key: String,
    username: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct LastFmAuthResponse {
    session_key: String,
    username: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct LastFmValidateRequest {
    session_key: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct LastFmValidateResponse {
    valid: bool,
    session_key: String,
}

fn get_lastfm_api_key() -> Result<String, env::VarError> {
    env::var("LASTFM_API_KEY")
}

fn get_lastfm_api_secret() -> Result<String, env::VarError> {
    env::var("LASTFM_API_SECRET")
}

#[post("/lastfm/auth")]
pub async fn auth_handler(req: web::Json<LastFmAuthRequest>) -> impl Responder {
    // TODO: Implement last.fm authentication validation
    // For now, just echo back the session key
    HttpResponse::Ok().json(LastFmAuthResponse {
        session_key: req.session_key.clone(),
        username: req.username.clone().unwrap_or_else(|| "unknown".to_string()),
    })
}

#[post("/lastfm/validate")]
pub async fn validate_handler(req: web::Json<LastFmValidateRequest>) -> impl Responder {
    // TODO: Implement last.fm session validation
    // For now, consider session key valid if it starts with "valid_"
    let is_valid = req.session_key.starts_with("valid_");
    
    HttpResponse::Ok().json(LastFmValidateResponse {
        valid: is_valid,
        session_key: req.session_key.clone(),
    })
}

