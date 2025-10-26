#[cfg(test)]
mod tests {
    use super::super::lastfm_controller::*;
    use actix_web::{test, web, App};
    use serde_json::json;

    #[actix_web::test]
    async fn test_lastfm_auth_accepts_session_key_and_returns_token() {
        let app = test::init_service(App::new().service(web::resource("/lastfm/auth").route(web::post().to(auth_handler)))).await;
        
        let payload = json!({
            "session_key": "test_session_key_12345",
            "username": "test_user"
        });
        
        let req = test::TestRequest::post()
            .uri("/lastfm/auth")
            .set_json(&payload)
            .to_request();
        
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
        
        let body: serde_json::Value = test::read_body_json(resp).await;
        assert_eq!(body["session_key"], "test_session_key_12345");
        assert_eq!(body["username"], "test_user");
    }

    #[actix_web::test]
    async fn test_lastfm_auth_handles_invalid_session_key() {
        let app = test::init_service(App::new().service(web::resource("/lastfm/auth").route(web::post().to(auth_handler)))).await;
        
        let payload = json!({
            "session_key": "invalid_key"
        });
        
        let req = test::TestRequest::post()
            .uri("/lastfm/auth")
            .set_json(&payload)
            .to_request();
        
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success()); // Currently just echoes, will fail when we add validation
    }

    #[actix_web::test]
    async fn test_lastfm_validate_accepts_session_key_and_returns_valid_status() {
        let app = test::init_service(App::new().service(web::resource("/lastfm/validate").route(web::post().to(validate_handler)))).await;
        
        let payload = json!({
            "session_key": "valid_session_key_12345"
        });
        
        let req = test::TestRequest::post()
            .uri("/lastfm/validate")
            .set_json(&payload)
            .to_request();
        
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
        
        let body: serde_json::Value = test::read_body_json(resp).await;
        assert_eq!(body["valid"], true);
        assert_eq!(body["session_key"], "valid_session_key_12345");
    }

    #[actix_web::test]
    async fn test_lastfm_validate_returns_false_for_invalid_session_key() {
        let app = test::init_service(App::new().service(web::resource("/lastfm/validate").route(web::post().to(validate_handler)))).await;
        
        let payload = json!({
            "session_key": "invalid_session_key"
        });
        
        let req = test::TestRequest::post()
            .uri("/lastfm/validate")
            .set_json(&payload)
            .to_request();
        
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
        
        let body: serde_json::Value = test::read_body_json(resp).await;
        assert_eq!(body["valid"], false);
    }
}

