
use crate::{
    schema::{ParamOptions, SampleSchema, InsertSamplesRequestSchema, InsertSampleSchema,
             SearchQueryParams, PaginatedSearchResponse, PaginationMetadata, SearchMetadata, SortingMetadata},
    pagination::Cursor,
    queries::{get_artist, create_artist, get_sample_id, get_track_id, create_track, create_sample,
              search_samples_count, search_samples, filter_db_record},
    AppState,
};
use actix_web::{get, post, web, HttpResponse, Responder};
use serde_json::json;
use std::time::Instant;

#[get("/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "Bedfellow DB API is Live 🎧💿🎙️";
    HttpResponse::Ok().json(json!({"status": "success","message": MESSAGE}))
}

#[get("/samples")]
pub async fn get_samples_handler(
    opts: web::Query<ParamOptions>,
    data: web::Data<AppState>,
) -> impl Responder {
    let artist: &String = &opts.artist_name;
    let track: &String = &opts.track_name;

    let artist_id: (u64,) = get_artist(artist, &data).await;

    if artist_id.0 == 0 {
        return HttpResponse::NotFound().json(serde_json::json!({
            "status": "failure",
            "message": "artist not found"
        })); 
    }
    println!("INFO:: artist_id: {:?} and track_name: {:?}", artist_id.0, track);
    let samples = sqlx::query_as(
        "SELECT
        SAMPLE.sample_id as id,
        ARTIST.artist_name as artist,
        TRACK.track_name as track,
        TRACK.track_year as track_year,
        TRACK.track_image as track_image
        FROM
        sample SAMPLE
        RIGHT JOIN track TRACK on
        TRACK.track_id = SAMPLE.sample_track_id 
        RIGHT JOIN artist ARTIST ON
        ARTIST.artist_id = TRACK.artist_id
        WHERE
        SAMPLE.track_name = ?
        AND SAMPLE.track_artist = ?", 
        )
            .bind(track)
            .bind(artist_id.0)
        .fetch_all(&data.db).await;

    match samples {
        Ok(result ) => {

            if result.is_empty() {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "status": "failure",
                    "message": "track not found"
                }));
            }

            let samples_response: Vec<SampleSchema> = result
            .into_iter()
            .map(|sample| filter_db_record(&sample))
            .collect::<Vec<SampleSchema>>();

            return HttpResponse::Ok().json(serde_json::json!({
                "status": "success",
                "track": track,
                "artist": artist,
                "samples": samples_response
            }))
        }
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "status": "failure",
                "error": err.to_string()
            }));
        }  
    }
}

#[post("/samples")]
async fn create_samples_handler(
    body: web::Json<InsertSamplesRequestSchema>,
    data: web::Data<AppState>,
) -> HttpResponse {

    let artist_name: &String = &body.artist_name;
    let track_name: &String = &body.track_name;
    let sample_tracks: &Vec<InsertSampleSchema> = &body.samples;

    // TODO replace some logic here with match
    // Get the artist
    let found_artist_id: (u64, ) = get_artist(&artist_name, &data).await;
    println!("FOUND ARTIST ID:: ID:{}", found_artist_id.0);

    // Get the track
    let found_sample_id: (u64, ) = get_sample_id(&track_name, found_artist_id.0, &data).await;
    println!("QUERY: SELECT sample_id sample WHERE track_name =  {} track_artist = {} LIMIT 1", track_name, found_artist_id.0);

    println!("FOUND ARTIST SAMPLE ID:: ID:{}", found_sample_id.0);

    // If there's a track, return a 409, no need to process
    println!("IS THIS A CONFLICT? : {} RESULT: {}", found_sample_id.0,  found_sample_id.0 != 0);

    if found_sample_id.0 != 0 {
        return HttpResponse::Conflict().finish();
    }

    // Create the artist for the track we have samples for
    let mut artist_id = found_artist_id;
    if found_artist_id.0 == 0 {
        artist_id = create_artist(&artist_name, &data).await;
        if artist_id.0 == 0 {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "status": "failure",
                "error": "unable to create artist for track",
            }));
        }
    }

    // artist_id
    let mut created_sample_ids: Vec<u64> = Vec::new();
    for sample_track in sample_tracks {
        // Check if track artist exists
        let mut sample_track_artist_id: (u64, ) = get_artist(&sample_track.artist, &data).await;
        // Check if track exists for sampled track
        let mut sample_track_id: (u64, ) = get_track_id(&sample_track.track, sample_track_artist_id.0, &data).await;

        if sample_track_artist_id.0 == 0 {
            sample_track_artist_id = create_artist(&sample_track.artist, &data).await;
        }
        if sample_track_id.0 == 0 {
            sample_track_id = create_track(sample_track_artist_id.0, &sample_track.track, sample_track.year.unwrap_or(0), &sample_track.image.as_bytes().to_vec(), &data).await;
        }

        if sample_track_artist_id.0 == 0 && sample_track_id.0 == 0 {
            println!("ERROR:: create sample track -> ignoring sample because 0 found in tuple, sample_track_artist_id: {} sample_track_id: {}", sample_track_artist_id.0, sample_track_id.0);
        } else {
            let sample_id = create_sample(track_name, artist_id.0, 0, Vec::new(), sample_track_artist_id.0, sample_track_id.0, &data).await;
            created_sample_ids.push(sample_id.0);
        }
    }
    println!("INFO:: created sample count {}", created_sample_ids.len());
    
    let created_samples_count = created_sample_ids.len();
    let sample_count_in_request = sample_tracks.len();

    if created_samples_count != sample_count_in_request {
        return HttpResponse::MultiStatus().json(serde_json::json!({
            "status": "partial success",
            "message": format!("Samples for track partially created, {:?} of {:?}", created_samples_count, sample_count_in_request),
        }));
    } 
    
    return HttpResponse::NoContent().finish();
}


#[get("/samples/search")]
pub async fn search_samples_handler(
    mut params: web::Query<SearchQueryParams>,
    data: web::Data<AppState>,
) -> impl Responder {
    let start_time = Instant::now();
    
    // Validate and normalize parameters
    params.validate();
    
    // Decode cursor if provided
    let cursor = if let Some(ref cursor_str) = params.cursor {
        match Cursor::decode(cursor_str) {
            Ok(c) if !c.is_expired(3600) => Some(c),
            _ => None,
        }
    } else {
        None
    };
    
    let sort_field = params.sort.clone().unwrap_or_else(|| "created_at".to_string());
    let sort_order = params.order.clone().unwrap_or_else(|| "desc".to_string());
    let limit = params.limit.unwrap_or(20);
    
    // Get total count from database
    let total_count = search_samples_count(params.q.as_ref(), &data).await;
    
    // Fetch samples from database
    let samples_result = search_samples(
        params.q.as_ref(),
        cursor.as_ref(),
        &sort_field,
        &sort_order,
        limit,
        &data
    ).await;
    
    let has_more = samples_result.len() > limit as usize;
    let samples = if has_more {
        &samples_result[..limit as usize]
    } else {
        &samples_result[..]
    };
    
    // Generate cursors
    let next_cursor = if has_more && !samples.is_empty() {
        let last = &samples[samples.len() - 1];
        let sort_value = match sort_field.as_str() {
            "track_name" => last.track.clone(),
            "artist_name" => last.artist.clone(),
            _ => last.id.to_string(),
        };
        Some(Cursor::new(last.id as u64, sort_value).encode())
    } else {
        None
    };
    
    let prev_cursor = cursor.map(|c| c.encode());
    
    // Convert to response format
    let samples_response: Vec<SampleSchema> = samples
        .iter()
        .map(|sample| filter_db_record(sample))
        .collect();
    
    let search_time_ms = start_time.elapsed().as_millis() as u64;
    
    let response = PaginatedSearchResponse {
        data: samples_response,
        pagination: PaginationMetadata {
            next_cursor,
            prev_cursor,
            has_more,
            total_count: total_count as u64,
            current_page_size: samples.len(),
        },
        search: SearchMetadata {
            query: params.q.clone(),
            search_time_ms,
        },
        sorting: SortingMetadata {
            field: sort_field.clone(),
            order: sort_order.clone(),
        },
    };
    
    HttpResponse::Ok().json(response)
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(get_samples_handler)
        .service(search_samples_handler)
        .service(create_samples_handler);

    conf.service(scope);
}
