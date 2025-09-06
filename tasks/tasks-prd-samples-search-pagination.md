# Task List: Samples Search & Pagination Endpoint

## Relevant Files

- `server/bedfellow-db-api/src/schema.rs` - Add request/response schemas for paginated search endpoint
- `server/bedfellow-db-api/src/handlers.rs` - Implement the new search handler with pagination logic
- `server/bedfellow-db-api/src/models.rs` - Add cursor model and search result types if needed
- `server/bedfellow-db-api/src/main.rs` - Register the new route in the Actix Web application
- `server/bedfellow-db-api/src/lib.rs` - Export any new modules or utilities
- `server/bedfellow-db-api/tests/test.rs` - Integration tests for the new endpoint
- `server/bedfellow-db-api/db/init.sql` - Add database indexes for search performance
- `server/bedfellow-db-api/src/cache.rs` - New file for caching implementation
- `server/bedfellow-db-api/src/pagination.rs` - New file for cursor-based pagination utilities
- `server/bedfellow-db-api/Cargo.toml` - Add dependencies for caching and base64 encoding

### Notes

- Integration tests should use SQLx fixtures following the existing pattern in `tests/fixtures/`
- Use `cargo test` to run all tests or `cargo test test_name` for specific tests
- Follow existing error handling patterns with proper HTTP status codes
- Maintain consistency with current JSON response structure

## Tasks

- [ ] 1.0 Set up database indexes and query optimization
  - [x] 1.1 Analyze current sample table structure and identify searchable columns
  - [x] 1.2 Create indexes on artist.artist_name for faster searches (already exists: artist_name_index)
  - [x] 1.3 Create indexes on track.track_name for faster searches (already exists: track_name_index)
  - [x] 1.4 Add composite index on (artist_name, track_name) for combined searches
  - [x] 1.5 Test query performance with EXPLAIN to verify index usage
  - [x] 1.6 Update db/init.sql with new index definitions

- [ ] 2.0 Create request/response schemas for the new endpoint
  - [ ] 2.1 Define SearchQueryParams struct with q, cursor, limit, sort, order fields
  - [ ] 2.2 Create PaginationMetadata struct with next_cursor, prev_cursor, has_more, total_count
  - [ ] 2.3 Define SearchMetadata struct with query and search_time_ms fields
  - [ ] 2.4 Create SortingMetadata struct with field and order properties
  - [ ] 2.5 Build PaginatedSearchResponse struct combining data, pagination, search, and sorting
  - [ ] 2.6 Add validation rules for query parameters (max limit, valid sort fields)
  - [ ] 2.7 Implement Default trait for SearchQueryParams with sensible defaults

- [ ] 3.0 Implement cursor-based pagination utilities
  - [ ] 3.1 Create pagination.rs module in src/
  - [ ] 3.2 Define Cursor struct to hold pagination state (id, sort_value, direction)
  - [ ] 3.3 Implement encode_cursor function using base64 encoding
  - [ ] 3.4 Implement decode_cursor function with error handling for invalid cursors
  - [ ] 3.5 Create build_pagination_query helper to add WHERE clauses for cursor
  - [ ] 3.6 Add cursor validation to ensure cursors haven't been tampered with
  - [ ] 3.7 Implement cursor expiration logic (optional timestamp in cursor)

- [ ] 4.0 Build the search query logic with partial matching
  - [ ] 4.1 Create search_samples_query function in handlers.rs
  - [ ] 4.2 Implement SQL query builder with dynamic WHERE clauses
  - [ ] 4.3 Add LIKE patterns with % wildcards for partial matching
  - [ ] 4.4 Escape special SQL characters in search input to prevent injection
  - [ ] 4.5 Implement case-insensitive search using LOWER() or COLLATE
  - [ ] 4.6 Add relevance scoring for search results (optional MATCH or custom logic)
  - [ ] 4.7 Handle empty search queries to return all samples

- [ ] 5.0 Create the main search handler with pagination
  - [ ] 5.1 Define get_samples_search_handler function with proper Actix Web signature
  - [ ] 5.2 Extract and validate query parameters from request
  - [ ] 5.3 Decode cursor if provided and build pagination WHERE clause
  - [ ] 5.4 Execute count query to get total_count for pagination metadata
  - [ ] 5.5 Execute main search query with LIMIT and OFFSET/cursor logic
  - [ ] 5.6 Transform database results into response models
  - [ ] 5.7 Generate next and previous cursors based on results
  - [ ] 5.8 Calculate search execution time for metadata
  - [ ] 5.9 Build and return JSON response with all metadata

- [ ] 6.0 Implement caching layer for performance
  - [ ] 6.1 Create cache.rs module with Cache trait definition
  - [ ] 6.2 Implement InMemoryCache using HashMap or cached crate
  - [ ] 6.3 Define cache key structure including query params
  - [ ] 6.4 Add cache get/set methods with TTL support (5 minutes default)
  - [ ] 6.5 Implement cache invalidation on new sample creation
  - [ ] 6.6 Add cache statistics tracking (hits, misses, evictions)
  - [ ] 6.7 Integrate cache checks in search handler before database query
  - [ ] 6.8 Add configuration for cache size limits and TTL

- [ ] 7.0 Add sorting functionality
  - [ ] 7.1 Define SortField enum (CreatedAt, TrackName, ArtistName, Relevance)
  - [ ] 7.2 Define SortOrder enum (Ascending, Descending)
  - [ ] 7.3 Parse sort and order parameters from query string
  - [ ] 7.4 Build ORDER BY clause dynamically based on sort parameters
  - [ ] 7.5 Handle relevance sorting when search query is present
  - [ ] 7.6 Ensure cursor includes sort values for consistent pagination
  - [ ] 7.7 Add default sorting fallback (e.g., by created_at desc)

- [ ] 8.0 Register the new route and wire up dependencies
  - [ ] 8.1 Add route registration in main.rs for GET /api/samples or /api/samples/search
  - [ ] 8.2 Initialize cache instance in AppState
  - [ ] 8.3 Pass cache to handler through web::Data
  - [ ] 8.4 Export new modules (pagination, cache) in lib.rs
  - [ ] 8.5 Add any new dependencies to Cargo.toml (base64, cached, etc.)
  - [ ] 8.6 Configure route middleware if needed (logging, metrics)

- [ ] 9.0 Write comprehensive integration tests
  - [ ] 9.1 Create test fixtures with sample data in tests/fixtures/
  - [ ] 9.2 Write test for basic search functionality
  - [ ] 9.3 Test pagination with multiple pages
  - [ ] 9.4 Test cursor encoding/decoding edge cases
  - [ ] 9.5 Test search with special characters and SQL injection attempts
  - [ ] 9.6 Test all sorting options with different data sets
  - [ ] 9.7 Test cache behavior (hits, misses, invalidation)
  - [ ] 9.8 Test error cases (invalid cursor, excessive limit, malformed query)
  - [ ] 9.9 Test empty result sets return proper response structure
  - [ ] 9.10 Add performance tests for large datasets

- [ ] 10.0 Update API documentation
  - [ ] 10.1 Add endpoint definition to OpenAPI spec (bedfellow-openapi-3.yml)
  - [ ] 10.2 Document all query parameters with descriptions and constraints
  - [ ] 10.3 Add response schema examples for success and error cases
  - [ ] 10.4 Include curl examples in documentation
  - [ ] 10.5 Document rate limiting if implemented
  - [ ] 10.6 Add notes about cursor expiration and format
  - [ ] 10.7 Create or update README with endpoint usage guide
