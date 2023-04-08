use actix_web::{get, Responder, HttpResponse, web::Json, web::Path, web::Query};
use super::structs::{SearchQuery, WhoSampledSearchResponse, WhoSampledErrorResponse, WhoSampledResponse};

#[path = "./whosampled_service.rs"]
mod whosampled_service;

#[get("/sample-info/{artist}/{track_name}")]
pub async fn sample_info(path: Path<(String, String)>) -> impl Responder {
    let (artist, track_name) = path.into_inner();

    let response: Result<WhoSampledResponse, WhoSampledErrorResponse> =
        whosampled_service::get_sample_info(&artist, &track_name).await;
    
    if response.is_err() {
        return HttpResponse::InternalServerError().json(Json(response.err()));
    }
    
    return HttpResponse::Ok().json(Json(response.ok()));
} 

#[get("/search")]
pub async fn search(query: Query<SearchQuery>) -> impl Responder {
    let query_params: SearchQuery = query.into_inner();
 
    let response: Result<WhoSampledSearchResponse, WhoSampledErrorResponse> = 
        whosampled_service::get_sample_search_info(query_params.artist, query_params.track_name).await;

    if response.is_err() {
        return HttpResponse::InternalServerError().json(Json(response.err()));
    }

    return HttpResponse::Ok().json(Json(response.ok()));
} 