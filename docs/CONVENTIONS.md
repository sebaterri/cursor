# Aqvil Code Conventions & Standards

## Naming Conventions

### Variables & Functions
```javascript
// ✅ Good: camelCase for variables and functions
const userEmail = 'user@example.com';
const getUserById = async (id) => { ... };
const isAuthenticated = true;

// ❌ Bad: snake_case or PascalCase for non-classes
const user_email = 'user@example.com';
const GetUserById = async (id) => { ... };
```

### Classes & Types
```javascript
// ✅ Good: PascalCase for classes
class UserService { ... }
class GitOperations { ... }
class OpenAIAgent { ... }

// ❌ Bad: camelCase for classes
class userService { ... }
class gitOperations { ... }
```

### Constants
```javascript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 5;
const DEFAULT_TIMEOUT_MS = 30000;
const API_BASE_URL = 'https://api.openai.com/v1';

// ❌ Bad: mixed case
const maxRetryAttempts = 5;
const DEFAULT_timeout = 30000;
```

### File Names
```javascript
// ✅ Good: kebab-case for file names
- conversation-optimizer.js
- error-handler.js
- background-worker.js
- open-ai-agent.js

// Classes: PascalCase
- UserService.js
- GitOperations.js
- OpenAIAgent.js

// Tests: .test.js or .spec.js
- agent.test.js
- git-operations.spec.js
```

---

## Code Structure & Organization

### Function/Method Organization
```javascript
// ✅ Good: Logical grouping
class OpenAIAgent {
  // 1. Constructor
  constructor(workspaceDir, apiKey) { ... }

  // 2. Public methods
  async processMessage(userMessage) { ... }
  cancel() { ... }

  // 3. Private helper methods
  async executeTool(name, input) { ... }
  sanitizeToolOutput(result) { ... }

  // 4. Utility methods
  sleep(ms) { ... }
  truncateString(s, max) { ... }
}
```

### Async/Await Pattern
```javascript
// ✅ Good: Use async/await, not .then()
async function fetchUser(id) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// ❌ Bad: Promise chains
function fetchUser(id) {
  return prisma.user.findUnique({ where: { id } })
    .then(user => user)
    .catch(error => error);
}
```

### Error Handling
```javascript
// ✅ Good: Try-catch with specific error messages
try {
  const result = await analyzeFile(filePath);
  return result;
} catch (error) {
  console.error(`[AnalysisError] Failed to analyze ${filePath}:`, error.message);
  throw new Error(`Analysis failed: ${error.message}`);
}

// ❌ Bad: Silent failures or generic errors
const result = await analyzeFile(filePath).catch(() => null);

// ❌ Bad: Generic error messages
throw new Error('Error');
```

---

## Logging Standards

### Log Levels & Prefixes
```javascript
// Context prefix format: [ServiceName]

// ✅ Good examples:
console.log('[OpenAIAgent] Starting agent for user 123');
console.log('[GitOperations] Checking git status');
console.log('[Bugbot] Analyzing file: src/index.js');

// Info logs (progress)
console.log('[OpenAIAgent] Round 5/25: Executing tools');

// Warnings (non-critical issues)
console.warn('⚠️ [GitOperations] Could not stage file: permission denied');

// Errors (failures)
console.error('[OpenAIAgent] Error:', error.message);

// Debug (detailed info)
console.log('[DEBUG] Tool result:', sanitizedResult);
```

### Progress Messages
```javascript
// ✅ Use emojis for visual clarity
console.log('📖 Reading file: src/index.js');
console.log('✍️ Writing file: src/new-feature.js');
console.log('🔍 Searching for: "vulnerabilities"');
console.log('✅ Task completed successfully');
console.log('⚠️ Warning: 10 potential issues found');
console.log('❌ Error: Failed to push branch');
```

---

## Git Conventions

### Branch Naming
```javascript
// ✅ Good: Descriptive, lowercase, kebab-case
- feature/add-user-authentication
- fix/resolve-memory-leak
- refactor/extract-api-layer
- docs/update-readme
- perf/optimize-database-queries

// ❌ Bad: Vague or unclear
- fix-stuff
- my-changes
- WIP
- temp
```

### Commit Messages
```javascript
// ✅ Good: Conventional Commits format
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: resolve N+1 query in UserService"
git commit -m "refactor: extract API client into separate module"
git commit -m "perf: optimize database indexes for user lookups"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for authentication middleware"

// Format: type(scope): subject
// - type: feat, fix, refactor, perf, docs, test, style, chore
// - scope: optional, area of change
// - subject: imperative, lowercase, no period

// ❌ Bad: Vague commits
git commit -m "update stuff"
git commit -m "fixes"
git commit -m "WIP"
```

### Protected Branches
```javascript
// These branches are PROTECTED - never commit directly:
- main
- master
- develop
- dev
- production

// ALWAYS create feature branch:
git checkout -b feature/my-feature
git commit ...
git push origin feature/my-feature
// Then create pull request
```

---

## API Response Format

### Success Response
```javascript
// ✅ Good: Consistent structure
{
  success: true,
  data: { ... },
  message: "Operation completed successfully",
  timestamp: "2025-11-02T12:34:56Z"
}
```

### Error Response
```javascript
// ✅ Good: Clear error information
{
  success: false,
  error: "Invalid input",
  code: "VALIDATION_ERROR",
  details: { field: "email", issue: "Invalid format" },
  timestamp: "2025-11-02T12:34:56Z"
}
```

---

## Database & Prisma

### Query Patterns
```javascript
// ✅ Good: Include relations when needed
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { sessions: true }
});

// ✅ Good: Filter and select specific fields
const users = await prisma.user.findMany({
  where: { role: 'admin' },
  select: { id: true, email: true, role: true }
});

// ❌ Bad: Select all fields unnecessarily
const users = await prisma.user.findMany(); // Gets all fields

// ❌ Bad: Missing error handling
const user = await prisma.user.findUnique({ where: { id } });
```

### Transactions
```javascript
// ✅ Good: Use transactions for multi-step operations
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { ... } });
  const session = await tx.session.create({ data: { userId: user.id } });
  return { user, session };
});
```

---

## Agent Implementation Standards

### Tool Execution
```javascript
// ✅ Good: Validate input, handle errors, return consistent format
async executeTool(name, input) {
  try {
    switch (name) {
      case 'read_file':
        if (!input.file_path) throw new Error('file_path required');
        return await this.fileOps.readFile(input.file_path);
      
      case 'git_commit':
        if (!input.message) throw new Error('message required');
        return await this.git.commit(input.message);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Progress Reporting
```javascript
// ✅ Good: Send detailed progress updates
onProgress?.({
  type: 'tool_call',
  tool: 'read_file',
  input: { file_path: 'src/index.js' },
  message: '📖 Reading file: src/index.js'
});

// Then after completion:
onProgress?.({
  type: 'tool_result',
  tool: 'read_file',
  result: fileContent,
  message: '✅ File read completed',
  summary: {
    toolsExecuted: 3,
    round: 5
  }
});
```

### Workspace Management
```javascript
// ✅ Good: Isolated, temporary workspaces
constructor(workspaceDir) {
  // Always use /tmp for security
  if (!workspaceDir.startsWith('/tmp/')) {
    this.workspaceDir = `/tmp/aqvil-agent-workspaces/session-${Date.now()}`;
  }
}

// ✅ Good: Cleanup after completion
async cleanup() {
  try {
    await fs.rm(this.workspaceDir, { recursive: true, force: true });
  } catch (error) {
    console.error('[Agent] Cleanup error:', error);
  }
}
```

---

## Security Standards

### Secrets & Credentials
```javascript
// ✅ Good: Use environment variables
const apiKey = process.env.OPENAI_API_KEY;
const dbUrl = process.env.DATABASE_URL;

// ✅ Good: Mask secrets in logs
console.log(`[Auth] Token: ${token.substring(0, 10)}...`);

// ❌ Bad: Hardcoded secrets
const apiKey = 'sk-abc123xyz789';

// ❌ Bad: Log full secrets
console.log('[Auth] Full token:', fullToken);
```

### Input Validation
```javascript
// ✅ Good: Validate and sanitize input
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email;
}

// ✅ Good: Whitelist commands
const COMMAND_WHITELIST = ['npm test', 'npm run build', 'git status'];
if (!COMMAND_WHITELIST.includes(command)) {
  throw new Error('Command not allowed');
}
```

### Path Safety
```javascript
// ✅ Good: Validate paths to prevent directory traversal
function resolveSafePath(basePath, userPath) {
  const resolved = path.resolve(basePath, userPath);
  if (!resolved.startsWith(basePath)) {
    throw new Error('Path outside allowed directory');
  }
  return resolved;
}
```

---

## Testing Standards

### Test File Organization
```javascript
// ✅ Good: Descriptive test names
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when user exists', async () => { ... });
    it('should throw error when user not found', async () => { ... });
    it('should return user with relations', async () => { ... });
  });
});
```

### Test Coverage
```javascript
// ✅ Good: Test happy path, edge cases, and errors
- Happy path: Normal flow works
- Edge cases: Null, empty, boundary values
- Error cases: Invalid input, API failures
- Security: Unauthorized access, injection attacks
```

---

## Documentation Standards

### Code Comments
```javascript
// ✅ Good: Explain WHY, not WHAT
// Complex scheduling logic: retry with exponential backoff
// to avoid overwhelming the API during rate limits
await sleep(Math.pow(2, retryCount) * 1000);

// ❌ Bad: Obvious comments
// Increment i
i++;

// ❌ Bad: Misleading comments
// This query is optimized (but it actually causes N+1)
const users = await User.find();
```

### Function Documentation
```javascript
// ✅ Good: JSDoc comments
/**
 * Execute a tool and return result
 * @param {string} toolName - Name of tool (read_file, git_commit, etc.)
 * @param {Object} input - Tool input parameters
 * @returns {Promise<Object>} Tool result with success flag
 * @throws {Error} If tool execution fails
 */
async executeTool(toolName, input) { ... }
```