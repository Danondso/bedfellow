# GitHub Workflow Documentation

This directory contains guides and scripts for PR review and feedback processing workflows.

## Overview

The Bedfellow project uses a structured approach to PR reviews that ensures high-quality, expert-level feedback by creating technology-specific context documents before reviewing code.

## Documents

### [PR_CONTEXT_RESEARCH_GUIDE.md](PR_CONTEXT_RESEARCH_GUIDE.md)

**Purpose**: Instructions for creating comprehensive, PR-specific context documents

**When to use**: Before reviewing any PR (required step)

**Output**: `tasks/pr-[NUM]-context.md` file with:

- Technology stack detection
- Best practices research from official docs
- Anti-pattern identification
- Project-specific patterns
- Review criteria checklist

**Time investment**: 15-30 minutes (creates reusable context)

### [PR_REVIEW_GUIDE.md](PR_REVIEW_GUIDE.md)

**Purpose**: Commands and instructions for conducting PR reviews

**When to use**: When reviewing pull requests

**Prerequisites**: Must have context document created first (see above)

**Includes**:

- GitHub CLI commands for PR analysis
- Review checklist (testing, anti-patterns, refactoring)
- Issue severity categories
- Review output format template
- Technology-specific guidelines

### [PR_FEEDBACK_PROCESSING_GUIDE.md](PR_FEEDBACK_PROCESSING_GUIDE.md)

**Purpose**: Instructions for converting PR review feedback into actionable tasks

**When to use**: After receiving PR review comments

**Output**: Task lists for addressing feedback

## Scripts

### [scripts/check-pr-context.sh](scripts/check-pr-context.sh)

**Purpose**: Check if PR context document exists

**Usage**:

```bash
# Auto-detect from current branch
./.github/scripts/check-pr-context.sh

# Specify PR number
./.github/scripts/check-pr-context.sh 128
```

**Output**:

- ✅ Confirms context exists and shows summary
- ⚠️ Warns if missing and provides guidance
- 🔬 Quick technology detection for the PR

## Workflow

### Complete PR Review Workflow

```
1. Create Context Document
   ├── Run: ./.github/scripts/check-pr-context.sh
   ├── Follow: PR_CONTEXT_RESEARCH_GUIDE.md
   └── Output: tasks/pr-[NUM]-context.md

2. Conduct Review
   ├── Follow: PR_REVIEW_GUIDE.md
   ├── Reference: tasks/pr-[NUM]-context.md
   └── Output: tasks/pr-[NUM]-review.md

3. Process Feedback
   ├── Follow: PR_FEEDBACK_PROCESSING_GUIDE.md
   ├── Input: PR review comments
   └── Output: tasks/pr-[NUM]-feedback-tasks.md
```

## Quick Start

To review a PR:

```bash
# Step 1: Check for context document
./.github/scripts/check-pr-context.sh

# Step 2: If missing, create context (use Claude Code)
# Follow: .github/PR_CONTEXT_RESEARCH_GUIDE.md
# Create: tasks/pr-[NUM]-context.md

# Step 3: Verify context created
./.github/scripts/check-pr-context.sh

# Step 4: Conduct review
# Follow: .github/PR_REVIEW_GUIDE.md
# Reference: tasks/pr-[NUM]-context.md
```

## Philosophy

### Why Context Documents?

Traditional PR reviews often lack depth because reviewers:

- May not be experts in all technologies used
- Don't have time to research best practices on the spot
- Rely on intuition rather than authoritative sources
- Miss framework-specific anti-patterns

**Solution**: Create a comprehensive context document that:

1. Identifies all technologies in the PR
2. Researches official documentation and best practices
3. Documents common anti-patterns for each technology
4. Provides version-specific guidance
5. Creates actionable review criteria

This ensures reviews are:

- **Authoritative**: Based on official docs, not opinions
- **Comprehensive**: Covers all relevant technologies
- **Consistent**: Same standards applied across reviews
- **Educational**: Reviewers learn while reviewing
- **Reusable**: Context documents inform future reviews

### Context Document Structure

```markdown
# PR #XXX Review Context

## Executive Summary

[What this PR changes]

## Technologies In Scope

[List with versions]

## Best Practices Research

### [Technology A]

- Official docs
- Key practices
- Anti-patterns
- Version considerations

### [Technology B]

...

## Project-Specific Context

[From CLAUDE.md]

## Review Criteria Checklist

[Actionable checklist derived from research]

## References

[All sources consulted]

## Previous Context Documents

[Links to related contexts]
```

## Example: PR #128

For PR #128 (Consolidate auth into MusicProviderContext):

```bash
# 1. Check context
$ ./.github/scripts/check-pr-context.sh 128

🔬 Quick technology detection for PR #128:
  ✅ React/React Native (.tsx files)
  ⬜ Rust (.rs files)
  ✅ Native (iOS/Android)
  ✅ Tests
  ✅ Docker

# 2. Create tasks/pr-128-context.md with:
- React 19.1 best practices (hooks, context, effects)
- React Native 0.82 patterns
- TypeScript type safety guidelines
- Testing recommendations

# 3. Conduct review using context
# Reference context when finding issues:
"Per React 19.1 best practices (see pr-128-context.md#hooks),
 useEffect dependencies must be exhaustive..."
```

## Tips

1. **Reuse Context**: If reviewing similar PRs, reference previous context documents
2. **Update Context**: When tech versions change, create updated context docs
3. **Link Everything**: Always link to official documentation sources
4. **Be Specific**: Include file paths, line numbers, and code examples
5. **Explain Why**: Reference context document to explain reasoning
6. **Stay Current**: Check for latest best practices and version-specific changes

## Contributing

When updating these guides:

- Keep examples practical and project-specific
- Link to official documentation
- Include version numbers for all technologies
- Update scripts when adding new file patterns
- Test all bash scripts before committing

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project instructions for Claude Code
- [CLAUDE.local.md](../CLAUDE.local.md) - User-specific project instructions
- [tasks/](../tasks/) - Directory containing all PR context and review documents
