# Claude PR Feedback Workflow

## Overview

This workflow enables Claude to directly fetch PR comments, convert them to tasks, and systematically address feedback.

## Commands for Claude

### 1. Fetch Current PR Comments

```bash
# Get PR number for current branch
gh pr view --json number -q .number

# Fetch all PR comments and reviews
gh pr view --json title,body,reviews,comments,state
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/comments
gh api repos/{owner}/{repo}/issues/{PR_NUMBER}/comments
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/reviews
```

### 2. Process PR Feedback

When you ask me to "process PR feedback" or "get PR comments", I will:

1. **Fetch PR Data**: Get all comments from the current PR
2. **Categorize Comments**: Group by priority (critical/quality/enhancement)
3. **Generate Task List**: Create structured tasks with subtasks
4. **Save to File**: Create `tasks/pr-{number}-feedback.md`
5. **Start Working**: Begin addressing tasks systematically

## Task Categories

### Critical (Must Fix)

- Build failures
- Test failures
- Security issues
- Bugs/errors
- Blocking issues

### Quality (Should Fix)

- Code style issues
- Refactoring suggestions
- Performance improvements
- Missing error handling

### Enhancement (Nice to Have)

- Additional features
- Documentation improvements
- Optional optimizations

## Workflow Example

User: "Process the PR feedback"

Claude will:

```bash
# 1. Get current PR info
gh pr view --json number,title,state

# 2. Fetch all comments
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/comments > comments.json
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/reviews > reviews.json

# 3. Process and categorize
# 4. Generate task markdown
# 5. Start working through tasks
```

## Task Format

```markdown
# PR Feedback Tasks

## Critical Issues

- [ ] 1.0 [Issue from comment]
  - [ ] 1.1 Investigate issue
  - [ ] 1.2 Implement fix
  - [ ] 1.3 Add tests
  - [ ] 1.4 Verify fix

## Code Quality

- [ ] 2.0 [Suggestion from comment]
  - [ ] 2.1 Review suggestion
  - [ ] 2.2 Implement change
  - [ ] 2.3 Update tests
```

## Working Through Tasks

After generating tasks, I will:

1. Start with critical issues first
2. Complete one subtask at a time
3. Run tests after each parent task
4. Commit changes with descriptive messages
5. Mark tasks complete as I go
6. Ask for permission before moving to next subtask

## Quick Commands

- **"Process PR feedback"** - Fetch and convert all PR comments to tasks
- **"Show PR comments"** - Display all comments without creating tasks
- **"Address critical feedback"** - Focus only on must-fix issues
- **"Continue with PR tasks"** - Resume working through existing task list
- **"What's left in PR feedback?"** - Show remaining uncompleted tasks

## Integration with Existing Workflow

This workflow complements the existing PRD → Tasks workflow:

- PRD workflow: For implementing new features
- PR feedback workflow: For addressing review comments
- Both use the same task format and completion process

## Example Usage

```
User: Process the PR feedback

Claude: I'll fetch and process the PR comments now...
[Fetches comments]
[Creates task list]
Found 12 comments converted into 8 tasks:
- 3 critical issues
- 4 code quality improvements
- 1 enhancement suggestion

Starting with critical issue 1.0: "Fix undefined variable error"
[Begins working through tasks]
```
