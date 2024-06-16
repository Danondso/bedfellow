
use crate::{
    models::SampleModel,
    schema::{ParamOptions, SampleSchema, InsertSamplesRequestSchema, InsertSampleSchema},
    AppState,
};
use actix_web::{get, post, web, HttpResponse, Responder};
use serde_json::json;

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
            sample_track_id = create_track(sample_track_artist_id.0, &sample_track.track, sample_track.year.unwrap_or(0), &sample_track.image, &data).await;
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

async fn get_artist(artist_name: &String, data: &web::Data<AppState>) -> (u64, ) {
    return sqlx::query_as("SELECT artist_id from artist WHERE artist_name = ?")
    .bind(artist_name)
    .fetch_one(&data.db).await.unwrap_or((0,));
}

// TODO query_many for inserts instead of single ones
async fn create_artist(artist_name: &String, data: &web::Data<AppState>) -> (u64, ) {
    let sql_result = sqlx::query(r#"INSERT INTO artist (artist_name) VALUES (?)"#)
    .bind(artist_name)
    .execute(&data.db)
    .await
    .map_err(|err: sqlx::Error| err.to_string());

    match sql_result {
        Ok(result) => {
            let id: u64 = result.last_insert_id();
            println!("INFO:: created artist id: {}", id);
            return (id, );
        }
        Err(e) => {
            println!("ERROR::create_artist:: {}", e);
            return (0, );
        }
    }
}

async fn get_sample_id(track_name: &String, found_artist_id: u64, data: &web::Data<AppState>) -> (u64, ) {
    return sqlx::query_as("SELECT sample_id from sample WHERE track_name = ? AND track_artist = ? LIMIT 1")
    .bind(track_name)
    .bind(found_artist_id)
    .fetch_one(&data.db).await.unwrap_or((0,));
}

async fn get_track_id(track_name: &String, artist_id: u64, data: &web::Data<AppState>) -> (u64, ) {
    return sqlx::query_as("SELECT track from sample WHERE track_name = ? artist_id = ?")
    .bind(track_name)
    .bind(artist_id)
    .fetch_one(&data.db).await.unwrap_or((0,))
}

async fn create_track(artist_id: u64, track_name: &String, track_year: u16, track_image: &Vec<u8>, data: &web::Data<AppState>) -> (u64, ) {
    let sql_result = sqlx::query(r#"INSERT INTO track (artist_id, track_name, track_year, track_image) VALUES (?, ?, ?, ?)"#)
    .bind(artist_id)
    .bind(track_name)
    .bind(track_year)
    .bind(track_image)
    .execute(&data.db)
    .await
    .map_err(|err: sqlx::Error| err.to_string());

    match  sql_result {
        Ok(result) => {
            let id: u64 = result.last_insert_id();
            println!("INFO:: created track id: {}", id);
            return (id, );
        }
        Err(e) => {
            println!("ERROR::create_track:: {}", e);
            return (0, );
        }
    }
}

async fn create_sample(track_name: &String, track_artist: u64, track_year: u16, track_image: Vec<u8>, sample_artist_id: u64, sample_track_id: u64, data: &web::Data<AppState>) -> (u64, ) {
    let sql_result = sqlx::query(r#"INSERT INTO sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES (?, ?, ?, ?, ?, ?)"#)
    .bind(track_name)
    .bind(track_artist)
    .bind(track_year)
    .bind(track_image)
    .bind(sample_artist_id)
    .bind(sample_track_id)
    .execute(&data.db)
    .await
    .map_err(|err: sqlx::Error| err.to_string());

    match  sql_result {
        Ok(result) => {
            let id: u64 = result.last_insert_id();
            println!("INFO:: created sample id: {}", id);
            return (id, );
        }
        Err(e) => {
            println!("ERROR:: {}", e);
            return (0, );
        }
    }
}

fn filter_db_record(sample: &SampleModel) -> SampleSchema {
    SampleSchema {
        id: sample.id.to_owned(),
        artist: sample.artist.to_owned(),
        track: sample.track.to_owned(),
        year: Some(sample.track_year.unwrap_or(0)),
        image: sample.track_image.to_owned(),
    }
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health_checker_handler)
        .service(get_samples_handler)
        .service(create_samples_handler);

    conf.service(scope);
}
