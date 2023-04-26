# Bedfellow

Inspired by: [bezola by RyanRau](https://github.com/RyanRau/bezola).

## Description

A small React Native app and Rust web service that shows you what songs were sampled for a given track and what samples that track uses.

## Setting Up

### Environment Variables (Mobile)

SPOTIFY_CLIENT_ID=""

SPOTIFY_REDIRECT_URI=""

SPOTIFY_TOKEN_REFRESH_URL=""

SPOTIFY_TOKEN_SWAP_URL=""


### Android Setup
The react-native-spotify-remote package uses an outdated gradle version, since gradle doesn't like aar bundling in newer versions (7+) we need to 
manually modify the react-native-spotify-remote gradle file.


~~~ gradle
repositories {
    mavenLocal()
    maven {
        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
        url "$rootDir/../node_modules/react-native/android"
    }
    google()
    mavenCentral()
    jcenter()
    // remove flat dirs object
    flatDirs {
        // refs to files in here
    }
    // end removal
}

dependencies {
    // remove both implementation blocks for the spotify dependencies
    // and replace them with these lines
    api project(':spotify-app-remote')
    api project(':spotify-app-auth')
    // end remove both implementations
    implementation "com.google.code.gson:gson:2.8.5"  // needed by spotify-app-remote
    //noinspection GradleDynamicVersion
    implementation "com.facebook.react:react-native:+"  // From node_modules
}
~~~
