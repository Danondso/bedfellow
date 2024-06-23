use actix_web::{get, Responder, HttpResponse, web::Json, web::Query};
use super::structs::{SearchQuery, WhoSampledSearchResponse, WhoSampledErrorResponse};

#[path = "./whosampled_service.rs"]
mod whosampled_service;

#[get("/search")]
pub async fn search(query: Query<SearchQuery>) -> impl Responder {
    let query_params: SearchQuery = query.into_inner();
 
    let response: Result<WhoSampledSearchResponse, WhoSampledErrorResponse> = 
        whosampled_service::get_sample_search_info(query_params.artist, query_params.track_name).await;

    match response {
        Ok(ok) => HttpResponse::Ok().json(Json(ok)),
        Err(error) => HttpResponse::InternalServerError().json(Json(error))
    }
} 