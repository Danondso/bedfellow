use serde::{Deserialize, Serialize};

 #[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
// #[allow(non_snake_case)]
pub struct SampleModel {
    pub id: u16,
    pub artist: String,
    pub track: String,
    pub track_year: Option<u16>,
    pub track_image: Vec<u8>,
}