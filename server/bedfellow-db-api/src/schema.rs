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
pub struct SamplesResponseSchema {
    pub status: String,
    pub track: String,
    pub artist: String,
    pub samples: Vec<SampleSchema>
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
pub struct ErrorResponseSchema {
    pub status: String,
    pub message: String,
}


// Search endpoint schemas
#[derive(Deserialize, Debug)]
pub struct SearchQueryParams {
    pub q: Option<String>,           // Search query
    pub cursor: Option<String>,      // Pagination cursor
    pub limit: Option<u32>,          // Items per page (default: 20, max: 100)
    pub sort: Option<String>,        // Sort field (created_at, track_name, artist_name, relevance)
    pub order: Option<String>,       // Sort order (asc, desc)
}

impl SearchQueryParams {
    pub fn validate(&mut self) {
        // Validate and cap limit
        if let Some(limit) = self.limit {
            if limit > 100 {
                self.limit = Some(100);
            } else if limit < 1 {
                self.limit = Some(20);
            }
        } else {
            self.limit = Some(20);
        }
        
        // Validate sort field
        if let Some(ref sort) = self.sort {
            let valid_sorts = vec!["created_at", "track_name", "artist_name", "relevance"];
            if !valid_sorts.contains(&sort.as_str()) {
                self.sort = Some("created_at".to_string());
            }
        }
        
        // Validate order
        if let Some(ref order) = self.order {
            if order != "asc" && order != "desc" {
                self.order = Some("desc".to_string());
            }
        }
    }
}

impl Default for SearchQueryParams {
    fn default() -> Self {
        Self {
            q: None,
            cursor: None,
            limit: Some(20),
            sort: Some("created_at".to_string()),
            order: Some("desc".to_string()),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginationMetadata {
    pub next_cursor: Option<String>,
    pub prev_cursor: Option<String>,
    pub has_more: bool,
    pub total_count: u64,
    pub current_page_size: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SearchMetadata {
    pub query: Option<String>,
    pub search_time_ms: u64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SortingMetadata {
    pub field: String,
    pub order: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedSearchResponse {
    pub data: Vec<SampleSchema>,
    pub pagination: PaginationMetadata,
    pub search: SearchMetadata,
    pub sorting: SortingMetadata,
}

// TODO create structs for the other error type responses
