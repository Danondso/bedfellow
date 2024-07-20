import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
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
    expect(screen.getByText('Login')).toBeTruthy();
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

        await act(async () => fireEvent.press(await screen.findByText('Login')));
        await act(async () => fireEvent.press(await screen.findByText('Ponderosa Twins Plus One')));

        await waitFor(() => {
          expect(screen.findByText('Ponderosa Twins Plus One')).toBeDefined();
          expect(screen.getByText('Queued Bound by Ponderosa Twins Plus One')).toBeDefined();
          expect(authorize).toHaveBeenCalledTimes(1);
          expect(mockedAxios.get).toHaveBeenCalledTimes(3);
          expect(mockedImageColors.getColors).toHaveBeenCalledTimes(1);
          expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
      });

      it('fails to queue sample sourced from a TV show', async () => {
        Platform.OS = 'android';

        mockedImageColors.getColors.mockResolvedValue(androidColors);

        await act(async () => fireEvent.press(await screen.findByText('Login')));
        await act(async () => fireEvent.press(await screen.findByText('Martin (TV show)')));

        await waitFor(() => {
          expect(screen.findByText('Martin (TV show)')).toBeDefined();
          expect(screen.getByText('Cannot queue tv show')).toBeDefined();

          expect(authorize).toHaveBeenCalledTimes(1);
          expect(mockedAxios.get).toHaveBeenCalledTimes(2);
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

        await act(async () => fireEvent.press(await screen.findByText('Login')));
        await act(async () => fireEvent.press(await screen.findByText('Ponderosa Twins Plus One')));

        await waitFor(() => {
          expect(screen.findByText('Ponderosa Twins Plus One')).toBeDefined();
          expect(screen.getByText('Queued Bound by Ponderosa Twins Plus One')).toBeDefined();
          expect(authorize).toHaveBeenCalledTimes(1);
          expect(mockedAxios.get).toHaveBeenCalledTimes(3);
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

    await act(async () => fireEvent.press(await screen.getByText('Login')));
    // TODO check redirectUri
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledTimes(9);
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
    await act(async () => fireEvent.press(await screen.findByText('Login')));
    // TODO check redirectUri
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Nothing playing currently.')).toBeDefined();
    expect(screen.getByText('No samples found.')).toBeDefined();
    expect(mockedImageColors.getColors).toHaveBeenCalledTimes(0);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  describe('Login Failures', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('shows login failure alert', async () => {
      // @ts-ignore
      authorize.mockRejectedValueOnce('Failed to login');
      await act(async () => fireEvent.press(await screen.findByText('Login')));
      expect(Alert.alert).toHaveBeenCalledWith('Failed to login');
    });
    it('shows login failure alert with error text', async () => {
      // @ts-ignore
      authorize.mockRejectedValueOnce(new Error('Oops'));
      await act(async () => fireEvent.press(await screen.findByText('Login')));
      expect(Alert.alert).toHaveBeenCalledWith('Failed to login', 'Oops');
    });
  });
});
