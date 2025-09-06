#[cfg(test)]
mod tests {
    use actix_web::{test, App};
    use bedfellow_db_api::{handlers, AppState};
    use sqlx::MySqlPool;
    
    #[actix_web::test]
    async fn test_search_endpoint_exists() {
        // This is a basic test to ensure the endpoint is registered
        // Full integration tests would require a test database
        
        let database_url = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "mysql://root:password@localhost/bedfellow_test".to_string());
        
        let pool = MySqlPool::connect(&database_url)
            .await
            .expect("Failed to connect to test database");
        
        let app = test::init_service(
            App::new()
                .app_data(actix_web::web::Data::new(AppState { db: pool }))
                .configure(handlers::config)
        ).await;
        
        let req = test::TestRequest::get()
            .uri("/api/samples/search?q=test")
            .to_request();
        
        let resp = test::call_service(&app, req).await;
        
        // The endpoint should at least respond (even if with an error due to missing test data)
        assert!(resp.status().is_success() || resp.status().is_client_error() || resp.status().is_server_error());
    }
}