#!/bin/bash

# Clean and Rebuild Script for Bedfellow React Native Project
echo "🧹 Starting complete environment cleanup and rebuild..."

# Navigate to project root
cd "$(dirname "$0")"

echo "📦 Step 1: Cleaning node_modules and yarn cache..."
rm -rf node_modules
rm -rf .yarn/cache
rm -rf .yarn/install-state.gz
rm -f yarn.lock

echo "🍎 Step 2: Cleaning iOS build artifacts..."
cd ios
rm -rf Pods
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -f Podfile.lock
cd ..

echo "🤖 Step 3: Cleaning Android build artifacts..."
cd android
./gradlew clean 2>/dev/null || echo "Gradle clean skipped"
rm -rf .gradle
rm -rf app/build
cd ..

echo "🚀 Step 4: Cleaning Metro bundler cache..."
rm -rf .metro-health-check-cache
npx react-native start --reset-cache &
METRO_PID=$!
sleep 3
kill $METRO_PID 2>/dev/null

echo "📥 Step 5: Installing fresh dependencies..."
yarn install

echo "🍎 Step 6: Installing iOS pods..."
cd ios
pod install --repo-update
cd ..

echo "✅ Complete! Environment has been nuked and rebuilt."
echo "📱 Starting Metro bundler..."
yarn start