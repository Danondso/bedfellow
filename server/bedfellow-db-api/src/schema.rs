use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct ParamOptions {
    pub artist_name: String,
    pub track_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InsertSampleSchema {
    pub artist: String,
    pub year: Option<u16>,
    pub track: String,
    pub image: String, // base64Encoded
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InsertSamplesRequestSchema {
    pub track_name: String,
    pub artist_name: String,
    pub samples: Vec<InsertSampleSchema>,
}


#[derive(Serialize, Deserialize, Debug)]
pub struct SampleSchema {
    pub id: u16,
    pub artist: String,
    pub track: String,
    pub year: Option<u16>,
    pub image: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HealthCheckSchema {
    pub status: String,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SamplesResponseSchema {
    pub status: String,
    pub track: String,
    pub artist: String,
    pub samples: Vec<SampleSchema>
}


#[derive(Serialize, Deserialize, Debug)]
pub struct ErrorResponseSchema {
    pub status: String,
    pub track: String,
    pub artist: String,
    pub samples: Vec<SampleSchema>
}

// TODO create structs for the other error type responses