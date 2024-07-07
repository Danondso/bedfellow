import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { Platform } from 'react-native';
import axios from 'axios';
import RootNavigation from '../src/screens';
import currentTrack0 from './fixtures/api/spotify/current-track.0';
import sampledInfo0 from './fixtures/api/bedfellow-db-api/sample-info.0';

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

// if this is not here, we get open handles
jest.useFakeTimers();
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Screen Test Suite', () => {
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
    await render(<RootNavigation />);
  });

  it('renders login button text', () => {
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('logs in, loads current track from spotify, retrieves samples from bedfellow-db-api, and queues samples', async () => {
    Platform.OS = 'android';

    mockedAxios.get.mockResolvedValueOnce({
      data: currentTrack0,
      status: 200,
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: sampledInfo0,
      status: 200,
    });

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
        tracks: {
          items: [
            {
              name: 'Bound',
              artists: [
                {
                  name: 'Ponderosa Twins Plus One',
                },
              ],
            },
          ],
        },
      },
    });

    mockedAxios.post.mockResolvedValue({
      data: null,
      status: 204,
    });

    waitFor(async () => fireEvent.press(await screen.findByText('Login')));

    waitFor(async () => fireEvent.press(await screen.findByText('Ponderosa Twins Plus One')));

    await waitFor(() => {
      expect(screen.findByText('Ponderosa Twins Plus One')).toBeDefined();
      expect(screen.getByText('Queued Bound by Ponderosa Twins Plus One')).toBeDefined();

      expect(authorize).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  it('logs in, loads current track from spotify, retrieves samples from bedfellow-db-api', async () => {
    Platform.OS = 'android';

    mockedAxios.get.mockResolvedValueOnce({
      data: currentTrack0,
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: sampledInfo0,
    });
    await waitFor(() => fireEvent.press(screen.getByText('Login')));
    // TODO check redirectUri
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ponderosa Twins Plus One')).toBeDefined();
  });

  it('invokes authorize function when pressing Login', async () => {
    Platform.OS = 'ios';

    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });
    await waitFor(async () => fireEvent.press(await screen.findByText('Login')));
    // TODO check redirectUri
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('No data.')).toBeDefined();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
