// Database query functions for the Bedfellow DB API
// This module contains all direct database operations used by the API handlers

use actix_web::web;
use sqlx;
use crate::{
    models::SampleModel,
    schema::SampleSchema,
    pagination::{Cursor, build_pagination_query},
    AppState,
};

// ============================================================================
// Artist Queries
// ============================================================================

pub async fn get_artist(artist_name: &String, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    println!("INFO:: artist_name: {:?}", artist_name);
    let result: (u64,) = sqlx::query_as("SELECT artist_id from artist WHERE artist_name = ?")
        .bind(artist_name)
        .fetch_one(&data.db)
        .await?;
    Ok(result.0)
}

// TODO query_many for inserts instead of single ones
pub async fn create_artist(artist_name: &String, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    let result = sqlx::query(r#"INSERT INTO artist (artist_name) VALUES (?)"#)
        .bind(artist_name)
        .execute(&data.db)
        .await?;
    
    let id: u64 = result.last_insert_id();
    println!("INFO:: created artist id: {}", id);
    Ok(id)
}

// ============================================================================
// Track Queries
// ============================================================================

pub async fn get_track_id(track_name: &String, artist_id: u64, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    let result: (u64,) = sqlx::query_as("SELECT track_id from track WHERE track_name = ? AND artist_id = ?")
        .bind(track_name)
        .bind(artist_id)
        .fetch_one(&data.db)
        .await?;
    Ok(result.0)
}

pub async fn create_track(artist_id: u64, track_name: &String, track_year: u16, track_image: &Vec<u8>, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    let result = sqlx::query(r#"INSERT INTO track (artist_id, track_name, track_year, track_image) VALUES (?, ?, ?, ?)"#)
        .bind(artist_id)
        .bind(track_name)
        .bind(track_year)
        .bind(track_image)
        .execute(&data.db)
        .await?;
    
    let id: u64 = result.last_insert_id();
    println!("INFO:: created track id: {}", id);
    Ok(id)
}

// ============================================================================
// Sample Queries
// ============================================================================

pub async fn get_sample_id(track_name: &String, found_artist_id: u64, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    let result: (u64,) = sqlx::query_as("SELECT sample_id from sample WHERE track_name = ? AND track_artist = ? LIMIT 1")
        .bind(track_name)
        .bind(found_artist_id)
        .fetch_one(&data.db)
        .await?;
    Ok(result.0)
}

pub async fn create_sample(track_name: &String, track_artist: u64, track_year: u16, track_image: Vec<u8>, sample_artist_id: u64, sample_track_id: u64, data: &web::Data<AppState>) -> Result<u64, sqlx::Error> {
    let result = sqlx::query(r#"INSERT INTO sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES (?, ?, ?, ?, ?, ?)"#)
        .bind(track_name)
        .bind(track_artist)
        .bind(track_year)
        .bind(track_image)
        .bind(sample_artist_id)
        .bind(sample_track_id)
        .execute(&data.db)
        .await?;
    
    let id: u64 = result.last_insert_id();
    println!("INFO:: created sample id: {}", id);
    Ok(id)
}

// ============================================================================
// Search Queries
// ============================================================================

/// Builds a WHERE clause for search queries
pub fn build_search_where_clause(has_query: bool) -> &'static str {
    if has_query {
        "WHERE (a1.artist_name LIKE CONCAT('%', ?, '%') OR s.track_name LIKE CONCAT('%', ?, '%'))"
    } else {
        "WHERE 1=1"
    }
}

/// Gets the total count of samples matching the search query
pub async fn search_samples_count(
    query: Option<&String>,
    data: &web::Data<AppState>,
) -> i64 {
    let search_clause = build_search_where_clause(query.is_some());
    
    let count_query = format!(
        "SELECT COUNT(*) as count
        FROM sample s
        JOIN artist a1 ON s.track_artist = a1.artist_id
        {}",
        search_clause
    );
    
    let result: Result<(i64,), sqlx::Error> = if let Some(q) = query {
        sqlx::query_as(&count_query)
            .bind(q)
            .bind(q)
            .fetch_one(&data.db)
            .await
    } else {
        sqlx::query_as(&count_query)
            .fetch_one(&data.db)
            .await
    };
    
    match result {
        Ok((count,)) => count,
        Err(err) => {
            println!("ERROR:: search_samples_count -> {}", err);
            0
        }
    }
}

/// Searches for samples with pagination and sorting
pub async fn search_samples(
    query: Option<&String>,
    cursor: Option<&Cursor>,
    sort_field: &str,
    sort_order: &str,
    limit: u32,
    data: &web::Data<AppState>,
) -> Vec<SampleModel> {
    let search_clause = build_search_where_clause(query.is_some());
    
    // Add cursor pagination
    let cursor_clause = build_pagination_query(
        cursor,
        sort_field,
        sort_order,
    );
    
    // Build ORDER BY clause
    let order_by = format!(
        "ORDER BY {} {}",
        match sort_field {
            "track_name" => "s.track_name",
            "artist_name" => "a1.artist_name",
            _ => "s.sample_id",
        },
        sort_order
    );
    
    let samples_query = format!(
        "SELECT 
            s.sample_id as id,
            a1.artist_name as artist,
            s.track_name as track,
            s.track_year as track_year,
            s.track_image as track_image
        FROM sample s
        JOIN artist a1 ON s.track_artist = a1.artist_id
        JOIN artist a2 ON s.sample_artist_id = a2.artist_id
        JOIN track t ON s.sample_track_id = t.track_id
        {} {}
        {}
        LIMIT {}",
        search_clause, cursor_clause, order_by, limit + 1
    );
    
    let result: Result<Vec<SampleModel>, sqlx::Error> = if let Some(q) = query {
        sqlx::query_as(&samples_query)
            .bind(q)
            .bind(q)
            .fetch_all(&data.db)
            .await
    } else {
        sqlx::query_as(&samples_query)
            .fetch_all(&data.db)
            .await
    };
    
    match result {
        Ok(samples) => samples,
        Err(err) => {
            println!("ERROR:: search_samples -> {}", err);
            vec![]
        }
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

pub fn filter_db_record(sample: &SampleModel) -> SampleSchema {
    let mut image_as_str: String = "".to_owned();
    let track_str = String::from_utf8(sample.track_image.to_owned());
    match track_str {
        Ok(t) => {
            image_as_str = t.to_owned();
        }
        Err(err) => {
            println!("WARN:: filter_db_record -> failed to parse blob for sample: {:?}, error: {:?}",sample.track, err);
        }
    }
    
    SampleSchema {
        id: sample.id.to_owned(),
        artist: sample.artist.to_owned(),
        track: sample.track.to_owned(),
        year: Some(sample.track_year.unwrap_or(0)),
        image: image_as_str,
    }
}