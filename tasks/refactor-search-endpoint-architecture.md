# Task List: Refactor Search Endpoint Architecture

## Overview

Refactor the search endpoint implementation to match the existing architectural pattern in bedfellow-db-api, where database operations are extracted into separate helper functions and handlers focus on HTTP concerns.

## Relevant Files

- `server/bedfellow-db-api/src/handlers.rs` - Extract database logic from search handler into helper functions
- `server/bedfellow-db-api/src/queries.rs` - (Optional) New file if we decide to separate database queries
- `server/bedfellow-db-api/tests/test.rs` - Update tests if function signatures change

## Tasks

### 1.0 Extract Database Helper Functions

- [ ] 1.1 Create `search_samples_count()` function to handle count queries
  - [ ] 1.1.1 Extract count query SQL building logic
  - [ ] 1.1.2 Accept query string, AppState as parameters
  - [ ] 1.1.3 Return Result<i64, sqlx::Error>
  - [ ] 1.1.4 Move search clause construction into this function

- [ ] 1.2 Create `search_samples()` function for main search query
  - [ ] 1.2.1 Extract main samples query SQL building
  - [ ] 1.2.2 Accept query, cursor, sort, order, limit, AppState as parameters
  - [ ] 1.2.3 Return Result<Vec<SampleModel>, sqlx::Error>
  - [ ] 1.2.4 Include cursor clause building
  - [ ] 1.2.5 Include ORDER BY clause construction

- [ ] 1.3 Create `build_search_where_clause()` helper function
  - [ ] 1.3.1 Extract search WHERE clause logic
  - [ ] 1.3.2 Handle query escaping for SQL injection prevention
  - [ ] 1.3.3 Return formatted WHERE clause string
  - [ ] 1.3.4 Support both empty and populated queries

### 2.0 Refactor Search Handler

- [ ] 2.1 Simplify `search_samples_handler()` to orchestrate only
  - [ ] 2.1.1 Keep parameter validation and normalization
  - [ ] 2.1.2 Keep cursor decoding logic
  - [ ] 2.1.3 Call new `search_samples_count()` for total count
  - [ ] 2.1.4 Call new `search_samples()` for results
  - [ ] 2.1.5 Keep response transformation and cursor generation
  - [ ] 2.1.6 Keep timing and metadata assembly

- [ ] 2.2 Remove inline SQL from handler
  - [ ] 2.2.1 Remove count_query format! block (lines 332-338)
  - [ ] 2.2.2 Remove samples_query format! block (lines 346-361)
  - [ ] 2.2.3 Remove inline WHERE clause construction

### 3.0 Improve Code Organization

- [ ] 3.1 Group database helper functions together
  - [ ] 3.1.1 Move all database functions after handlers section
  - [ ] 3.1.2 Add comment header "// Database Helper Functions"
  - [ ] 3.1.3 Ensure consistent function naming pattern

- [ ] 3.2 Consider extracting to queries module (optional)
  - [ ] 3.2.1 Evaluate if handlers.rs is getting too large (>500 lines)
  - [ ] 3.2.2 If yes, create src/queries.rs
  - [ ] 3.2.3 Move all database helper functions to queries.rs
  - [ ] 3.2.4 Update lib.rs to export queries module

### 4.0 Optimize Database Queries

- [ ] 4.1 Review generated SQL for performance
  - [ ] 4.1.1 Ensure indexes are being used (run EXPLAIN)
  - [ ] 4.1.2 Consider prepared statements for frequently used queries
  - [ ] 4.1.3 Check for N+1 query patterns

- [ ] 4.2 Add query builders for complex SQL
  - [ ] 4.2.1 Create `SampleQueryBuilder` struct for dynamic query construction
  - [ ] 4.2.2 Implement builder pattern for search, sort, pagination
  - [ ] 4.2.3 Encapsulate SQL generation logic

### 5.0 Error Handling Improvements

- [ ] 5.1 Improve error handling in database functions
  - [ ] 5.1.1 Return proper Result types instead of unwrap_or
  - [ ] 5.1.2 Map database errors to HTTP responses appropriately
  - [ ] 5.1.3 Add context to errors for better debugging

- [ ] 5.2 Add logging for database operations
  - [ ] 5.2.1 Log slow queries (>100ms)
  - [ ] 5.2.2 Log query parameters for debugging
  - [ ] 5.2.3 Use appropriate log levels (debug for SQL, warn for slow)

### 6.0 Testing

- [ ] 6.1 Add unit tests for extracted functions
  - [ ] 6.1.1 Test `build_search_where_clause()` with various inputs
  - [ ] 6.1.2 Test SQL injection prevention
  - [ ] 6.1.3 Test edge cases (empty query, special characters)

- [ ] 6.2 Update integration tests
  - [ ] 6.2.1 Ensure existing tests still pass
  - [ ] 6.2.2 Add tests for new function signatures if exposed
  - [ ] 6.2.3 Test refactored search endpoint behavior

### 7.0 Documentation

- [ ] 7.1 Document the architecture pattern
  - [ ] 7.1.1 Add comments explaining the separation of concerns
  - [ ] 7.1.2 Document why this pattern is used
  - [ ] 7.1.3 Provide examples for future endpoints

- [ ] 7.2 Update API documentation
  - [ ] 7.2.1 Ensure OpenAPI spec is still accurate
  - [ ] 7.2.2 Update any internal documentation
  - [ ] 7.2.3 Add notes about the refactoring if needed

## Success Criteria

- [ ] Search endpoint maintains exact same API contract
- [ ] All existing tests pass
- [ ] Database logic is separated from HTTP handling
- [ ] Code follows the same pattern as existing endpoints
- [ ] No inline SQL in handler functions
- [ ] Improved readability and maintainability

## Notes

- This refactoring is internal only - no API changes
- Performance should remain the same or improve
- Consider doing this refactoring in small, testable commits
- Run `cargo test` after each major change
- Use `cargo clippy` to catch any issues
