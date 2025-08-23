# React Native Upgrade Baseline

Generated: 2025-08-22

## Current React Native Version

- **React Native**: 0.73.9
- **React**: 18.2.0

## Target React Native Version

- **React Native**: 0.81.0 (latest stable)
- **React**: 19.1.0 (required by RN 0.81.0)
- **Note**: React Native does not use LTS model, 0.81.0 is the latest stable version

## Core Dependencies

### Navigation

- @react-navigation/native: ^6.1.9
- @react-navigation/native-stack: ^6.10.1
- react-native-screens: ^3.27.0
- react-native-safe-area-context: 4.10.8

### UI Components

- react-native-paper: ^5.11.3
- react-native-vector-icons: ^10.1.0
- react-native-linear-gradient: ^2.8.3
- react-native-svg: ^15.4.0
- react-content-loader: ^7.0.2
- react-native-skeleton-placeholder: ^5.2.4

### Authentication & Config

- react-native-app-auth: ^7.1.0
- react-native-config: 1.5.1
- react-native-dotenv: ^3.4.9 (dev)

### Storage & File System

- @react-native-async-storage/async-storage: ^1.24.0
- react-native-fs: ^2.20.0

### Utilities

- axios: ^1.7.4
- cheerio: ^1.0.0-rc.12
- fast-fuzzy: ^1.12.0
- react-native-image-colors: 1.2.2

### Platform Specific

- lottie-ios: 4.4.1
- react-native-lottie-splash-screen: ^1.1.2

## Development Dependencies

### Build & Bundling

- @react-native/metro-config: ^0.72.11 (also in devDependencies as 0.73.1)
- @react-native/babel-preset: 0.73.1
- metro-react-native-babel-preset: 0.76.8
- @babel/core: ^7.20.0
- @babel/preset-env: ^7.20.0
- @babel/runtime: ^7.20.0

### TypeScript

- typescript: 5.0.4
- @types/react: ^18.2.6
- @types/react-native-dotenv: ^0.2.2
- @types/react-native-vector-icons: ^6.4.18
- @types/react-test-renderer: ^18.0.0
- @tsconfig/react-native: ^3.0.0
- @react-native/typescript-config: 0.73.1

### Testing

- jest: ^29.6.3
- babel-jest: ^29.6.3
- @testing-library/react-native: ^12.5.1
- @testing-library/jest-native: ^5.4.3
- react-test-renderer: 18.2.0

### Linting & Formatting

- eslint: ^8.19.0
- @react-native-community/eslint-config: ^3.2.0
- @react-native/eslint-config: 0.73.1
- eslint-config-airbnb: ^19.0.4
- eslint-config-prettier: ^9.1.0
- eslint-plugin-import: ^2.29.0
- eslint-plugin-jsx-a11y: ^6.8.0
- eslint-plugin-prettier: ^5.1.3
- eslint-plugin-react: ^7.33.2
- eslint-plugin-react-hooks: ^4.6.0
- prettier: ^3.3.2
- lint-staged: ^16.1.5

### Developer Tools

- reactotron-react-native: ^5.1.7

## Package Manager & Node

- Node: >=20
- Yarn: 3.6.4

## Custom Resolutions

- react-native-image-colors@1.2.2: Patched version

## Known Issues Before Upgrade

- Multiple versions of @react-native/metro-config (^0.72.11 in dependencies, 0.73.1 in devDependencies)
- metro-react-native-babel-preset version (0.76.8) is ahead of React Native version (0.73.9)

## iOS Configuration

- Platform: iOS (min_ios_version_supported from Podfile)
- CocoaPods: Used for iOS dependency management

## Test Suite Status

**Run Date**: 2025-08-22
**Command**: `yarn test`
**Overall Results**:

- Test Suites: 4 failed, 6 passed, 10 total
- Tests: 30 failed, 111 passed, 141 total
- Time: 2.238s

### Passing Test Suites

1. `__tests__/services/bedfellow-db-api/BedfellowDBAPI.service.test.ts` - ✅ PASS
2. `__tests__/services/spotify/SpotifyAPI.service.test.ts` - ✅ PASS
3. Other 4 test suites passed (not listed in output)

### Failing Test Suites

1. `src/services/theme/__tests__/ThemeService.test.ts` - ❌ FAIL
   - saveThemePreferences tests failing (returns undefined instead of true)
   - clearThemePreferences tests failing (returns undefined instead of true)
   - Theme history limit test failing (21 items instead of 20)
   - getMostUsedTheme returning "undefined" instead of "dark"

2. `src/context/ThemeContext/__tests__/ThemeContext.test.tsx` - ❌ FAIL
   - Multiple ThemeProvider tests failing
   - Theme mode switching tests failing
   - Dynamic theme tests failing
   - Theme persistence tests failing

3. `__tests__/screens/CurrentTrack.test.tsx` - ❌ FAIL
   - Skeleton loading tests failing
   - Component rendering issues

4. `__tests__/App.test.tsx` - ❌ FAIL
   - Unable to find text "Nothing playing currently."
   - Component tree rendering issues

### Key Issues Identified

- Theme-related functionality has significant test failures
- AsyncStorage mocking issues in tests
- Component rendering issues in screen tests
- Total of 30 test failures that need addressing

## TypeScript Compilation Status

**Run Date**: 2025-08-22
**Command**: `yarn tsc`
**Overall Results**: Multiple TypeScript errors found

### Error Categories

#### 1. Reactotron Dependencies (10 errors)

- **File**: `ReactotronConfig.js`
- **Issue**: Cannot find module '@types/ws' (TS7016)
- **Details**: Reactotron packages missing TypeScript definitions
  - reactotron-react-native
  - @types/ws

#### 2. Theme System Type Issues (26 errors)

- **Files**: Multiple theme-related files
- **Common Issues**:
  - `createStyles.ts`: Object literal may only specify known properties (TS2353)
  - Settings styles: 'fontWeight' property type mismatches
  - Icon components: JSX element type incompatibility (TS2786)

#### 3. Component Type Errors

- **ThemedButton.tsx**:
  - Incorrect ref type for TouchableOpacity (TS2322)
  - Expected `React.RefObject<TouchableOpacity>`, got `React.Ref<View>`
- **ThemeSwitcher.tsx**:
  - Icon component JSX element type issues (TS2786)
- **Settings Screen**:
  - Multiple typography fontWeight property type mismatches (TS2322)
  - Lines 26, 40, 80, 102, 213

#### 4. Style System Issues

- **createStyles.ts** (lines 37, 53, 69):
  - Additional properties not allowed in StyleSheet object literals

### Total Error Count

- **Approximate**: 36+ TypeScript errors
- **Most Critical**: Missing type definitions and theme system type mismatches
- **Impact**: Will need resolution before successful build

## Linting Status

**Run Date**: 2025-08-22
**Command**: `yarn lint`
**Overall Results**: 34 problems (23 errors, 11 warnings)

### Error Breakdown by Category

#### 1. Unused Variables (13 errors)

- ThemeInitializer.tsx: `initialPreferences`, `error`, `migrationResult`
- ThemeTransition.tsx: `backgroundColor`, `isLight`
- ThemeContext.test.tsx: `act`
- dynamicTheme.tsx: `updatePalette`, `theme`
- ThemeService.ts: `now`
- colorExtraction.ts: `brandColorScales`
- semanticColors.ts: `SEMANTIC_BRAND_COLORS`
- accessibility.test.ts: `darkSemanticBrandColors`, `WCAG_AAA_LARGE`
- dark.test.ts: `darkSemanticBrandColors`, `allColors`, `allSpacing`, `allTypography`
- colorGenerator.test.ts: `ColorScale`, `scaleDramatic`

#### 2. React Hooks Dependencies (11 warnings)

- Multiple missing dependencies in useEffect hooks
- Files affected: ThemeEventManager, ThemeInitializer, ThemeTransition, ThemeContext.test, systemTheme, useThemeMode

#### 3. Code Quality Issues

- colorExtraction.ts: Too many classes (6, max allowed 5)
- gradients.ts: Default parameters should be last (2 errors)
- ThemeTransition.tsx: Do not use Array index in keys
- ThemeInitializer.tsx: Value of 'error' may be overwritten in IE 8

### Files with Most Issues

1. ThemeContext test files: 9 issues
2. Theme utility files: 8 issues
3. ThemeContext implementation: 7 issues
4. Theme services: 3 issues

### Priority Fixes

- Remove unused variables (quick wins)
- Fix React Hook dependency arrays (prevents potential bugs)
- Refactor class structure in colorExtraction.ts
- Fix parameter ordering in gradients.ts
