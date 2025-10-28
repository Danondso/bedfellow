# PR Review Tasks: feat: generic auth foundation

**PR:** #128 - feat: generic auth foundation
**Branch:** refactor/multi-provider-foundation
**Generated:** 2025-10-28
**Review Source:** GitHub Copilot Pull Request Reviewer

## Summary

27 comments converted into actionable tasks across 3 priority levels

## Relevant Files

### Core Files

- `src/services/music-providers/adapters/spotifyAdapter.ts` - Spotify provider adapter
- `src/context/MusicProviderContext/index.tsx` - Multi-provider session management
- `src/hooks/usePlayer.ts` - Player hook with error handling
- `package.json` - Dependency version management
- `server/docker-compose.yml` - Docker configuration with environment variables
- `.env.dev` - Development environment variables

### iOS Files

- `ios/bedfellow/AppDelegate.swift` - Swift AppDelegate with OAuth flow management
- `ios/bedfellow/main.m` - App entry point
- `ios/bedfellow/bedfellow-Bridging-Header.h` - Swift-Objective-C bridging

### Test Files

- `__tests__/services/music-providers/spotifyAdapter.test.ts` - Spotify adapter tests

## Tasks

### Critical Issues (Must Fix)

- [ ] 1.0 Fix Spotify API search endpoint path inconsistency
  - [ ] 1.1 Update search endpoint in `spotifyAdapter.ts` to use `v1/search?q=...` prefix (line 142)
  - [ ] 1.2 Verify all Spotify API endpoints use consistent versioned paths
  - [ ] 1.3 Test search functionality after fix
  - **Files:** `src/services/music-providers/adapters/spotifyAdapter.ts`
  - **Original Comment:** Search endpoint missing v1 prefix for consistency

- [ ] 2.0 Fix session getter closure in MusicProviderContext
  - [ ] 2.1 Move adapter creation logic to ensure getter dynamically accesses current ref value
  - [ ] 2.2 Verify adapters see updated session data after `setSession` calls
  - [ ] 2.3 Add test to verify session updates propagate to adapters
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Adapter session getter closure references initial empty value

- [ ] 3.0 Remove hardcoded Spotify credentials from version control
  - [ ] 3.1 Update `server/docker-compose.yml` to use environment variable substitution
  - [ ] 3.2 Remove hardcoded SPOTIFY_CLIENT_ID from `.env.dev`
  - [ ] 3.3 Update documentation to explain required environment variables
  - [ ] 3.4 Add `.env.example` files with placeholder values
  - **Files:** `server/docker-compose.yml`, `.env.dev`
  - **Original Comment:** Sensitive credentials should not be committed to version control

- [ ] 4.0 Fix error propagation in session persistence queue
  - [ ] 4.1 Re-throw errors in catch block instead of swallowing them (line ~115)
  - [ ] 4.2 Update error handling to notify callers of persistence failures
  - [ ] 4.3 Add tests for persistence failure scenarios
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Errors caught but not propagated, masking persistence failures

- [ ] 5.0 Fix Swift AppDelegate entry point annotation
  - [ ] 5.1 Add `@UIApplicationMain` annotation to AppDelegate class
  - [ ] 5.2 Verify app launches correctly on iOS
  - [ ] 5.3 Test OAuth flow still works after change
  - **Files:** `ios/bedfellow/AppDelegate.swift`
  - **Original Comment:** AppDelegate should be marked with @UIApplicationMain

- [ ] 6.0 Fix main.m bridging header import
  - [ ] 6.1 Remove `#import "bedfellow-Swift.h"` from main.m
  - [ ] 6.2 Verify Swift bridging header handles imports automatically
  - [ ] 6.3 Test build succeeds after removal
  - **Files:** `ios/bedfellow/main.m`
  - **Original Comment:** Direct Swift header import may cause build issues

### Code Quality (Should Fix)

- [ ] 7.0 Improve HTTP status code checking in token refresh error handling
  - [ ] 7.1 Access status code directly from error object instead of string searching
  - [ ] 7.2 Create helper function `getErrorStatusCode(error: unknown): number | undefined`
  - [ ] 7.3 Update all error handling to use helper function
  - [ ] 7.4 Add tests for different error response types
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Searching for '401' or '400' in error messages is fragile

- [ ] 8.0 Extract auth error detection logic to helper function
  - [ ] 8.1 Create `isAuthError(error: unknown): boolean` helper
  - [ ] 8.2 Replace complex nested type checks with helper function
  - [ ] 8.3 Add unit tests for auth error detection
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Complex nested type checks should be extracted

- [ ] 9.0 Make usePlayer getData error handling consistent
  - [ ] 9.1 Decide on error strategy: return null for all failures OR throw errors for all
  - [ ] 9.2 Update getData implementation to be consistent
  - [ ] 9.3 Update all callers to handle the chosen pattern
  - [ ] 9.4 Document error handling strategy in code comments
  - **Files:** `src/hooks/usePlayer.ts`
  - **Original Comment:** Inconsistent error handling (null vs throw)

- [ ] 10.0 Add documentation for sessionsRef dual-state pattern
  - [ ] 10.1 Add comprehensive comment explaining state + ref usage
  - [ ] 10.2 Explain why synchronous access is needed for async operations
  - [ ] 10.3 Document stale closure avoidance pattern
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Critical implementation detail needs explanation

- [ ] 11.0 Add documentation to AppDelegate for OAuth flow management
  - [ ] 11.1 Add class-level documentation explaining RNAppAuthAuthorizationFlowManager conformance
  - [ ] 11.2 Document how authorization flow is managed
  - [ ] 11.3 Explain browser-based authentication handling
  - **Files:** `ios/bedfellow/AppDelegate.swift`
  - **Original Comment:** Class lacks documentation for OAuth integration

- [ ] 12.0 Improve logout adapter documentation
  - [ ] 12.1 Document what cleanup should happen on logout
  - [ ] 12.2 Clarify where local session data clearing is handled
  - [ ] 12.3 Add reference to session cleanup logic
  - **Files:** `src/services/music-providers/adapters/spotifyAdapter.ts`
  - **Original Comment:** Document cleanup expectations for logout

- [ ] 13.0 Add user feedback for persistent session persistence failures
  - [ ] 13.1 Create `storageError` state for persistence error messages
  - [ ] 13.2 Display user-friendly error when persistence fails
  - [ ] 13.3 Add retry mechanism or warning about logout on restart
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** Silent persistence failures could hide critical issues

- [ ] 14.0 Improve registry initialization lifecycle management
  - [ ] 14.1 Move initialized flag update to after successful initialization
  - [ ] 14.2 Implement proper cleanup for unmount during initialization
  - [ ] 14.3 Add error handling for initialization failures
  - **Files:** `src/services/music-providers/registry.ts`
  - **Original Comment:** Ref set before async initialization completes

### Enhancements (Nice to Have)

- [ ] 15.0 Remove unused spotifyPUTData import from test
  - [ ] 15.1 Remove import from `__tests__/services/music-providers/spotifyAdapter.test.ts`
  - [ ] 15.2 Verify tests still pass
  - **Files:** `__tests__/services/music-providers/spotifyAdapter.test.ts`
  - **Original Comment:** Unused import should be removed

- [ ] 16.0 Pin react-native-worklets to specific version
  - [ ] 16.1 Change `"react-native-worklets": "latest"` to `"^0.3.0"`
  - [ ] 16.2 Test app still builds and runs
  - [ ] 16.3 Update yarn.lock
  - **Files:** `package.json`
  - **Original Comment:** Using 'latest' causes unpredictable dependency resolution

- [ ] 17.0 Investigate package version downgrades
  - [ ] 17.1 Verify @react-navigation/stack downgrade from 7.4.7 to 7.4.2 is intentional
  - [ ] 17.2 Document reason for downgrade or restore to 7.4.7
  - [ ] 17.3 Check react-native-fs downgrade from 2.20.0 to 2.18.0
  - [ ] 17.4 Document compatibility requirements if downgrades are necessary
  - **Files:** `package.json`
  - **Original Comment:** Version downgrades should be intentional and documented

- [ ] 18.0 Extract complex type annotation to named type alias
  - [ ] 18.1 Create `ActiveRefreshPromisesMap` type alias
  - [ ] 18.2 Use named type for `activeRefreshPromisesRef`
  - [ ] 18.3 Improve code readability
  - **Files:** `src/context/MusicProviderContext/index.tsx`
  - **Original Comment:** [nitpick] Overly complex inline type annotation

- [ ] 19.0 Use specific MySQL version tag in docker-compose
  - [ ] 19.1 Change `mysql:8.0` to specific version like `mysql:8.0.40`
  - [ ] 19.2 Document why specific version is chosen
  - [ ] 19.3 Test database still works with pinned version
  - **Files:** `server/docker-compose.yml`
  - **Original Comment:** [nitpick] Major version tag allows breaking changes

- [ ] 20.0 Memoize or cache authorizeConfig function
  - [ ] 20.1 Compute authorization config once at module load time
  - [ ] 20.2 Or use memoization if function needs to remain callable
  - [ ] 20.3 Avoid repeated validation and string interpolation
  - **Files:** Spotify authorization configuration
  - **Original Comment:** authorizeConfig calls requireEnv on every invocation

- [ ] 21.0 Review database password placeholder in environment files
  - [ ] 21.1 Ensure 'xxxxx' is documented as development-only placeholder
  - [ ] 21.2 Add comment explaining it should not be used in production
  - [ ] 21.3 Consider using more obvious placeholder like 'DEV_PASSWORD_CHANGE_ME'
  - **Files:** Environment configuration files
  - **Original Comment:** Placeholder password committed to repository

- [ ] 22.0 Document AppDelegate Swift migration
  - [ ] 22.1 Add note in CHANGELOG or PR description about Objective-C to Swift migration
  - [ ] 22.2 Document any breaking changes or migration steps
  - [ ] 22.3 Update developer documentation if needed
  - **Files:** `ios/bedfellow/AppDelegate.swift`, `ios/bedfellow/main.m`
  - **Original Comment:** Significant architectural change should be documented

## Implementation Notes

### Priority Order

1. Start with **Critical Issues** (1.0-6.0) - these are blocking or security-related
2. Move to **Code Quality** (7.0-14.0) - important for maintainability
3. Finish with **Enhancements** (15.0-22.0) - cleanup and polish

### Testing Strategy

- Run `yarn test` after each group of fixes
- Test iOS build after iOS-related fixes (tasks 5.0, 6.0, 11.0)
- Test authentication flow after session-related fixes (2.0, 4.0, 10.0, 13.0)
- Test search functionality after API endpoint fix (1.0)

### Environment Variables

Several tasks (3.0, 21.0) relate to environment variable management. Consider:

- Creating comprehensive `.env.example` files
- Updating documentation with required variables
- Adding validation for required environment variables at startup

### iOS Build Changes

Tasks 5.0, 6.0, 11.0, and 22.0 all relate to iOS AppDelegate changes. These should be:

- Tested together as a group
- Verified on actual iOS device or simulator
- Documented in migration guide if needed

## Next Steps

1. Review this task list and adjust priorities if needed
2. Create a new branch for fixes: `fix/pr-128-feedback`
3. Work through tasks systematically
4. Commit fixes in logical groups
5. Push fixes and update PR #128
6. Request re-review from Copilot

## Related Files

- Original PR feedback processing guide: `ai-dev-tasks/pr-comments-to-tasks.md`
- Task processing workflow: `ai-dev-tasks/process-task-list.md`
