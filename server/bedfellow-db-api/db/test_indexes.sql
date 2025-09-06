-- Test queries to verify index usage for the search endpoint
-- Run these with EXPLAIN to ensure indexes are being used

USE bedfellow;

-- Test 1: Search by artist name
EXPLAIN SELECT 
    s.sample_id,
    a1.artist_name as track_artist,
    s.track_name,
    s.track_year,
    a2.artist_name as sample_artist,
    t.track_name as sample_track_name
FROM sample s
JOIN artist a1 ON s.track_artist = a1.artist_id
JOIN artist a2 ON s.sample_artist_id = a2.artist_id
JOIN track t ON s.sample_track_id = t.track_id
WHERE a1.artist_name LIKE '%Beatles%'
LIMIT 20;

-- Test 2: Search by track name
EXPLAIN SELECT 
    s.sample_id,
    a1.artist_name as track_artist,
    s.track_name,
    s.track_year,
    a2.artist_name as sample_artist,
    t.track_name as sample_track_name
FROM sample s
JOIN artist a1 ON s.track_artist = a1.artist_id
JOIN artist a2 ON s.sample_artist_id = a2.artist_id
JOIN track t ON s.sample_track_id = t.track_id
WHERE s.track_name LIKE '%Yesterday%'
LIMIT 20;

-- Test 3: Search by both artist and track name
EXPLAIN SELECT 
    s.sample_id,
    a1.artist_name as track_artist,
    s.track_name,
    s.track_year,
    a2.artist_name as sample_artist,
    t.track_name as sample_track_name
FROM sample s
JOIN artist a1 ON s.track_artist = a1.artist_id
JOIN artist a2 ON s.sample_artist_id = a2.artist_id
JOIN track t ON s.sample_track_id = t.track_id
WHERE (a1.artist_name LIKE '%Beatles%' OR s.track_name LIKE '%Yesterday%')
LIMIT 20;

-- Test 4: Pagination with cursor (using sample_id as cursor)
EXPLAIN SELECT 
    s.sample_id,
    a1.artist_name as track_artist,
    s.track_name,
    s.track_year,
    a2.artist_name as sample_artist,
    t.track_name as sample_track_name
FROM sample s
JOIN artist a1 ON s.track_artist = a1.artist_id
JOIN artist a2 ON s.sample_artist_id = a2.artist_id
JOIN track t ON s.sample_track_id = t.track_id
WHERE s.sample_id > 100  -- Cursor position
    AND (a1.artist_name LIKE '%Beatles%' OR s.track_name LIKE '%Yesterday%')
ORDER BY s.sample_id
LIMIT 20;

-- Test 5: Count query for total results
EXPLAIN SELECT COUNT(*) as total
FROM sample s
JOIN artist a1 ON s.track_artist = a1.artist_id
WHERE a1.artist_name LIKE '%Beatles%' OR s.track_name LIKE '%Yesterday%';