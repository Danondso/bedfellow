# PR #120 Feedback Tasks

**PR Title:** tech: bedfellow hook  
**URL:** https://github.com/Danondso/bedfellow/pull/120  
**Status:** OPEN

## Summary

Copilot reviewed the PR that refactors sample data fetching logic into a reusable custom hook pattern. The main feedback focuses on TypeScript type safety improvements.

## Code Quality Issues

### 1. Fix TypeScript `any` types in error handling

**Priority:** Quality (Should Fix)  
**Location:** Multiple files  
**Comments:** 3 similar issues found

- [ ] 1.0 Replace `any` type with proper error types
  - [ ] 1.1 Fix error type in `useSubmitSamples.ts` line 35
  - [ ] 1.2 Fix error type in `useSubmitSamples.ts` line 51
  - [ ] 1.3 Fix error type in `useGetSamples.ts` line 57
  - [ ] 1.4 Update error state type declarations
  - [ ] 1.5 Test error handling still works correctly

## Implementation Plan

### Task 1: Fix TypeScript Types

The main issue is using `any` type for error handling in the hooks. This should be replaced with:

- Use `Error | null` for error state
- Use `unknown` in catch blocks, then properly type guard

**Files to modify:**

- `src/hooks/bedfellow/useSubmitSamples.ts`
- `src/hooks/bedfellow/useGetSamples.ts`

## Notes

- All comments are from Copilot's automated review
- No critical/blocking issues found
- Focus is on improving TypeScript type safety
