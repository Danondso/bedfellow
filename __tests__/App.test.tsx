import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import ImageColors, { AndroidImageColors, IOSImageColors } from 'react-native-image-colors';
import RootNavigation from '../src/screens';
import defaultPalette from '../src/theme/styles';
import ErrorBoundary from './helpers/components/ErrorBoundary';
import { happyPathApiHandler, whoSampledParsingApiHandler } from './helpers';

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

// if this is not here, we get open handles
jest.useFakeTimers();
jest.mock('axios');

Date.now = () => 1726093188178;

const androidColors: AndroidImageColors = {
  platform: 'android',
  average: defaultPalette.primaryBackground,
  dominant: defaultPalette.primaryBackground100,
  darkMuted: defaultPalette.accent,
  darkVibrant: defaultPalette.error,
};

const iosColors: IOSImageColors = {
  platform: 'ios',
  background: defaultPalette.primaryBackground,
  primary: defaultPalette.primaryBackground100,
  secondary: defaultPalette.secondaryBackground,
  detail: defaultPalette.shadow,
  quality: undefined,
};

const authorizeRequest = {
  clientId: 'spotify_client_id',
  redirectUrl: 'com.bedfellow://callback/',
  scopes: ['user-read-playback-state', 'user-modify-playback-state', 'user-follow-read', 'user-read-currently-playing'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'http://localhost:8085/token',
  },
  usePKCE: false,
};

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedImageColors = ImageColors as jest.Mocked<typeof ImageColors>;

describe('App Test Suite', () => {
  const authResult: AuthorizeResult = {
    accessToken: 'accessToken',
    accessTokenExpirationDate: '',
    idToken: 'id',
    refreshToken: 'refreshToken',
    tokenType: 'bearer',
    scopes: [],
    authorizationCode: 'codeywodey',
  };
  beforeEach(async () => {
    jest.resetAllMocks();
    // @ts-ignore
    authorize.mockResolvedValueOnce(authResult);
    mockedAxios.get.mockImplementation((url) => happyPathApiHandler(url));
    await render(
      <ErrorBoundary>
        <RootNavigation />
      </ErrorBoundary>
    );
  });

  it('renders login button text', () => {
    expect(screen.getByText('Login with Spotify')).toBeTruthy();
  });

  describe('logs in, loads current track from spotify, retrieves samples from bedfellow-db-api', () => {
    describe('android tests', () => {
      it('queues samples', async () => {
        Platform.OS = 'android';

        mockedAxios.post.mockResolvedValueOnce({
          data: null,
          status: 204,
        });

        mockedImageColors.getColors.mockResolvedValue(androidColors);

        await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
        await waitFor(async () => fireEvent.press(await screen.findByText('Ponderosa Twins Plus One')));

        await waitFor(() => {
          expect(screen.findByText('Ponderosa Twins Plus One')).toBeDefined();
          expect(screen.getByText('Queued Bound by Ponderosa Twins Plus One')).toBeDefined();
          expect(authorize).toHaveBeenCalledWith(authorizeRequest);
          expect(mockedAxios.get).toHaveBeenCalledTimes(3);
          expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' },
          });
          expect(mockedAxios.get).toHaveBeenNthCalledWith(
            2,
            'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2'
          );
          expect(mockedAxios.get).toHaveBeenNthCalledWith(
            3,
            'https://api.spotify.com/v1/search?q=%2620track%3ABound%2520artist%3APonderosa%2BTwins+Plus+One&type=track&limit=50',
            { headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' } }
          );

          expect(mockedImageColors.getColors).toHaveBeenCalledTimes(1);

          expect(mockedAxios.post).toHaveBeenCalledTimes(1);
          expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/queue?uri=undefined',
            {},
            { headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' } }
          );
        });
      });

      it('fails to queue sample sourced from a TV show', async () => {
        Platform.OS = 'android';

        mockedImageColors.getColors.mockResolvedValue(androidColors);

        await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
        await waitFor(async () => fireEvent.press(await screen.findByText('Martin (TV show)')));

        await waitFor(() => {
          expect(screen.findByText('Martin (TV show)')).toBeDefined();
          expect(screen.getByText('Cannot queue tv show')).toBeDefined();

          expect(authorize).toHaveBeenCalledWith(authorizeRequest);
          expect(mockedAxios.get).toHaveBeenCalledTimes(2);
          expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' },
          });
          expect(mockedAxios.get).toHaveBeenNthCalledWith(
            2,
            'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2'
          );
          expect(mockedImageColors.getColors).toHaveBeenCalledTimes(1);
          expect(mockedAxios.post).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('ios tests', () => {
      it('queues samples', async () => {
        Platform.OS = 'ios';

        mockedAxios.post.mockResolvedValueOnce({
          data: null,
          status: 204,
        });

        mockedImageColors.getColors.mockResolvedValue(iosColors);

        await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
        await waitFor(async () => fireEvent.press(await screen.findByText('Ponderosa Twins Plus One')));

        await waitFor(() => {
          expect(screen.findByText('Ponderosa Twins Plus One')).toBeDefined();
          expect(screen.getByText('Queued Bound by Ponderosa Twins Plus One')).toBeDefined();
          expect(authorize).toHaveBeenCalledWith({
            ...authorizeRequest,
            redirectUrl: 'org.danondso.bedfellow://callback/',
          });
          expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' },
          });
          expect(mockedAxios.get).toHaveBeenNthCalledWith(
            2,
            'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2'
          );
          expect(mockedAxios.get).toHaveBeenNthCalledWith(
            3,
            'https://api.spotify.com/v1/search?q=%2620track%3ABound%2520artist%3APonderosa%2BTwins+Plus+One&type=track&limit=50',
            { headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' } }
          );

          expect(mockedImageColors.getColors).toHaveBeenCalledTimes(1);
          expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  it('logs in, loads current track from spotify, loads and parses whosampled page for track, and retrieves samples from bedfellow-db-api', async () => {
    Platform.OS = 'android';

    mockedAxios.get.mockImplementation((url) => whoSampledParsingApiHandler(url));

    // post to bedfellow-db-api
    mockedAxios.post.mockResolvedValueOnce({
      status: 204,
    });

    mockedImageColors.getColors.mockResolvedValue(androidColors);

    await waitFor(async () => fireEvent.press(await screen.getByText('Login with Spotify')));
    expect(authorize).toHaveBeenCalledWith(authorizeRequest);
    expect(mockedAxios.get).toHaveBeenCalledTimes(9);
    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' },
    });
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2'
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      3,
      'https://www.whosampled.com/ajax/search/?q=Kanye West Bound 2&_=1726093188178'
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(4, 'https://www.whosampled.com/Kanye-West/Bound-2/samples', {
      responseType: 'text',
    });
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      5,
      'https://www.whosampled.com/static/images/media/track_images_200/lr60124_201393_14349154951.jpg',
      { responseType: 'blob' }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      6,
      'https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg',
      { responseType: 'blob' }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      7,
      'https://www.whosampled.com/static/images/media/track_images_200/lr28714_2012827_101413805613.jpg',
      { responseType: 'blob' }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      8,
      'https://www.whosampled.com/static/images/media/visualmedia_images_200/lr60124_2017215_112028118784.jpg',
      { responseType: 'blob' }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      9,
      'http://localhost:8000/api/samples?artist_name=Kanye West&track_name=Bound 2'
    );

    expect(mockedImageColors.getColors).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ponderosa Twins Plus One')).toBeDefined();
  });

  it('invokes authorize function when pressing Login', async () => {
    Platform.OS = 'ios';

    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });
    await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
    expect(authorize).toHaveBeenCalledWith({
      ...authorizeRequest,
      redirectUrl: 'org.danondso.bedfellow://callback/',
    });
    expect(screen.getByText('Nothing playing currently.')).toBeDefined();
    expect(screen.getByText('Play Something.')).toBeDefined();
    expect(mockedImageColors.getColors).toHaveBeenCalledTimes(0);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenLastCalledWith('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: 'Bearer ', 'Content-Type': 'application/json' },
    });
  });

  describe('Login Failures', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('shows login failure alert', async () => {
      // @ts-ignore
      authorize.mockRejectedValueOnce('Failed to login');
      await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
      expect(Alert.alert).toHaveBeenCalledWith('Failed to login');
    });
    it('shows login failure alert with error text', async () => {
      // @ts-ignore
      authorize.mockRejectedValueOnce(new Error('Oops'));
      await waitFor(async () => fireEvent.press(await screen.findByText('Login with Spotify')));
      expect(Alert.alert).toHaveBeenCalledWith('Failed to login', 'Oops');
    });
  });
});
