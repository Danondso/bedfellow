# bedfellow-api

This this is a server layer that handles auth and data fetching for the bedfellow mobile app.

## Getting Started

This guide is predicated on:

- Setting up a [spotify dev account](https://developer.spotify.com/)
- (Recommended if you're using VSCode) [Setting up a rust env](https://code.visualstudio.com/docs/languages/rust)

---

1. Export the following env variables with values from your spotify dev account and last.fm:

```zsh
export SPOTIFY_CLIENT_ID=''
export SPOTIFY_CLIENT_SECRET=''
export SPOTIFY_CLIENT_CALLBACK=''
export LASTFM_API_KEY=''
export LASTFM_API_SECRET=''
export ENCRYPTION_SECRET=''
export RUST_LOG=info # debug, error, warn, trace
# export HOST_IP='' # optional, localhost is the default. Used by docker to open up server in container
```

2. run `cargo build`
3. run `cargo watch` - this starts the server and watches for changes

## Using the API

TODO: fill this out with example payloads or better yet, an open api spec
