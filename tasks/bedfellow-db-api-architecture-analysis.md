# Bedfellow DB API Architecture Analysis

## Current Architecture Pattern

After analyzing the codebase, the `bedfellow-db-api` service has a **simplified flat architecture** where database logic and API handlers are tightly coupled within the `handlers.rs` file. This differs from traditional layered architectures.

### Current Structure:

```
src/
├── handlers.rs    # Contains both HTTP handlers AND database operations
├── models.rs      # Simple data models (sqlx::FromRow structs)
├── schema.rs      # Request/Response DTOs
├── pagination.rs  # Pagination utilities (new)
└── lib.rs         # Module exports and AppState
```

## Existing Pattern Analysis

### Existing Endpoints (GET /samples, POST /samples)

The existing endpoints follow a pattern where **database helper functions are co-located with handlers**:

**Database Layer Functions** (in handlers.rs):

- `get_artist()` - Fetches artist by name
- `create_artist()` - Creates new artist
- `get_sample_id()` - Fetches sample ID
- `get_track_id()` - Fetches track ID
- `create_track()` - Creates new track
- `create_sample()` - Creates new sample
- `filter_db_record()` - Transforms DB model to API schema

**Handler Functions** (also in handlers.rs):

- `get_samples_handler()` - Calls database functions, handles responses
- `create_samples_handler()` - Orchestrates multiple database operations

### Pattern Characteristics:

1. **Database functions are simple, focused queries** - Each does one thing
2. **Handlers orchestrate multiple database calls** - Business logic in handlers
3. **Direct SQLx usage** - No ORM abstraction layer
4. **No repository/service layer** - Handlers directly call database functions

## New Search Endpoint Deviation

The new `search_samples_handler()` **violates this pattern** by:

### 1. **Embedding Complex SQL Directly in Handler**

```rust
// Lines 332-344: Count query built inline
let count_query = format!(
    "SELECT COUNT(*) as count
    FROM sample s
    JOIN artist a1 ON s.track_artist = a1.artist_id
    {}",
    search_clause
);

// Lines 346-361: Main query built inline
let samples_query = format!(
    "SELECT
        s.sample_id as id,
        a1.artist_name as artist,
        s.track_name as track,
        ...
    FROM sample s
    JOIN artist a1 ON s.track_artist = a1.artist_id
    JOIN artist a2 ON s.sample_artist_id = a2.artist_id
    JOIN track t ON s.sample_track_id = t.track_id
    {} {}
    {}
    LIMIT {}",
    search_clause, cursor_clause, order_by, limit + 1
);
```

### 2. **Mixing Multiple Concerns in One Function**

- Query parameter validation
- Cursor encoding/decoding
- SQL query building
- Search clause construction
- Pagination logic
- Response transformation
- Performance timing

### 3. **No Separation of Database Logic**

Unlike existing endpoints that have discrete database functions, the search endpoint has everything inline.

## Comparison with bedfellow-api Service

The `bedfellow-api` service (Spotify OAuth) follows a different but equally simple pattern:

- Controllers contain business logic
- Helper functions (`create_auth_header()`, `send_request()`) are extracted
- Still no repository/service layers

## Recommended Refactoring

To align with the existing pattern in `bedfellow-db-api`, the search endpoint should be refactored:

### 1. **Extract Database Functions**

```rust
// In handlers.rs, add these database helper functions:

async fn search_samples_count(
    query: Option<&String>,
    data: &web::Data<AppState>
) -> Result<i64, sqlx::Error> {
    // Count query logic here
}

async fn search_samples(
    query: Option<&String>,
    cursor: Option<&Cursor>,
    sort_field: &str,
    sort_order: &str,
    limit: u32,
    data: &web::Data<AppState>
) -> Result<Vec<SampleModel>, sqlx::Error> {
    // Main search query logic here
}
```

### 2. **Simplify Handler**

The handler should only:

- Parse and validate parameters
- Call database functions
- Transform results to response format
- Handle errors

### 3. **Consider Creating a queries Module**

If the file gets too large, consider:

```
src/
├── handlers.rs        # HTTP handlers only
├── queries.rs         # All database functions
├── models.rs
├── schema.rs
└── pagination.rs
```

## Why This Architecture?

The current flat architecture is actually **appropriate for this service** because:

1. **It's a thin API layer** - The service is primarily a REST wrapper around database operations
2. **Simple domain model** - Artists, tracks, and samples don't have complex business logic
3. **No external service dependencies** - No need for dependency injection
4. **Performance focused** - Direct SQL queries are more efficient than ORM abstractions
5. **Small codebase** - Additional layers would add unnecessary complexity

## Conclusion

The new search endpoint should be refactored to match the existing pattern by:

1. Extracting SQL queries into dedicated database helper functions
2. Keeping the handler focused on HTTP concerns
3. Following the same separation seen in `get_samples_handler()` and `create_samples_handler()`

This maintains consistency while keeping the architecture appropriately simple for the service's needs.
