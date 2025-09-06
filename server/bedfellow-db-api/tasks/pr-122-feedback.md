# PR #122 Feedback Tasks

## Critical Issues (Security/Functionality)

### 1. SQL Injection Vulnerability in Search

**File:** `src/queries.rs:119-130`
**Issue:** Manual string escaping is insufficient for SQL injection prevention
**Current Code:**

```rust
let escaped_query = q.replace("%", "\\%").replace("_", "\\_");
format!(
    "WHERE (a1.artist_name LIKE '%{}%' OR s.track_name LIKE '%{}%')",
    escaped_query, escaped_query
)
```

**Task:** Replace with parameterized queries using SQLx bind parameters

### 2. Error Handling with Default Values

**File:** `src/queries.rs:21`
**Issue:** Using `unwrap_or((0,))` masks database errors
**Current Code:**

```rust
.fetch_one(&data.db).await.unwrap_or((0,))
```

**Task:** Implement proper error handling with Result types

## Quality Improvements

### 3. Missing TypeScript Sort Option

**File:** `src/types/bedfellow-api.ts:21`
**Issue:** TypeScript types don't include 'relevance' sort option that may be added later
**Current Code:**

```typescript
sort?: 'created_at' | 'track_name' | 'artist_name';
```

**Task:** Consider if 'relevance' sorting will be needed and add if necessary

### 4. Error Handling Pattern Consistency

**Files:** `src/queries.rs:53`, `src/queries.rs:87`
**Issue:** Multiple instances of `unwrap_or((0,))` pattern
**Task:** Create consistent error handling approach across all query functions

### 5. SQL Query Construction Safety

**File:** `src/queries.rs:139-145`
**Issue:** Dynamic SQL construction without parameterization
**Task:** Refactor to use SQLx query builder or prepared statements

### 6. Track Query SQL Error

**File:** `src/queries.rs:50`
**Issue:** SQL syntax error - missing AND operator
**Current Code:**

```rust
"SELECT track from sample WHERE track_name = ? artist_id = ?"
```

**Task:** Fix SQL syntax error

## Implementation Priority

1. Fix SQL injection vulnerability (Critical)
2. Fix SQL syntax error in track query (Critical)
3. Implement proper error handling (Quality)
4. Consider TypeScript type completeness (Enhancement)
