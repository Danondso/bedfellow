import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackList from '../../../../src/screens/Details/TrackList';
import whoSampledPayload, {
  emptyPayload,
} from '../../../fixtures/api/whosampled/sample-info.0';

describe('TrackList Test Suite', () => {
  const spotifyResponse = {
    artists: [{ name: 'Girl // Talk' }],
    name: 'Once Again',
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading skeleton when no info is passed in', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: whoSampledPayload }));

    render(
      <SafeAreaProvider>
        <TrackList trackInfo={spotifyResponse} />
      </SafeAreaProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId('tracklist_loading_skeleton')).toBeDefined()
    );

    await waitFor(() => {
      expect(screen.queryByTestId('tracklist_loading_skeleton')).toBeNull();
      expect(screen.getByText('Oasis')).toBeDefined();
    });
  });

  it('renders empty list component when no sample data is present', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: emptyPayload }));
    render(
      <SafeAreaProvider>
        <TrackList trackInfo={spotifyResponse} />
      </SafeAreaProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('tracklist_loading_skeleton')).toBeNull();
      expect(screen.getByText('No data.')).toBeDefined();
    });
  });
});
