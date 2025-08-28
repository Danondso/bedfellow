<div align="center">
  <img src="assets/images/bedfellow-appIcon.png" alt="Bedfellow Logo" style="border-radius: 16px" width="120" height="120">
  
  # Bedfellow 🎵
  
  A React Native music discovery app that reveals the samples behind your favorite tracks. Seamlessly integrated with Spotify, Bedfellow enriches your listening experience by showing the musical DNA of what you're playing.
</div>

Inspired by: [bezola by RyanRau](https://github.com/RyanRau/bezola).

## Features

- 🎧 **Spotify Integration** - Authenticates with your Spotify account to access currently playing tracks
- 🔍 **Sample Discovery** - Automatically finds and displays samples used in tracks via WhoSampled data
- 🎨 **Dynamic Theming** - UI colors adapt based on album artwork for an immersive experience
- ➕ **Queue Management** - Add discovered samples directly to your Spotify queue with one tap
- 💾 **Smart Caching** - Stores sample data locally to reduce API calls and improve performance
- 📱 **Cross-Platform** - Runs on both iOS and Android devices

## Tech Stack

### Mobile App

- **React Native 0.73.9** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation** - Native stack navigation
- **React Context** - State management
- **Jest** - Testing framework

### Backend Services

- **Rust** - High-performance backend services
- **Actix Web** - Web framework for Rust
- **MySQL** - Database for sample data
- **Docker** - Containerization for easy deployment
- **SQLx** - Async SQL toolkit for Rust

## Prerequisites

- Node.js (v20+)
- Yarn package manager
- Xcode (for iOS development)
- Android Studio (for Android development)
- Docker & Docker Compose
- Rust toolchain (for backend development)
- [Spotify Developer Account](https://developer.spotify.com)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bedfellow.git
cd bedfellow
```

### 2. Install Dependencies

```bash
yarn install
cd ios && pod install && cd ..  # iOS only
```

### 3. Configure Environment

Create a `.env` file in the project root:

```.env
# Development URLs (change for production)
BEDFELLOW_API_BASE_URL='http://localhost:8085'
BEDFELLOW_DB_API_BASE_URL='http://localhost:8000/api'

# Spotify OAuth Configuration
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_REDIRECT_URI_ANDROID=com.bedfellow://callback/
SPOTIFY_REDIRECT_URI=org.danondso.bedfellow://callback/
```

### 4. Set Up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com)
2. Create a new app
3. Add the redirect URIs from your `.env` file
4. Copy the Client ID to your `.env` file

### 5. Start Backend Services

```bash
yarn server-start
```

This will start both the OAuth handler and database API via Docker.

### 6. Run the App

```bash
# iOS
yarn ios-dev

# Android
yarn android-dev
```

## Platform-Specific Notes

### iOS

- Recommended to run builds through Xcode for development
- Ensure you have the latest Xcode and iOS SDKs installed
- Run `cd ios && pod install` after adding new native dependencies

### Android

- Requires HTTPS endpoints for external services
- Use a tunneling service like [tunnelto.dev](https://tunnelto.dev) for local development
- Ensure Android Studio and required SDKs are properly configured

## Backend Development

### Environment Setup

Add these to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
export SPOTIFY_CLIENT_ID="your_spotify_client_id"
export SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
export SPOTIFY_CLIENT_CALLBACK_IOS=org.danondso.bedfellow://callback/
export SPOTIFY_CLIENT_CALLBACK_ANDROID=com.bedfellow://callback/
export DATABASE_URL="mysql://root:password@localhost:3306/bedfellow"
```

Then reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### Running Services Individually

```bash
# OAuth Service
cd server/bedfellow-api
cargo build && cargo run

# Database API
cd server/bedfellow-db-api
cargo build && cargo run
```

### Docker Compose Setup

The `server/docker-compose.yml` file orchestrates all backend services:

- MySQL database on port 3306
- Database API on port 8000
- OAuth service on port 8085

## Available Scripts

### Mobile App

- `yarn ios-dev` - Run iOS app in development mode
- `yarn android-dev` - Run Android app in development mode
- `yarn ios-build-prod` - Build iOS app for production
- `yarn android-build-prod` - Build Android app for production
- `yarn test` - Run test suite
- `yarn lint` - Run ESLint
- `yarn tsc` - Run TypeScript compiler check
- `yarn pods` - Install iOS CocoaPods dependencies

### Backend

- `yarn server-start` - Start all backend services via Docker
- `cargo test` - Run Rust tests (in server directories)
- `cargo build --release` - Build production binaries

## Project Structure

```
bedfellow/
├── src/                    # React Native application source
│   ├── screens/           # App screens (Login, CurrentTrack)
│   ├── services/          # API service layers
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript definitions
├── server/                # Backend services
│   ├── bedfellow-api/     # Spotify OAuth handler
│   └── bedfellow-db-api/  # Database REST API
├── ios/                   # iOS-specific code
├── android/               # Android-specific code
└── __tests__/            # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**App won't connect to backend**

- Ensure Docker containers are running: `docker ps`
- Check that ports 8000 and 8085 are not in use
- For Android, ensure you're using HTTPS URLs or proper tunneling

**Spotify authentication fails**

- Verify your Client ID and redirect URIs match in Spotify Dashboard
- Check that redirect URIs are properly configured in `.env`
- Ensure backend services are running

**Build errors on iOS**

- Run `cd ios && pod install`
- Clean build folder in Xcode (Cmd+Shift+K)
- Delete `ios/build` folder and rebuild

**Build errors on Android**

- Clean and rebuild: `cd android && ./gradlew clean`
- Check Android Studio SDK Manager for required SDKs
- Ensure `android/local.properties` points to correct SDK path

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [bezola](https://github.com/RyanRau/bezola) by RyanRau
- Sample data sourced from WhoSampled
- Built with the Spotify Web API
