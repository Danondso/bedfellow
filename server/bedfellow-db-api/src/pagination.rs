use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Cursor {
    pub id: u64,
    pub sort_value: String,
    pub timestamp: u64,
}

impl Cursor {
    pub fn new(id: u64, sort_value: String) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        Self {
            id,
            sort_value,
            timestamp,
        }
    }

    pub fn encode(&self) -> String {
        let json = serde_json::to_string(self).unwrap();
        BASE64.encode(json)
    }

    pub fn decode(cursor_str: &str) -> Result<Self, String> {
        let decoded = BASE64
            .decode(cursor_str)
            .map_err(|e| format!("Invalid cursor format: {}", e))?;
        
        let json_str = String::from_utf8(decoded)
            .map_err(|e| format!("Invalid cursor encoding: {}", e))?;
        
        serde_json::from_str(&json_str)
            .map_err(|e| format!("Invalid cursor structure: {}", e))
    }

    pub fn is_expired(&self, ttl_seconds: u64) -> bool {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        now - self.timestamp > ttl_seconds
    }
}

pub fn build_pagination_query(
    cursor: Option<&Cursor>,
    sort_field: &str,
    sort_order: &str,
) -> String {
    if let Some(cursor) = cursor {
        let comparison_op = if sort_order == "desc" { "<" } else { ">" };
        
        match sort_field {
            "created_at" | "sample_id" => {
                format!("AND s.sample_id {} {}", comparison_op, cursor.id)
            }
            "track_name" => {
                format!(
                    "AND (s.track_name {} '{}' OR (s.track_name = '{}' AND s.sample_id {} {}))",
                    comparison_op, cursor.sort_value, cursor.sort_value, comparison_op, cursor.id
                )
            }
            "artist_name" => {
                format!(
                    "AND (a1.artist_name {} '{}' OR (a1.artist_name = '{}' AND s.sample_id {} {}))",
                    comparison_op, cursor.sort_value, cursor.sort_value, comparison_op, cursor.id
                )
            }
            _ => String::new(),
        }
    } else {
        String::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cursor_encode_decode() {
        let cursor = Cursor::new(123, "test_value".to_string());
        let encoded = cursor.encode();
        let decoded = Cursor::decode(&encoded).unwrap();
        
        assert_eq!(decoded.id, 123);
        assert_eq!(decoded.sort_value, "test_value");
    }

    #[test]
    fn test_cursor_expiration() {
        let mut cursor = Cursor::new(123, "test".to_string());
        assert!(!cursor.is_expired(3600)); // Not expired within 1 hour
        
        // Simulate old timestamp
        cursor.timestamp = cursor.timestamp - 7200;
        assert!(cursor.is_expired(3600)); // Expired after 1 hour
    }

    #[test]
    fn test_invalid_cursor_decode() {
        assert!(Cursor::decode("invalid_base64!!!").is_err());
        assert!(Cursor::decode("dGVzdA==").is_err()); // Valid base64 but invalid JSON
    }
}