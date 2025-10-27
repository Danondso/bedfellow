import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { AuthorizeResult } from 'react-native-app-auth';
import SpotifyAuthContextProvider, {
  SpotifyAuthContext,
  type SpotifyAuthContextData,
} from '@context/SpotifyAuthContext';
import { MusicProviderId, type ProviderAuthSession } from '@services/music-providers/types';

jest.mock('axios');
const mockAxiosPost = axios.post as jest.Mock;

const mockUseMusicProvider = jest.fn();
jest.mock('@context/MusicProviderContext', () => ({
  useMusicProvider: () => mockUseMusicProvider(),
}));

jest.mock('react-native-config', () => ({
  BEDFELLOW_API_BASE_URL: 'https://example.com',
}));

type SessionState = {
  value: ProviderAuthSession | null;
};

type MusicProviderStub = {
  availableProviders: any[];
  activeProviderId: MusicProviderId;
  isLoading: boolean;
  sessions: Record<string, ProviderAuthSession | null>;
  setSession: jest.Mock;
  clearSession: jest.Mock;
  getSession: jest.Mock;
  setActiveProvider: jest.Mock;
  isProviderAvailable: jest.Mock;
  getAdapter: jest.Mock;
};

const createSession = (overrides: Partial<ProviderAuthSession> = {}): ProviderAuthSession => ({
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  tokenType: 'Bearer',
  scopes: ['scope'],
  ...overrides,
});

const createAuthorizeResult = (overrides: Partial<AuthorizeResult> = {}): AuthorizeResult => ({
  accessToken: 'auth-token',
  accessTokenExpirationDate: new Date(Date.now() + 3600000).toISOString(),
  refreshToken: 'auth-refresh',
  tokenType: 'Bearer',
  scopes: ['scope'],
  ...overrides,
});

const createMusicProviderStub = (sessionState: SessionState, isLoading = false): MusicProviderStub => {
  const setSession = jest.fn(async (_providerId: MusicProviderId, session: ProviderAuthSession | null) => {
    sessionState.value = session;
  });
  const clearSession = jest.fn(async (_providerId: MusicProviderId) => {
    sessionState.value = null;
  });

  const getSession = jest.fn((providerId?: MusicProviderId) => {
    if (providerId && providerId !== MusicProviderId.Spotify) {
      return null;
    }
    return sessionState.value;
  });

  return {
    availableProviders: [],
    activeProviderId: MusicProviderId.Spotify,
    isLoading,
    sessions: {},
    setSession,
    clearSession,
    getSession,
    setActiveProvider: jest.fn(),
    isProviderAvailable: jest.fn(() => true),
    getAdapter: jest.fn(),
  };
};

const renderWithProvider = (stub: MusicProviderStub) => {
  mockUseMusicProvider.mockImplementation(() => stub);

  const contextRef = { current: null as SpotifyAuthContextData | null };

  const Collector: React.FC = () => {
    const ctx = React.useContext(SpotifyAuthContext) as SpotifyAuthContextData;
    React.useEffect(() => {
      contextRef.current = ctx;
    }, [ctx]);
    return null;
  };

  render(
    <SpotifyAuthContextProvider>
      <Collector />
    </SpotifyAuthContextProvider>
  );

  return contextRef;
};

describe('SpotifyAuthContext integrating MusicProviderContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mirrors the provider loading state before hydration completes', async () => {
    const sessionState: SessionState = { value: null };
    const stub = createMusicProviderStub(sessionState, true);
    const contextRef = renderWithProvider(stub);

    await waitFor(() => expect(contextRef.current).not.toBeNull());
    expect(contextRef.current?.authState.isLoading).toBe(true);
  });

  it('hydrates auth state from an existing provider session', async () => {
    const storedSession = createSession();
    const sessionState: SessionState = { value: storedSession };
    const stub = createMusicProviderStub(sessionState);
    const contextRef = renderWithProvider(stub);

    await waitFor(() => expect(contextRef.current?.authState.isLoading).toBe(false));

    expect(contextRef.current?.authState.token).toMatchObject({
      accessToken: storedSession.accessToken,
      refreshToken: storedSession.refreshToken ?? '',
    });
  });

  it('persists new sessions via the music provider on setAuthToken', async () => {
    const sessionState: SessionState = { value: null };
    const stub = createMusicProviderStub(sessionState);
    const contextRef = renderWithProvider(stub);

    await waitFor(() => expect(contextRef.current?.authState.isLoading).toBe(false));

    const authorizeResult = createAuthorizeResult();

    await act(async () => {
      await contextRef.current?.setAuthToken(authorizeResult);
    });

    expect(stub.setSession).toHaveBeenCalledWith(
      MusicProviderId.Spotify,
      expect.objectContaining({
        accessToken: authorizeResult.accessToken,
        refreshToken: authorizeResult.refreshToken,
      })
    );
  });

  it('clears persisted session on logout', async () => {
    const sessionState: SessionState = { value: createSession() };
    const stub = createMusicProviderStub(sessionState);
    const contextRef = renderWithProvider(stub);

    await waitFor(() => expect(contextRef.current?.authState.isLoading).toBe(false));

    await act(async () => {
      await contextRef.current?.logout();
    });

    expect(stub.clearSession).toHaveBeenCalledWith(MusicProviderId.Spotify);
    expect(sessionState.value).toBeNull();
  });

  it('updates the provider session when refreshing tokens', async () => {
    const initialSession = createSession();
    const sessionState: SessionState = { value: initialSession };
    const stub = createMusicProviderStub(sessionState);
    const contextRef = renderWithProvider(stub);

    await waitFor(() => expect(contextRef.current?.authState.isLoading).toBe(false));

    mockAxiosPost.mockResolvedValue({
      data: { access_token: 'new-token', expires_in: 3600 },
    });

    await act(async () => {
      await contextRef.current?.refreshToken();
    });

    expect(stub.setSession).toHaveBeenCalledWith(
      MusicProviderId.Spotify,
      expect.objectContaining({ accessToken: 'new-token' })
    );
  });
});
