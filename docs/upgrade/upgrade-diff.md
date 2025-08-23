# React Native Upgrade Diff (0.73.9 to 0.81.0)

## Prerequisites Changes

- **Node.js**: Must upgrade to >= 20.19.4 (from >= 20)
- **Xcode**: Must upgrade to >= 16.1 for iOS builds
- **React**: Must upgrade to 19.1.0 (from 18.2.0)

## Major Breaking Changes

### 1. JavaScript API Changes

- **Deep imports deprecated**: No more imports from `react-native/Libraries/*`
- Must use root imports from `react-native` only
- ESLint and console warnings will be shown for violations

### 2. SafeAreaView Deprecation

- `<SafeAreaView>` component is deprecated
- Must migrate to `react-native-safe-area-context` library
- Required for Android 16 edge-to-edge display compliance

### 3. Android Platform Updates

- **Target SDK**: Android 16 (API level 36) by default
- **Edge-to-Edge Display**: Mandatory, no opt-out
- **Predictive Back Gesture**: Enabled by default
- Custom `onBackPressed()` overrides need migration

### 4. JavaScript Engine Changes

- JavaScriptCore (JSC) removed from core
- Must use community package if not using Hermes
- Hermes remains the default and recommended engine

### 5. Metro Configuration

- Now respects `resolveRequest` and `getModulesRunBeforeMainModule` options
- May need review if custom values were set

### 6. Legacy Architecture Frozen

- No new features or bug fixes for Legacy Architecture
- New Architecture is now the focus
- Warnings shown in DevTools for incompatible APIs

## Package.json Changes

### Core Dependencies

```json
{
  "react": "^19.1.0",
  "react-native": "0.81.0",
  "@types/react": "^19.1.0"
}
```

### Updated Dev Dependencies

- `eslint-plugin-react-hooks`: 4.6.0 → 5.2.0
- All `@react-native/*` packages updated to 0.81.0

### New Dependencies Required

- `react-native-safe-area-context` (to replace SafeAreaView)
- `@react-native-community/jsc` (if using JSC instead of Hermes)

## iOS Configuration Changes

### Podfile Updates

- Update iOS deployment target if needed
- Run `cd ios && pod install` after package updates

### AppDelegate Changes

- May need updates for React 19 compatibility
- Check for any deprecated API usage

## Android Configuration Changes

### android/gradle.properties

```properties
android.compileSdk=36
android.targetSdk=36
android.minSdk=21
```

### android/build.gradle

- Update Gradle version
- Update Android Gradle Plugin version
- Review buildToolsVersion

## TypeScript Configuration

- May need to update `@types/react` to ^19.1.0
- Review tsconfig.json for any deprecated options

## Migration Checklist

1. [ ] Update Node.js to >= 20.19.4
2. [ ] Update Xcode to >= 16.1
3. [ ] Update package.json dependencies
4. [ ] Run `yarn install`
5. [ ] Fix all deep imports (replace with root imports)
6. [ ] Replace SafeAreaView with react-native-safe-area-context
7. [ ] Update Metro configuration if needed
8. [ ] Update iOS configuration (Podfile, AppDelegate)
9. [ ] Update Android configuration (gradle files)
10. [ ] Run `cd ios && pod install`
11. [ ] Test on both platforms
12. [ ] Fix TypeScript errors
13. [ ] Fix ESLint violations (especially react-hooks rules)
14. [ ] Test edge-to-edge display on Android
15. [ ] Test back button handling on Android

## Known Issues to Watch For

1. **TypeScript**: React 19 types may cause new errors
2. **ESLint**: New react-hooks rules may flag existing code
3. **Android**: Edge-to-edge display may affect layouts
4. **iOS**: Swift/Objective-C compatibility with new RN version
5. **Metro**: Custom configurations may need adjustment

## Resources

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.73.9&to=0.81.0)
- [React Native 0.80 Blog Post](https://reactnative.dev/blog/2025/06/12/react-native-0.80)
- [React Native Changelog](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)
- [React Native Releases](https://github.com/facebook/react-native/releases)
