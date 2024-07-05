# Bedfellow

Inspired by: [bezola by RyanRau](https://github.com/RyanRau/bezola).

## Description

A small React Native app and Rust web service that displays samples used for a given track.

## Mobile - Setting Up

First, create a .env file in `bedfellow/` and add these values to it.

```.env
SPOTIFY_CLIENT_ID="your app's client id"
SPOTIFY_REDIRECT_URI_ANDROID=com.bedfellow://callback/
SPOTIFY_REDIRECT_URI=org.danondso.bedfellow://callback/
```

You need to make a [spotify developer account](https://developer.spotify.com) and create an app. This will get you the CLIENT_ID. For the redirectUri's, use the REDIRECT_URI values above.

You'll need to setup the bedfellow-api server and make that externally available to your application (**server setup is mandatory**) for handling application auth. Once your .env is all filled out. Run `yarn start` to run metro and you're set!

## Server - Setting Up

You will need to install [rust](https://www.rust-lang.org/tools/install) for this.

For the server setup, open up your terminal's profile file (.bashrc, .zshrc, etc) and export the following variables. You should have the client id and secret on hand

```zshrc
export SPOTIFY_CLIENT_ID="your app's client id"
export SPOTIFY_CLIENT_SECRET="your app's client secret"
export SPOTIFY_CLIENT_CALLBACK_IOS=org.danondso.bedfellow://callback/
export SPOTIFY_CLIENT_CALLBACK_ANDROID=com.bedfellow://callback/
# export HOST_IP="" # Optional, used by docker to make service accessible from container.
```

Save those and run `source <your_file_name>`.

With your environment setup, run `cd /server/bedfellow-api` and then run `cargo build && cargo run`.

How you externalize the server is up to you, I've been using [tunnelto](https://tunnelto.dev) to externalize it locally for testing.
