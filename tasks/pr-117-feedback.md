# PR #117 Feedback Tasks - refactor: auth context

## Critical Issues (Must Fix)

### 1.0 Fix invalid Authorization header with null token

**Source**: SpotifyAPI.service.ts line 15
**Comment**: "The function allows null tokens and uses an empty string as fallback for the Authorization header. This will result in 'Bearer ' being sent to the API, which is invalid."

- [ ] 1.1 Review buildSpotifyHeaders function
- [ ] 1.2 Add proper null token handling (throw error or require non-null)
- [ ] 1.3 Update all callers to handle the new behavior
- [ ] 1.4 Test API calls with invalid tokens

### 2.0 Fix stale token reference after refresh

**Source**: useSpotifyAPI.ts line 48
**Comment**: "After refreshing the token, the code still uses the old authState.token reference instead of getting the updated token from the refreshed auth state."

- [ ] 2.1 Investigate token refresh flow
- [ ] 2.2 Ensure refreshToken returns the new token
- [ ] 2.3 Use the returned token for retry requests
- [ ] 2.4 Test token refresh behavior

## Code Quality Improvements

### 3.0 Fix circular dependency in isAuthenticated calculation

**Source**: SpotifyAuthContext/index.tsx line 290
**Comment**: "The isAuthenticated calculation calls isTokenExpiring() which depends on authState.token, but this creates a circular dependency."

- [ ] 3.1 Review isAuthenticated logic
- [ ] 3.2 Implement suggested useMemo approach
- [ ] 3.3 Test for re-render issues
- [ ] 3.4 Verify authentication state updates correctly

### 4.0 Replace unreliable setTimeout with deterministic token handling

**Source**: useSpotifyAPI.ts line 54-60
**Comment**: "Using setTimeout(resolve, 0) to wait for context updates is unreliable and could lead to race conditions."

- [ ] 4.1 Review current refresh implementation
- [ ] 4.2 Modify refreshToken to return the new token
- [ ] 4.3 Use returned token directly in retry logic
- [ ] 4.4 Test concurrent refresh scenarios

## Summary

- **Total Comments**: 5 (including 2 review summaries)
- **Critical Issues**: 2
- **Code Quality**: 2
- **Enhancements**: 0

## Status

- Created: 2025-08-31
- PR State: OPEN
- Last Review: Copilot bot review at commit 9c2626c
