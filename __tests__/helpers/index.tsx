import currentTrack0 from '../fixtures/api/spotify/current-track.0';
import searchResultSuccess1 from '../fixtures/api/spotify/search-result-success.1';
import searchResult0 from '../fixtures/api/whosampled/search/search-result.0';
import sampledInfo0 from '../fixtures/api/bedfellow-db-api/sample-info.0';
import imageSuccess0 from '../fixtures/api/whosampled/images/image-success.0';
import sampleMultiplePage0 from '../fixtures/api/whosampled/html/sample-multiple-page.0';

export const happyPathApiHandler = (url: string) => {
  if (url.includes('v1/me/player/currently-playing')) {
    return Promise.resolve({
      data: currentTrack0,
      status: 200,
    });
  } else if (url.includes('samples?artist_name=Kanye West&track_name=Bound 2')) {
    return Promise.resolve({
      data: sampledInfo0,
      status: 200,
    });
  } else if (
    url.includes('/v1/search?q=%2620track%3ABound%2520artist%3APonderosa%2BTwins+Plus+One&type=track&limit=50')
  ) {
    return Promise.resolve({
      data: searchResultSuccess1,
      status: 200,
    });
  } else {
    throw new Error(`MISSING IMPLEMENTATION FOR URL:: ${url}`);
  }
};

// This is used to trigger a reject first for the bedfellow api call in order to
// trigger the parsing and posting of a whosampled page
let shouldReject = true;
export const whoSampledParsingApiHandler = (url: string) => {
  if (url.includes('v1/me/player/currently-playing')) {
    return Promise.resolve({
      data: currentTrack0,
      status: 200,
    });
  } else if (url.includes('/ajax/search/?q=Kanye West Bound 2&_=')) {
    return Promise.resolve({
      data: searchResult0,
      status: 200,
    });
  } else if (url.includes('/api/samples?artist_name=Kanye West&track_name=Bound 2')) {
    if (shouldReject) {
      shouldReject = false;
      return Promise.reject(
        // @ts-ignore
        new Error({
          response: {
            status: 404,
          },
        })
      );
    }
    return Promise.resolve({
      data: sampledInfo0,
      status: 200,
    });
  } else if (
    url.includes('/v1/search?q=%2620track%3ABound%2520artist%3APonderosa%2BTwins+Plus+One&type=track&limit=50')
  ) {
    return Promise.resolve({
      data: searchResultSuccess1,
      status: 200,
    });
  } else if (url.includes('/static/images/media/track_images')) {
    return Promise.resolve({
      data: imageSuccess0,
      status: 200,
    });
  } else if (url.includes('/Kanye-West/Bound-2/samples')) {
    return Promise.resolve({
      data: sampleMultiplePage0,
      status: 200,
    });
  } else {
    throw new Error(`MISSING IMPLEMENTATION FOR URL:: ${url}`);
  }
};
