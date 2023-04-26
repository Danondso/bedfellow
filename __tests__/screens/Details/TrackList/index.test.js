import React from 'react';
import { render, screen } from '@testing-library/react-native';
import axios from 'axios';
import TrackList from '@screens/Details/TrackList';
import whoSampledPayload from '../../../fixtures/api/whosampled/sample-info.0';

describe('TrackList Test Suite', () => {
  const spotifyResponse = {
    artists: [{ name: 'Girl Talk' }],
    name: 'Once Again',
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading skeleton when no info is passed in', () => {
    // This test throws this warning but that's intentional
    // Warning: An update to TrackList inside a test was not wrapped in act(...).
    axios.get.mockReturnValueOnce(Promise.resolve({ data: whoSampledPayload }));
    render(<TrackList trackInfo={spotifyResponse} />);
    expect(screen.getByTestId('tracklist_loading_skeleton')).toBeDefined();
  });

  it('renders samples data', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: whoSampledPayload }));
    await render(<TrackList trackInfo={spotifyResponse} />);
    expect(screen.getByText('Oasis')).toBeDefined();
  });
});
