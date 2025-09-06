import { useState, useCallback, useEffect, useRef } from 'react';
import { searchSamples } from '@services/bedfellow-db-api/BedfellowDBAPI.service';
import { BedfellowSample, SearchQueryParams, PaginatedSearchResponse } from '../../types/bedfellow-api';

/**
 * Hook for searching samples in the Bedfellow database.
 * Manages search state, pagination, and debouncing.
 *
 * @returns {Object} An object containing:
 * - searchSamples: Async function to search for samples
 * - loadMore: Function to load more results
 * - refresh: Function to refresh the current search
 * - results: Array of search results
 * - loading: Boolean indicating if initial search is in progress
 * - loadingMore: Boolean indicating if loading more results
 * - refreshing: Boolean indicating if refreshing
 * - error: Error object if the search failed
 * - hasMore: Boolean indicating if more results are available
 * - query: Current search query
 *
 * @example
 * ```tsx
 * const { searchSamples, results, loading } = useSearchSamples();
 *
 * // Search for samples
 * await searchSamples('Pink Floyd');
 *
 * // Check results
 * if (loading) {
 *   return <LoadingSpinner />;
 * }
 *
 * if (results.length > 0) {
 *   return <SampleList samples={results} />;
 * }
 * ```
 */
const useSearchSamples = () => {
  const [results, setResults] = useState<BedfellowSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Performs the actual search request
   */
  const performSearch = useCallback(async (searchQuery: string, nextCursor?: string | null, isRefresh?: boolean) => {
    if (!searchQuery && !nextCursor && !isRefresh) {
      setLoading(true);
    } else if (nextCursor) {
      setLoadingMore(true);
    } else if (isRefresh) {
      setRefreshing(true);
    }

    setError(null);

    try {
      const params: SearchQueryParams = {
        q: searchQuery || undefined,
        cursor: nextCursor || undefined,
        limit: 20,
      };

      const response: PaginatedSearchResponse = await searchSamples(params);

      if (nextCursor) {
        setResults((prev) => [...prev, ...response.data]);
      } else {
        setResults(response.data);
      }

      setCursor(response.pagination.next_cursor);
      setHasMore(response.pagination.has_more);
    } catch (err) {
      setError('Failed to search samples. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Search for samples with debouncing
   */
  const searchSamplesDebounced = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 500);
    },
    [performSearch]
  );

  /**
   * Load more results
   */
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && cursor) {
      performSearch(query, cursor);
    }
  }, [loadingMore, hasMore, cursor, query, performSearch]);

  /**
   * Refresh the current search
   */
  const refresh = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await performSearch(query, null, true);
  }, [query, performSearch]);

  // Load initial results on mount
  useEffect(() => {
    performSearch('');
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    searchSamples: searchSamplesDebounced,
    loadMore,
    refresh,
    results,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore,
    query,
  };
};

export default useSearchSamples;
