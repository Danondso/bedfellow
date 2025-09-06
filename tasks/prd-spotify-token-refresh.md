# Product Requirements Document: Automatic Spotify Token Refresh

## Introduction/Overview

This feature implements automatic, transparent token refresh for Spotify authentication throughout the Bedfellow application. Currently, tokens expire after 1 hour and users must manually re-authenticate. This implementation will automatically refresh tokens before expiration and retry failed requests due to expired tokens, ensuring uninterrupted music playback and discovery without user intervention. Users should only be redirected to login when refresh tokens are invalid or expired.

## Goals

1. Eliminate manual re-authentication for users with valid refresh tokens
2. Provide seamless, uninterrupted Spotify API access during active sessions
3. Automatically recover from 401 errors by refreshing tokens and retrying requests
4. Proactively refresh tokens before expiration during active usage
5. Maintain secure token storage and handling practices
6. Redirect to login only when automatic refresh is impossible

## User Stories

1. As a user, I want to use the app continuously without re-logging in every hour
2. As a user actively discovering samples, I want uninterrupted playback control so my music experience isn't disrupted
3. As a user returning to the app, I want automatic re-authentication if my refresh token is still valid
4. As a developer, I want centralized token management so I don't handle auth in every API call
5. As a user, I want to be redirected to login only when absolutely necessary (refresh token expired/invalid)

## Functional Requirements

### Core Token Management

1. **Axios Interceptor Setup**: Implement request/response interceptors for all Spotify API calls
2. **Proactive Token Refresh**: Check token expiration before each API request and refresh if expiring within 5 minutes
3. **Reactive Token Refresh**: On 401 errors, automatically refresh token and retry the original request once
4. **Token Storage Update**: Update stored tokens immediately after successful refresh
5. **Refresh Token Validation**: Track refresh token validity and expiration (typically 1 year for Spotify)

### Request Handling

6. **Request Queue Management**: Queue requests during token refresh to prevent multiple simultaneous refresh attempts
7. **Retry Logic**: Retry failed requests exactly once after token refresh
8. **Error Propagation**: If retry fails, propagate error to calling code for appropriate handling
9. **Loading State Preservation**: Maintain loading states during automatic token refresh

### Navigation & UI

10. **Login Redirect**: Navigate to login screen only when:
    - Refresh token is missing
    - Refresh token request returns 400/401
    - Maximum retry attempts exceeded
11. **Silent Refresh**: No UI indication during successful automatic refresh
12. **Error States**: Show appropriate error messages for non-auth related failures

### Context Improvements

13. **Rename Function**: Change `resetToken` to `refreshToken` for clarity
14. **Add Token Expiry Check**: Add `isTokenExpiring()` helper (returns true if expires in < 5 minutes)
15. **Add Force Refresh**: Add `forceTokenRefresh()` method for manual refresh if needed
16. **Track Refresh State**: Add `isRefreshing` flag to prevent duplicate refresh attempts

### Implementation Details

17. **Centralized Auth Logic**: All token refresh logic in SpotifyAuthContext
18. **Service Layer Integration**: Update SpotifyAPI.service.ts to use interceptors
19. **Hook Updates**: Ensure useSpotifyAPI hook handles auth errors gracefully
20. **Timestamp Tracking**: Store token receipt time to calculate accurate expiration

## Non-Goals (Out of Scope)

1. Spotify session expiration handling (separate from token expiration)
2. Multiple account support
3. Offline token caching beyond current AsyncStorage
4. Token refresh for other services (WhoSampled, BedfellowDB)
5. Biometric authentication for token refresh
6. Token encryption in storage
7. Background token refresh when app is not active
8. Refresh token rotation (Spotify doesn't support this)
9. Custom authentication flow outside Spotify OAuth
10. Token sharing between devices

## Technical Considerations

### Architecture Changes

```typescript
// Axios Interceptor Structure
axios.interceptors.request.use(async (config) => {
  // Check token expiration
  // Refresh if needed
  // Update Authorization header
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401, refresh and retry
    // If refresh fails, redirect to login
  }
);
```

### State Management

- Use a singleton pattern for token refresh to prevent race conditions
- Implement mutex/semaphore for concurrent request handling
- Store refresh promise to await if refresh is in progress

### Error Boundaries

- Implement error boundary to catch unhandled auth failures
- Graceful degradation for non-critical features during auth issues

### Testing Considerations

- Mock expired tokens for testing
- Test concurrent request handling
- Verify queue management during refresh
- Test network failure scenarios

## Success Metrics

1. **Zero Manual Re-authentications**: Users with valid refresh tokens never see login screen
2. **Request Success Rate**: >99% of API requests succeed (including retry)
3. **Refresh Performance**: Token refresh completes in <2 seconds
4. **User Session Length**: Increased average session duration
5. **Error Rate Reduction**: 90% reduction in auth-related error reports
6. **Seamless Experience**: No user-reported interruptions during music playback

## Implementation Plan

### Phase 1: Core Infrastructure

1. Create axios instance with interceptors
2. Implement token expiration checking
3. Add refresh logic to auth context
4. Update token storage mechanism

### Phase 2: Service Integration

1. Update SpotifyAPI.service.ts to use axios instance
2. Modify all API calls to use centralized client
3. Update hooks to handle new error states
4. Test with expired tokens

### Phase 3: UI & Navigation

1. Implement login redirect logic
2. Add loading state preservation
3. Update error messages
4. Test edge cases

### Phase 4: Optimization

1. Implement request queuing
2. Add performance monitoring
3. Optimize token check frequency
4. Add analytics tracking

## Edge Cases to Handle

1. **Simultaneous Requests**: Multiple API calls while token is refreshing
2. **Network Failure**: Refresh attempt fails due to network issues
3. **Invalid Refresh Token**: Refresh token revoked by user or Spotify
4. **App Background/Foreground**: Token expires while app is backgrounded
5. **Clock Skew**: Device time differs from server time
6. **Storage Failure**: AsyncStorage read/write failures
7. **Rapid Token Expiry**: Token expires immediately after refresh (server issue)
8. **Circular Refresh**: Refresh endpoint returns 401 (configuration error)

## Security Considerations

1. Never log tokens in production
2. Clear tokens on logout
3. Validate token format before storage
4. Handle token in memory, minimize persistence
5. Clear tokens on app uninstall (iOS/Android default)

## Open Questions

1. Should we implement token pre-warming on app foreground?
2. How long should we wait before considering a refresh request failed?
3. Should we track refresh token expiration date (1 year) proactively?
4. Do we need exponential backoff for failed refresh attempts?
5. Should we show a subtle indicator when token is being refreshed?
6. How do we handle token refresh during active music playback?
7. Should we implement a maximum session length for security?
8. Do we need to handle token refresh differently for background playback?
