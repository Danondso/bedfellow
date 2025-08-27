#!/bin/bash

# Script to fetch PR comments and convert them to tasks
# Usage: ./scripts/pr-comments-to-tasks.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 Fetching PR information...${NC}"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Get PR number for current branch
PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null || echo "")

if [ -z "$PR_NUMBER" ]; then
    echo -e "${RED}❌ No PR found for branch: $CURRENT_BRANCH${NC}"
    echo -e "${YELLOW}💡 Tip: Make sure you have an open PR for this branch${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found PR #$PR_NUMBER${NC}"

# Get repository info
REPO_INFO=$(gh repo view --json owner,name)
OWNER=$(echo $REPO_INFO | jq -r .owner.login)
REPO=$(echo $REPO_INFO | jq -r .name)

echo "Repository: $OWNER/$REPO"

# Create temp directory for data
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "${GREEN}📥 Fetching PR data...${NC}"

# Fetch PR details
gh pr view $PR_NUMBER --json title,body,state,author,createdAt,reviews > "$TEMP_DIR/pr-data.json"

# Fetch PR review comments (comments on specific lines of code)
gh api "repos/$OWNER/$REPO/pulls/$PR_NUMBER/comments" > "$TEMP_DIR/pr-review-comments.json"

# Fetch issue comments (general PR discussion)
gh api "repos/$OWNER/$REPO/issues/$PR_NUMBER/comments" > "$TEMP_DIR/pr-issue-comments.json"

# Fetch review threads
gh api "repos/$OWNER/$REPO/pulls/$PR_NUMBER/reviews" > "$TEMP_DIR/pr-reviews.json"

echo -e "${GREEN}🔄 Processing comments...${NC}"

# Check if Node.js script exists, if not create it
if [ ! -f "scripts/process-pr-comments.js" ]; then
    echo -e "${YELLOW}Creating comment processor...${NC}"
    cat > scripts/process-pr-comments.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Read the JSON files
const tempDir = process.argv[2] || '/tmp';
const prData = JSON.parse(fs.readFileSync(path.join(tempDir, 'pr-data.json'), 'utf8'));
const reviewComments = JSON.parse(fs.readFileSync(path.join(tempDir, 'pr-review-comments.json'), 'utf8'));
const issueComments = JSON.parse(fs.readFileSync(path.join(tempDir, 'pr-issue-comments.json'), 'utf8'));
const reviews = JSON.parse(fs.readFileSync(path.join(tempDir, 'pr-reviews.json'), 'utf8'));

// Process and categorize comments
const tasks = {
    critical: [],
    quality: [],
    enhancement: []
};

const files = new Set();
const processedComments = [];

// Helper to categorize comment
function categorizeComment(body) {
    const lowerBody = body.toLowerCase();
    
    // Critical keywords
    if (lowerBody.includes('bug') || lowerBody.includes('error') || 
        lowerBody.includes('broken') || lowerBody.includes('fail') ||
        lowerBody.includes('security') || lowerBody.includes('vulnerability')) {
        return 'critical';
    }
    
    // Quality keywords
    if (lowerBody.includes('refactor') || lowerBody.includes('cleanup') ||
        lowerBody.includes('lint') || lowerBody.includes('style') ||
        lowerBody.includes('performance') || lowerBody.includes('optimize')) {
        return 'quality';
    }
    
    // Default to enhancement
    return 'enhancement';
}

// Process review comments (line-specific)
reviewComments.forEach(comment => {
    if (comment.body && comment.body.trim()) {
        const category = categorizeComment(comment.body);
        if (comment.path) files.add(comment.path);
        
        processedComments.push({
            type: 'review',
            category,
            body: comment.body,
            path: comment.path,
            line: comment.line || comment.original_line,
            author: comment.user.login,
            createdAt: comment.created_at,
            url: comment.html_url
        });
    }
});

// Process issue comments (general discussion)
issueComments.forEach(comment => {
    if (comment.body && comment.body.trim()) {
        const category = categorizeComment(comment.body);
        
        processedComments.push({
            type: 'issue',
            category,
            body: comment.body,
            author: comment.user.login,
            createdAt: comment.created_at,
            url: comment.html_url
        });
    }
});

// Process review summaries
reviews.forEach(review => {
    if (review.body && review.body.trim()) {
        const category = review.state === 'CHANGES_REQUESTED' ? 'critical' : 
                       review.state === 'APPROVED' ? 'enhancement' : 'quality';
        
        processedComments.push({
            type: 'review_summary',
            category,
            state: review.state,
            body: review.body,
            author: review.user.login,
            createdAt: review.submitted_at,
            url: review.html_url
        });
    }
});

// Group comments into tasks
let taskCounter = 1;
processedComments.forEach(comment => {
    const task = {
        id: taskCounter++,
        title: comment.body.split('\n')[0].substring(0, 100),
        comment: comment,
        subtasks: []
    };
    
    // Generate subtasks based on comment type
    if (comment.category === 'critical') {
        task.subtasks = [
            'Investigate the reported issue',
            'Implement fix',
            'Add test coverage for the fix',
            'Verify fix resolves the issue'
        ];
    } else if (comment.category === 'quality') {
        task.subtasks = [
            'Review suggested changes',
            'Implement improvements',
            'Update affected tests'
        ];
    } else {
        task.subtasks = [
            'Evaluate suggestion',
            'Implement if beneficial'
        ];
    }
    
    tasks[comment.category].push(task);
});

// Generate markdown output
const date = new Date().toISOString().split('T')[0];
const prNumber = process.env.PR_NUMBER;
const branch = process.env.CURRENT_BRANCH;

let markdown = `# PR Review Tasks: ${prData.title}

**PR:** #${prNumber} - ${prData.title}
**Branch:** ${branch}
**Author:** ${prData.author.login}
**Generated:** ${date}

## Summary
${processedComments.length} comments converted into ${taskCounter - 1} tasks

## Relevant Files
`;

// Add files list
files.forEach(file => {
    markdown += `- \`${file}\`\n`;
});

if (files.size === 0) {
    markdown += '- No specific files mentioned in comments\n';
}

markdown += '\n## Tasks\n\n';

// Add tasks by category
if (tasks.critical.length > 0) {
    markdown += '### Critical Issues (Must Fix)\n';
    tasks.critical.forEach((task, idx) => {
        markdown += `- [ ] ${idx + 1}.0 ${task.title}\n`;
        task.subtasks.forEach((subtask, subIdx) => {
            markdown += `  - [ ] ${idx + 1}.${subIdx + 1} ${subtask}\n`;
        });
        markdown += '\n';
    });
}

if (tasks.quality.length > 0) {
    markdown += '### Code Quality (Should Fix)\n';
    const offset = tasks.critical.length;
    tasks.quality.forEach((task, idx) => {
        markdown += `- [ ] ${offset + idx + 1}.0 ${task.title}\n`;
        task.subtasks.forEach((subtask, subIdx) => {
            markdown += `  - [ ] ${offset + idx + 1}.${subIdx + 1} ${subtask}\n`;
        });
        markdown += '\n';
    });
}

if (tasks.enhancement.length > 0) {
    markdown += '### Enhancements (Nice to Have)\n';
    const offset = tasks.critical.length + tasks.quality.length;
    tasks.enhancement.forEach((task, idx) => {
        markdown += `- [ ] ${offset + idx + 1}.0 ${task.title}\n`;
        task.subtasks.forEach((subtask, subIdx) => {
            markdown += `  - [ ] ${offset + idx + 1}.${subIdx + 1} ${subtask}\n`;
        });
        markdown += '\n';
    });
}

// Add original comments section
markdown += '\n## Original Comments\n\n';
processedComments.forEach((comment, idx) => {
    markdown += `### Comment ${idx + 1}\n`;
    markdown += `**Author:** @${comment.author}\n`;
    if (comment.path) {
        markdown += `**File:** ${comment.path}`;
        if (comment.line) markdown += `:${comment.line}`;
        markdown += '\n';
    }
    markdown += `**Type:** ${comment.type === 'review_summary' ? 'Review Summary' : 
                            comment.type === 'review' ? 'Code Review' : 'Discussion'}\n`;
    markdown += `**Category:** ${comment.category}\n`;
    markdown += `**Link:** [View on GitHub](${comment.url})\n\n`;
    markdown += '> ' + comment.body.split('\n').join('\n> ') + '\n\n';
});

// Save the output
const outputDir = 'tasks';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const outputFile = path.join(outputDir, `pr-${prNumber}-review-tasks.md`);
fs.writeFileSync(outputFile, markdown);

console.log(`✅ Task list generated: ${outputFile}`);
console.log(`📊 Summary: ${processedComments.length} comments → ${taskCounter - 1} tasks`);
console.log(`   - Critical: ${tasks.critical.length}`);
console.log(`   - Quality: ${tasks.quality.length}`);
console.log(`   - Enhancement: ${tasks.enhancement.length}`);
EOF
fi

# Run the processor
PR_NUMBER=$PR_NUMBER CURRENT_BRANCH=$CURRENT_BRANCH node scripts/process-pr-comments.js "$TEMP_DIR"

echo -e "${GREEN}✨ Done! Check the tasks/ directory for your generated task list.${NC}"