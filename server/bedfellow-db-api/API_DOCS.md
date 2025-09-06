# Bedfellow DB API Documentation

## Endpoints

### Search Samples

**GET** `/api/samples/search`

Search and retrieve samples with pagination support.

#### Query Parameters

| Parameter | Type    | Required | Default    | Description                                             |
| --------- | ------- | -------- | ---------- | ------------------------------------------------------- |
| `q`       | string  | No       | -          | Search query for partial matching on artist/track names |
| `cursor`  | string  | No       | -          | Pagination cursor for retrieving next/previous page     |
| `limit`   | integer | No       | 20         | Number of items per page (max: 100)                     |
| `sort`    | string  | No       | created_at | Sort field: `created_at`, `track_name`, `artist_name`   |
| `order`   | string  | No       | desc       | Sort order: `asc` or `desc`                             |

#### Response Format

```json
{
  "data": [
    {
      "id": 123,
      "artist": "The Beatles",
      "track": "Come Together",
      "year": 1969,
      "image": "base64_encoded_image_data"
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzLCJzb3J0X3ZhbHVlIjoiQ29tZSBUb2dldGhlciJ9",
    "prev_cursor": null,
    "has_more": true,
    "total_count": 150,
    "current_page_size": 20
  },
  "search": {
    "query": "beatles",
    "search_time_ms": 45
  },
  "sorting": {
    "field": "track_name",
    "order": "asc"
  }
}
```

#### Example Requests

Search for Kanye West samples:

```bash
curl "http://localhost:8000/api/samples/search?q=kanye&limit=5"
```

Get next page using cursor:

```bash
curl "http://localhost:8000/api/samples/search?cursor=eyJpZCI6MTEsInNvcnRfdmFsdWUiOiIxMSIsInRpbWVzdGFtcCI6MTc1NzEzNDMyN30=&limit=5"
```

Sort by artist name ascending:

```bash
curl "http://localhost:8000/api/samples/search?sort=artist_name&order=asc&limit=5"
```

Get all samples (no search query):

```bash
curl "http://localhost:8000/api/samples/search"
```

### Get Samples (Legacy)

**GET** `/api/samples`

Get samples for a specific track (exact match required).

#### Query Parameters

| Parameter     | Type   | Required | Description       |
| ------------- | ------ | -------- | ----------------- |
| `artist_name` | string | Yes      | Exact artist name |
| `track_name`  | string | Yes      | Exact track name  |

### Create Samples

**POST** `/api/samples`

Create new sample entries.

#### Request Body

```json
{
  "artist_name": "The Beatles",
  "track_name": "Come Together",
  "samples": [
    {
      "artist": "Chuck Berry",
      "track": "You Can't Catch Me",
      "year": 1956,
      "image": "base64_encoded_image"
    }
  ]
}
```

### Health Check

**GET** `/api/healthchecker`

Check if the API is running.

## Cursor Pagination

The API uses cursor-based pagination for efficient data retrieval:

1. Initial request returns a `next_cursor` if more pages exist
2. Use the cursor in subsequent requests to get the next page
3. Cursors expire after 1 hour
4. Cursors encode the last item's ID and sort value

## Search Behavior

- Searches are case-insensitive
- Partial matching is supported (searches for substrings)
- Special characters (%, \_) are escaped automatically
- Empty search query returns all samples

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing for production use.

## Error Responses

```json
{
  "status": "failure",
  "message": "Error description"
}
```

Common HTTP status codes:

- 200: Success
- 400: Bad request (invalid parameters)
- 404: Resource not found
- 500: Internal server error
