import SpotifyAuthContextProvider from './SpotifyAuthContext';
import LastFmAuthContextProvider from './LastFmAuthContext';

export { default as SpotifyAuthContextProvider } from './SpotifyAuthContext';
export { default as LastFmAuthContextProvider } from './LastFmAuthContext';
export { useLastFmAuth } from './LastFmAuthContext';
export { LastFmAuthContext } from './LastFmAuthContext';

// Default export remains Spotify for backward compatibility
export default SpotifyAuthContextProvider;
