
use std::fs::File;
use std::io::BufReader;

use actix_web::dev::ServiceResponse;
use actix_web::http::StatusCode;
use actix_web::{test, web, App};
use bedfellow_db_api::schema::{HealthCheckSchema, InsertSamplesRequestSchema, SamplesResponseSchema, PaginatedSearchResponse};
use bedfellow_db_api::{handlers, AppState};
use sqlx::MySqlPool;

/// Unfortunately, for the moment these tests require a running mysql server to work
/// For whatever reason when running in a docker container, you need to set the user to root or create a root user
/// To run tests, you'll need to set an env var for DATABASE_URL similar to this: "mysql://root:password@localhost/{databaseName}"

#[sqlx::test(fixtures("schema"))]
async fn test_healthchecker_get(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let req = test::TestRequest::get().uri("/api/healthchecker").to_request();

    let resp: HealthCheckSchema = test::call_and_read_body_json(&app, req).await;
    assert_eq!(resp.status, "success");
    assert_eq!(resp.message, "Bedfellow DB API is Live 🎧💿🎙️");
}

#[sqlx::test(fixtures("schema"))]
async fn test_create_and_fetch_samples(pool: MySqlPool) {

    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // Open the file in read-only mode with buffer.
    let file = File::open("test_resource/sample-create-payload.0.json").unwrap();
    let reader = BufReader::new(file);

    let json: InsertSamplesRequestSchema = serde_json::from_reader(reader).unwrap();
    let req = test::TestRequest::post().uri("/api/samples").set_json(serde_json::json!(json)).to_request();

    let resp: ServiceResponse = test::call_service(&app, req).await;

    assert_eq!(resp.status(), StatusCode::NO_CONTENT);

    let get_req = test::TestRequest::get().uri("/api/samples?artist_name=Horn%20Goat&track_name=Beat%20up%20shit").to_request();

    let resp: SamplesResponseSchema = test::call_and_read_body_json(&app, get_req).await;

    assert_eq!(resp.artist, "Horn Goat");
    assert_eq!(resp.track, "Beat up shit");
}


#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_create_samples_conflict(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // Open the file in read-only mode with buffer.
    let file = File::open("test_resource/sample-create-payload.1.json").unwrap();
    let reader = BufReader::new(file);

    let json: InsertSamplesRequestSchema = serde_json::from_reader(reader).unwrap();
    let req = test::TestRequest::post().uri("/api/samples").set_json(serde_json::json!(json)).to_request();

    let resp: ServiceResponse = test::call_service(&app, req).await;

    assert_eq!(resp.status(), StatusCode::CONFLICT);
}

#[sqlx::test(fixtures("schema"))]
async fn test_get_samples_not_found(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let get_req = test::TestRequest::get().uri("/api/samples?artist_name=Horn%20Goat&track_name=Beat%20up%20shit").to_request();

    let resp: ServiceResponse = test::call_service(&app, get_req).await;

    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[sqlx::test(fixtures("schema"))]
async fn test_get_samples_bad_request(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let get_req = test::TestRequest::get().uri("/api/samples?artist_name=Horn%20Goat").to_request();

    let resp: ServiceResponse = test::call_service(&app, get_req).await;

    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
}

// TODO create test where duplicate sample track is uploaded, ignored, and samples created anyway
// TODO assert on not found and bad request test bodies

// Search endpoint tests

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_basic(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let req = test::TestRequest::get()
        .uri("/api/samples/search")
        .to_request();

    let resp: PaginatedSearchResponse = test::call_and_read_body_json(&app, req).await;
    
    assert!(!resp.data.is_empty());
    assert_eq!(resp.pagination.current_page_size, resp.data.len());
    assert!(resp.pagination.total_count > 0);
    assert_eq!(resp.sorting.field, "created_at");
    assert_eq!(resp.sorting.order, "desc");
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_with_query(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let req = test::TestRequest::get()
        .uri("/api/samples/search?q=Bound")
        .to_request();

    let resp: PaginatedSearchResponse = test::call_and_read_body_json(&app, req).await;
    
    // Should match "Bound 2" in the test data
    assert!(!resp.data.is_empty());
    assert_eq!(resp.search.query, Some("Bound".to_string()));
    for sample in &resp.data {
        assert!(sample.artist.to_lowercase().contains("bound") || 
                sample.track.to_lowercase().contains("bound"));
    }
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_pagination(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // First page
    let req1 = test::TestRequest::get()
        .uri("/api/samples/search?limit=2")
        .to_request();

    let resp1: PaginatedSearchResponse = test::call_and_read_body_json(&app, req1).await;
    
    assert_eq!(resp1.data.len(), 2);
    assert!(resp1.pagination.has_more);
    assert!(resp1.pagination.next_cursor.is_some());
    
    // Second page using cursor
    let cursor = resp1.pagination.next_cursor.unwrap();
    let req2 = test::TestRequest::get()
        .uri(&format!("/api/samples/search?limit=2&cursor={}", cursor))
        .to_request();
        
    let resp2: PaginatedSearchResponse = test::call_and_read_body_json(&app, req2).await;
    
    // Should have different data
    assert_ne!(resp1.data[0].id, resp2.data[0].id);
    assert_eq!(resp2.pagination.prev_cursor, Some(cursor));
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_sorting(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // Test artist_name ascending
    let req = test::TestRequest::get()
        .uri("/api/samples/search?sort=artist_name&order=asc&limit=5")
        .to_request();

    let resp: PaginatedSearchResponse = test::call_and_read_body_json(&app, req).await;
    
    assert_eq!(resp.sorting.field, "artist_name");
    assert_eq!(resp.sorting.order, "asc");
    
    // Verify ordering
    for i in 1..resp.data.len() {
        assert!(resp.data[i-1].artist <= resp.data[i].artist);
    }
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_empty_result(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    let req = test::TestRequest::get()
        .uri("/api/samples/search?q=nonexistentquery")
        .to_request();

    let resp: PaginatedSearchResponse = test::call_and_read_body_json(&app, req).await;
    
    assert!(resp.data.is_empty());
    assert_eq!(resp.pagination.total_count, 0);
    assert!(!resp.pagination.has_more);
    assert!(resp.pagination.next_cursor.is_none());
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_special_characters(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // Test escaping of SQL wildcards
    let req = test::TestRequest::get()
        .uri("/api/samples/search?q=%25_%27")
        .to_request();

    let resp: ServiceResponse = test::call_service(&app, req).await;
    
    // Should not crash, should return valid response
    assert_eq!(resp.status(), StatusCode::OK);
}

#[sqlx::test(fixtures("schema", "prefill"))]
async fn test_search_samples_invalid_params(pool: MySqlPool) {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)).await;

    // Test excessive limit
    let req = test::TestRequest::get()
        .uri("/api/samples/search?limit=1000")
        .to_request();

    let resp: PaginatedSearchResponse = test::call_and_read_body_json(&app, req).await;
    
    // Should be capped at max limit (100)
    assert!(resp.data.len() <= 100);
}