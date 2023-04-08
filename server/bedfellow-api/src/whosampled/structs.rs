use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct SearchQuery {
    pub artist: String,
    pub track_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WhoSampledSearchTrackResult {
    id: i32,
    url: String,
    artist_name: String,
    track_name: String,
    image_url: String,
    counts: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WhoSampledSearchResponse {
    // whosampled provides movies, artists, and tv shows but we're about the tunes here
    tracks: Vec<WhoSampledSearchTrackResult>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WhoSampledErrorResponse {
    pub error: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Track {
    pub track_name: String,
    pub artist: String,
    pub year: i32,
    pub images: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WhoSampledResponse {
    pub samples: Vec<Track>,
    pub sampled_by: Vec<Track>,
    pub covers: Vec<Track>
}