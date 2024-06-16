
use std::fs::File;
use std::io::BufReader;

use actix_web::dev::ServiceResponse;
use actix_web::http::StatusCode;
use actix_web::{test, web, App};
use bedfellow_db_api::schema::{HealthCheckSchema, InsertSamplesRequestSchema, SamplesResponseSchema};
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