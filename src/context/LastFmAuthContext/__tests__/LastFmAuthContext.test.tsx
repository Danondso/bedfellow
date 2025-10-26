import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastFmAuthContextProvider, useLastFmAuth } from '../index';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('LastFmAuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('LastFmAuthContextProvider initialization', () => {
    it('should provide default auth state values', () => {
      function TestComponent() {
        const { authState, isAuthenticated } = useLastFmAuth();
        return (
          <>
            <text testID="is-authenticated">{isAuthenticated.toString()}</text>
            <text testID="token">{authState.token?.username || 'null'}</text>
            <text testID="is-loading">{authState.isLoading.toString()}</text>
            <text testID="error">{authState.error || 'null'}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      expect(getByTestId('is-authenticated').children[0]).toBe('false');
      expect(getByTestId('token').children[0]).toBe('null');
      expect(getByTestId('is-loading').children[0]).toBe('true');
      expect(getByTestId('error').children[0]).toBe('null');
    });

    it('should load stored session key from AsyncStorage on mount', async () => {
      const storedToken = {
        sessionKey: 'test_session_key_12345',
        username: 'test_user',
        apiKey: 'test_api_key',
      };

      mockedAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedToken));

      function TestComponent() {
        const { authState, isAuthenticated } = useLastFmAuth();
        return (
          <>
            <text testID="is-authenticated">{isAuthenticated.toString()}</text>
            <text testID="username">{authState.token?.username || 'null'}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bedfellow/lastfm_auth');
      });

      await waitFor(() => {
        expect(getByTestId('is-authenticated').children[0]).toBe('true');
        expect(getByTestId('username').children[0]).toBe('test_user');
      });
    });

    it('should handle missing stored token gracefully', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null);

      function TestComponent() {
        const { authState, isAuthenticated } = useLastFmAuth();
        return (
          <>
            <text testID="is-authenticated">{isAuthenticated.toString()}</text>
            <text testID="is-loading">{authState.isLoading.toString()}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-loading').children[0]).toBe('false');
        expect(getByTestId('is-authenticated').children[0]).toBe('false');
      });
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockedAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      function TestComponent() {
        const { authState } = useLastFmAuth();
        return (
          <>
            <text testID="is-loading">{authState.isLoading.toString()}</text>
            <text testID="error">{authState.error || 'null'}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-loading').children[0]).toBe('false');
      });
    });
  });

  describe('setAuthToken', () => {
    it('should store session key and username in AsyncStorage', async () => {
      function TestComponent() {
        const { setAuthToken } = useLastFmAuth();

        React.useEffect(() => {
          setAuthToken('new_session_key', 'new_username');
        }, [setAuthToken]);

        return null;
      }

      render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@bedfellow/lastfm_auth',
          expect.stringContaining('new_session_key')
        );
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@bedfellow/lastfm_auth',
          expect.stringContaining('new_username')
        );
      });
    });

    it('should update auth state when token is set', async () => {
      function TestComponent() {
        const { authState, isAuthenticated, setAuthToken } = useLastFmAuth();

        React.useEffect(() => {
          setAuthToken('test_session', 'test_user');
        }, [setAuthToken]);

        return (
          <>
            <text testID="username">{authState.token?.username || 'null'}</text>
            <text testID="is-authenticated">{isAuthenticated.toString()}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-authenticated').children[0]).toBe('true');
        expect(getByTestId('username').children[0]).toBe('test_user');
      });
    });
  });

  describe('logout', () => {
    it('should clear token from AsyncStorage', async () => {
      function TestComponent() {
        const { logout, setAuthToken } = useLastFmAuth();

        React.useEffect(() => {
          setAuthToken('session', 'user');
        }, [setAuthToken]);

        React.useEffect(() => {
          const timer = setTimeout(() => logout(), 100);
          return () => clearTimeout(timer);
        }, [logout]);

        return null;
      }

      render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(
        () => {
          expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@bedfellow/lastfm_auth');
        },
        { timeout: 200 }
      );
    });

    it('should clear auth state', async () => {
      function TestComponent() {
        const { authState, isAuthenticated, logout, setAuthToken } = useLastFmAuth();

        React.useEffect(() => {
          setAuthToken('session', 'user');
          setTimeout(() => logout(), 50);
        }, [setAuthToken, logout]);

        return (
          <>
            <text testID="username">{authState.token?.username || 'null'}</text>
            <text testID="is-authenticated">{isAuthenticated.toString()}</text>
          </>
        );
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(
        () => {
          expect(getByTestId('username').children[0]).toBe('null');
          expect(getByTestId('is-authenticated').children[0]).toBe('false');
        },
        { timeout: 200 }
      );
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      function TestComponent() {
        const { authState, clearError } = useLastFmAuth();

        React.useEffect(() => {
          if (authState.error) {
            clearError();
          }
        }, [authState.error, clearError]);

        return <text testID="error">{authState.error || 'null'}</text>;
      }

      const { getByTestId } = render(
        <LastFmAuthContextProvider>
          <TestComponent />
        </LastFmAuthContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('error').children[0]).toBe('null');
      });
    });
  });
});

export default {};

