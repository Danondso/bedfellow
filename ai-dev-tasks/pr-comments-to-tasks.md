# Rule: Generating Tasks from PR Comments

## Goal

To create a detailed task list from PR review comments, converting feedback into actionable development tasks that can be tracked and implemented systematically.

## Process

1. **Fetch PR Information:** Identify the current branch and its associated PR
2. **Retrieve Comments:** Pull all review comments, including:
   - General PR comments
   - Line-specific code review comments
   - Review summary comments
3. **Categorize Comments:** Group comments by:
   - Type (bug fix, enhancement, refactor, documentation)
   - Priority (must-fix, should-fix, nice-to-have)
   - File/component affected
4. **Generate Tasks:** Convert each actionable comment into a task with sub-tasks
5. **Create Task List:** Output in standard markdown format

## Comment Categories

### Must-Fix (Blocking)

- Security issues
- Critical bugs
- Breaking changes
- Failed tests
- Accessibility violations

### Should-Fix (Important)

- Performance improvements
- Code quality issues
- Missing error handling
- Incomplete implementations
- Style/linting violations

### Nice-to-Have (Enhancements)

- Refactoring suggestions
- Documentation improvements
- Additional test coverage
- Code organization

## Output Format

```markdown
# PR Review Tasks: [PR Title]

**PR:** #[number] - [title]
**Branch:** [branch-name]
**Generated:** [date]

## Summary

[Number] comments converted into [number] tasks

## Relevant Files

- `path/to/file.ts` - [Files mentioned in comments]
- `path/to/file.test.ts` - [Test files to update]

## Tasks

### Critical Issues (Must Fix)

- [ ] 1.0 [Comment summary as parent task]
  - [ ] 1.1 [Specific action from comment]
  - [ ] 1.2 [Test coverage for fix]
  - [ ] 1.3 [Verify fix resolves issue]

### Code Quality (Should Fix)

- [ ] 2.0 [Comment summary]
  - [ ] 2.1 [Implementation detail]
  - [ ] 2.2 [Update tests]

### Enhancements (Nice to Have)

- [ ] 3.0 [Enhancement suggestion]
  - [ ] 3.1 [Implementation step]

## Original Comments

### Comment 1

**Author:** @username
**File:** path/to/file.ts:123
**Type:** Bug Fix

> Original comment text here

### Comment 2

...
```

## Implementation Script

Save as `scripts/pr-comments-to-tasks.sh`:

```bash
#!/bin/bash

# Get current branch and PR info
CURRENT_BRANCH=$(git branch --show-current)
PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null)

if [ -z "$PR_NUMBER" ]; then
    echo "No PR found for current branch: $CURRENT_BRANCH"
    exit 1
fi

# Fetch PR details and comments
gh pr view $PR_NUMBER --json title,body,reviews,comments > pr-data.json
gh api repos/{owner}/{repo}/pulls/$PR_NUMBER/comments > pr-review-comments.json

# Process with Node.js script
node scripts/process-pr-comments.js

# Clean up temp files
rm pr-data.json pr-review-comments.json
```

## Task Generation Rules

1. **One comment = One parent task** (unless comments are related)
2. **Auto-generate sub-tasks based on comment type:**
   - Bug fixes: investigate → implement fix → add tests → verify
   - Refactors: analyze impact → implement → update tests → review
   - Features: design → implement → test → document
3. **Include context:** Link to original comment and code location
4. **Prioritize:** Group by severity/importance
5. **Track completion:** Use checkbox format for progress tracking

## Usage

```bash
# From any branch with an open PR
./scripts/pr-comments-to-tasks.sh

# Output saved to:
# tasks/pr-[number]-review-tasks.md
```

## Integration with Existing Workflow

1. Run after receiving PR feedback
2. Review generated tasks and adjust as needed
3. Work through tasks using the process-task-list.md guidelines
4. Mark tasks complete as you address comments
5. Push fixes and request re-review
