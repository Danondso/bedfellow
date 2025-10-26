import crypto from 'crypto';

/**
 * Generates last.fm API signature for authenticated requests
 * last.fm requires API signatures for all write operations (scrobbling, etc.)
 * 
 * @param params - Object containing API parameters
 * @param apiSecret - last.fm API secret
 * @returns MD5 hash of sorted parameters
 */
export function generateApiSignature(params: Record<string, string>, apiSecret: string): string {
  // Sort parameters by key and concatenate
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}${params[key]}`)
    .join('');
  
  // Add API secret and create signature
  const signatureString = sortedParams + apiSecret;
  
  // Generate MD5 hash
  const hash = crypto.createHash('md5');
  hash.update(signatureString);
  return hash.digest('hex');
}

/**
 * Builds last.fm API request URL with all parameters
 * 
 * @param baseUrl - Base URL for last.fm API
 * @param params - Object containing API parameters
 * @param apiSecret - last.fm API secret for signature generation
 * @returns Complete URL with query parameters
 */
export function buildLastFmApiUrl(
  baseUrl: string,
  params: Record<string, string>,
  apiSecret?: string
): string {
  const urlParams = new URLSearchParams();
  
  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    urlParams.append(key, value);
  });
  
  // Generate and add signature if secret provided
  if (apiSecret) {
    const signature = generateApiSignature(params, apiSecret);
    urlParams.append('api_sig', signature);
  }
  
  return `${baseUrl}?${urlParams.toString()}`;
}

/**
 * Sanitizes track/artist names for last.fm API requests
 * Removes special characters and normalizes whitespace
 * 
 * @param name - Track or artist name
 * @returns Sanitized name
 */
export function sanitizeLastFmName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/['"]/g, ''); // Remove quotes
}

/**
 * Formats timestamp for last.fm scrobble requests
 * 
 * @param date - Date object
 * @returns Unix timestamp as string
 */
export function formatLastFmTimestamp(date: Date): string {
  return Math.floor(date.getTime() / 1000).toString();
}

