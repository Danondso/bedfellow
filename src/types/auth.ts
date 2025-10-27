/**
 * Shared authentication types
 */

export type SpotifyAuthToken = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO string for serialization
  tokenType: string;
  scopes: string[];
};
