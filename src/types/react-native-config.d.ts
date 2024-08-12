declare module 'react-native-config' {
  export interface NativeConfig {
    BEDFELLOW_API_BASE_URL: string;
    BEDFELLOW_DB_API_BASE_URL: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_REDIRECT_URI_ANDROID: string;
    SPOTIFY_REDIRECT_URI: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
