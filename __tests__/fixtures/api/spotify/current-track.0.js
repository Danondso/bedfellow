export default {
  timestamp: 0,
  device: {
    id: null,
    is_active: false,
    is_restricted: false,
    name: '',
    type: '',
    volume_percent: null,
  },
  actions: {
    disallows: {},
  },
  progress_ms: null,
  is_playing: false,
  item: {
    href: '',
    preview_url: '',
    track_number: 1,
    type: 'track',
    uri: 'fuck off spotify',
    id: '1234',
    name: 'Bound 2',
    album: {
      album_type: 'album',
      artists: [
        {
          name: 'Kanye West',
          id: '123',
          type: 'artist',
          href: '123',
          external_urls: {
            spotify: '',
          },
          uri: '123',
        },
      ],
      id: '',
      images: [
        {
          url: 'https://localhost/image/url',
        },
      ],
      name: 'Yeezus',
      release_date: '',
      release_date_precision: 'year',
      type: 'album',
      total_tracks: 0,
      href: '',
      external_urls: {
        spotify: '',
      },
      uri: '',
    },
    external_ids: {},
    popularity: 5,
    artists: [
      {
        name: 'Kanye West',
        id: '',
        type: 'artist',
        href: '',
        external_urls: {
          spotify: '',
        },
        uri: '',
      },
    ],
    duration_ms: 5666,
    disc_number: 1,
    explicit: true,
    external_urls: {
      spotify: '',
    },
  },
  context: null,
  currently_playing_type: 'track',
  shuffle_state: false,
  repeat_state: 'track',
};
