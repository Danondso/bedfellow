/**
 * Utility functions for error handling in MusicProviderContext
 */

/**
 * Extracts HTTP status code from various error types
 *
 * @param error - Error object which may contain status code
 * @returns HTTP status code or undefined if not found
 */
export const getErrorStatusCode = (error: unknown): number | undefined => {
  // Check for axios-style error with response.status
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    typeof error.response.status === 'number'
  ) {
    return error.response.status;
  }

  // Check for error with direct status property
  if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
    return error.status;
  }

  // Check for error with statusCode property
  if (typeof error === 'object' && error !== null && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  return undefined;
};

/**
 * Checks if an error is an authentication error (401 or 400 status)
 *
 * @param error - Error object to check
 * @returns true if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  const statusCode = getErrorStatusCode(error);
  return statusCode === 401 || statusCode === 400;
};
