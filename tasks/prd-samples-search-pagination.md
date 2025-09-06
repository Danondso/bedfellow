# Product Requirements Document: Samples Search & Pagination Endpoint

## Introduction/Overview

Currently, there is no way to query what samples are stored in the Bedfellow database without directly accessing the database. This feature will add a new REST API endpoint to the Bedfellow server that allows clients to search and browse through the samples collection with pagination support. This will enable users to discover samples in the database, search for specific tracks or artists, and efficiently browse large datasets without performance issues.

## Goals

1. Provide a RESTful endpoint to query samples from the MySQL database
2. Enable users to search for samples by track name and artist name with partial matching
3. Implement cursor-based pagination for efficient browsing of large datasets
4. Include comprehensive metadata in responses for better client-side handling
5. Support multiple sorting options for flexible data exploration
6. Optimize performance through result caching

## User Stories

1. **As a developer**, I want to query all samples in the database via API so that I can display them in the application without direct database access.

2. **As a user**, I want to search for samples by typing partial artist or track names so that I can quickly find specific samples without knowing the exact spelling.

3. **As a user**, I want to browse through samples page by page so that the application loads quickly even with thousands of samples.

4. **As a user**, I want to sort samples by different criteria (date, name, relevance) so that I can explore the data in ways that make sense for my use case.

5. **As a developer**, I want to receive pagination metadata with responses so that I can build proper pagination UI controls.

## Functional Requirements

1. **Endpoint Definition**
   - The system must provide a GET endpoint at `/api/samples/search` or `/api/samples`
   - The endpoint must accept query parameters for search, pagination, and sorting

2. **Search Functionality**
   - The system must support partial/fuzzy matching for search queries
   - The system must search across both track names and artist names
   - The system must handle case-insensitive searches
   - Empty search queries must return all samples (paginated)

3. **Pagination**
   - The system must implement cursor-based pagination
   - The system must return 20 items per page by default
   - The system must accept a `cursor` parameter for subsequent pages
   - The system must accept a `limit` parameter to override page size (max 100)

4. **Response Format**
   - The system must return samples data in JSON format
   - The system must include pagination metadata:
     - `next_cursor`: cursor for next page (null if last page)
     - `prev_cursor`: cursor for previous page (null if first page)
     - `has_more`: boolean indicating more pages exist
     - `total_count`: total number of matching records
   - The system must include search metadata:
     - `query`: the search term used
     - `search_time_ms`: time taken for search
   - The system must include the actual samples array

5. **Sorting Options**
   - The system must support sorting by:
     - `created_at` (ascending/descending)
     - `track_name` (alphabetical)
     - `artist_name` (alphabetical)
     - `relevance` (when search query is present)
   - The system must accept `sort` and `order` parameters

6. **Caching**
   - The system must cache frequently accessed results
   - Cache must have a reasonable TTL (e.g., 5 minutes)
   - Cache must be invalidated when new samples are added

7. **Error Handling**
   - The system must return empty results array for no matches (not an error)
   - The system must validate pagination parameters
   - The system must handle malformed cursors gracefully

## Non-Goals (Out of Scope)

1. Advanced full-text search with complex query syntax
2. Filtering by date ranges or sample categories
3. Batch operations or bulk retrieval
4. Real-time/WebSocket updates for new samples
5. User-specific or authenticated searches
6. Modifying or deleting samples through this endpoint

## Design Considerations

### API Design

```
GET /api/samples?
  q={search_query}
  &cursor={pagination_cursor}
  &limit={items_per_page}
  &sort={field_name}
  &order={asc|desc}
```

### Response Structure

```json
{
  "data": [
    {
      "id": "sample_id",
      "track_name": "...",
      "artist_name": "...",
      "sample_track_name": "...",
      "sample_artist_name": "...",
      "created_at": "..."
      // other sample fields
    }
  ],
  "pagination": {
    "next_cursor": "...",
    "prev_cursor": "...",
    "has_more": true,
    "total_count": 150,
    "current_page_size": 20
  },
  "search": {
    "query": "search term",
    "search_time_ms": 45
  },
  "sorting": {
    "field": "relevance",
    "order": "desc"
  }
}
```

## Technical Considerations

1. **Database Integration**
   - Must work with existing MySQL database schema
   - Should use existing SQLx connection pool
   - Consider adding indexes on searchable fields if not present

2. **Cursor Implementation**
   - Use opaque cursors (base64 encoded) to hide implementation details
   - Cursor should encode the last record's ID and sort values
   - Must handle cursor validation and expiration

3. **Search Implementation**
   - Use MySQL's LIKE operator with wildcards for partial matching
   - Consider using MySQL's FULLTEXT indexes if available
   - Escape special characters in search queries to prevent SQL injection

4. **Caching Strategy**
   - Implement in-memory caching using Rust's built-in HashMap or a crate like `cached`
   - Cache key should include search query, pagination, and sort parameters
   - Consider using Redis if distributed caching is needed later

5. **Performance Optimizations**
   - Limit maximum page size to prevent resource exhaustion
   - Use database query optimization (EXPLAIN queries)
   - Consider implementing query result streaming for large datasets

## Success Metrics

1. **Performance Metrics**
   - Average response time < 200ms for paginated queries
   - Search queries return results in < 500ms for up to 10,000 records
   - Cache hit rate > 60% for common queries

2. **Usage Metrics**
   - Endpoint is successfully integrated into the mobile app
   - Reduction in direct database queries from client applications
   - Increased sample discovery rate by users

3. **Reliability Metrics**
   - API uptime > 99.9%
   - Zero data inconsistencies between API and database
   - Graceful handling of all error cases without crashes

## Open Questions

1. Should we implement rate limiting for this endpoint to prevent abuse?
2. Do we need to support combining multiple search terms with AND/OR logic?
3. Should deleted/inactive samples be excluded from results?
4. Is there a need for sample deduplication in results?
5. Should we log search queries for analytics purposes?
6. Do we need to support searching in sample metadata or just names?
7. Should the endpoint require any authentication or be completely public?

---

_Generated for the Bedfellow project - Paginated & Searchable Samples API_
