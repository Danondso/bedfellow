use actix_web::{get, web, Responder, HttpResponse};
use serde::{Serialize, Deserialize};
use std::{process::{Command}};


#[derive(Serialize, Deserialize, Debug)]
struct Track {
    track_name: String,
    artist: String,
    year: i32,
    images: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct WhoSampledResponse {
    samples: Vec<Track>,
    sampled_by: Vec<Track>,
    covers: Vec<Track>
}


#[get("/sample-info/{artist}/{track_name}")]
pub async fn sample_info(path: web::Path<(String, String)>) -> impl Responder {
    let (artist, track_name) = path.into_inner();
    let python_output = Command::new("./run_python_scraper.sh")
        .arg(format!("/{}/{}", artist, track_name))
        .output();

    if python_output.is_ok() {
        let unwrapped_results = python_output.unwrap();
        let sample_results: String = String::from_utf8_lossy(&unwrapped_results.stdout).to_string();
        let who_sampled_response: Result<WhoSampledResponse, serde_json::Error> = serde_json::from_str(&sample_results);
        if who_sampled_response.is_ok() {
            return HttpResponse::Ok().json(web::Json(who_sampled_response.unwrap()))
        } else {
            return HttpResponse::InternalServerError().json("Unable to parse response from whosampled scraper script.");
        }
    } else {
        let unwrapped_error = python_output.unwrap_err();
        return HttpResponse::BadRequest().json(&unwrapped_error.to_string());
    }
} 

#[derive(Serialize, Deserialize)]
struct SearchQuery {
    artist: String,
    track_name: String,
}



#[derive(Serialize, Deserialize, Debug)]
struct WhoSampledSearchTrackResult {
    id: i32,
    url: String,
    artist_name: String,
    track_name: String,
    image_url: String,
    counts: String
}

#[derive(Serialize, Deserialize, Debug)]
struct WhoSampledSearchResponse {
    // whosampled provides movies, artists, and tv shows but we're about the tunes here
    tracks: Vec<WhoSampledSearchTrackResult>,
}

#[get("/search")]
pub async fn search(query: web::Query<SearchQuery>) -> impl Responder {
    let query_params: SearchQuery = query.into_inner();
    let python_output = Command::new("./run_python_search.sh")
        .arg(query_params.artist)
        .arg(query_params.track_name)
        .output();
    
    if python_output.is_ok() {
        let unwrapped_results = python_output.unwrap();
        let search_results: String = String::from_utf8_lossy(&unwrapped_results.stdout).to_string();
        let who_sampled_response: Result<WhoSampledSearchResponse, serde_json::Error> = serde_json::from_str(&search_results);
        if who_sampled_response.is_ok() {
            return HttpResponse::Ok().json(web::Json(who_sampled_response.unwrap()))
        } else {
            info!("{:?}", who_sampled_response.unwrap_err().to_string())
        }
    }
    return HttpResponse::InternalServerError().json("Unable to parse search results from whosampled scraper script.");
} 