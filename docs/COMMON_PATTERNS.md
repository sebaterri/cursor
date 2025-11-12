# Aqvil Common Patterns & Best Practices

## Service Pattern

The codebase uses service classes for business logic separation.

### Pattern Structure
```javascript
// ✅ Good: Service pattern
class UserService {
  constructor(db) {
    this.db = db;
  }

  async getUserById(id) {
    return this.db.user.findUnique({ where: { id } });
  }

  async createUser(data) {
    return this.db.user.create({ data });
  }

  async deleteUser(id) {
    return this.db.user.delete({ where: { id } });
  }
}

// Usage
const userService = new UserService(prisma);
const user = await userService.getUserById(123);
```

### Example Services in Codebase
- `GitOperations` - Git commands wrapper
- `FileOperations` - File system operations
- `OpenAIAgent` - AI agent orchestration
- `ErrorLogDb` - Error logging service

---

## Agent Pattern

Agents follow a consistent pattern for execution and progress reporting.

### Basic Agent Structure
```javascript
class MyAgent {
  constructor(workspaceDir, apiKey, options = {}) {
    this.workspaceDir = workspaceDir;
    this.model = options.model || 'gpt-4o-mini';
    this.conversationHistory = [];
    this.tools = this.defineTools();
    this.systemPrompt = this.getSystemPrompt();
  }

  defineTools() {
    // Define available tools for AI to call
    return [
      {
        type: 'function',
        function: {
          name: 'read_file',
          description: 'Read file content',
          parameters: { ... }
        }
      }
    ];
  }

  getSystemPrompt() {
    // Return detailed system prompt for AI
    return `You are an expert...`;
  }

  async processMessage(userMessage, onProgress) {
    // Main agent loop
    // 1. Add user message to history
    // 2. Call AI model
    // 3. If AI returns tool calls, execute them
    // 4. Add results back to history
    // 5. Repeat until AI stops making tool calls
    // 6. Return final response
  }

  async executeTool(name, input) {
    // Execute the requested tool
    // Return result with success flag
  }

  cancel() {
    // Graceful cancellation
    this.cancelled = true;
  }

  async cleanup() {
    // Clean up resources
  }
}
```

### Progress Reporting Pattern
```javascript
// Before executing tool
onProgress?.({
  type: 'tool_call',
  tool: 'read_file',
  input: { file_path: 'src/index.js' },
  message: '📖 Reading file: src/index.js'
});

// After tool completes
onProgress?.({
  type: 'tool_result',
  tool: 'read_file',
  result: fileContent,
  message: '✅ File read completed',
  summary: {
    toolsExecuted: this.executionLog.length,
    round: currentRound
  }
});

// Status updates between rounds
onProgress?.({
  type: 'status',
  message: `🔄 Round 5/25: Processing results...`,
  round: 5,
  totalRounds: 25
});

// Keepalive heartbeat (prevents timeout)
onProgress?.({
  type: 'heartbeat',
  message: '💓 Agent is still working...',
  toolsExecuted: this.executionLog.length
});
```

---

## Git Workflow Pattern

Standard pattern for all git operations in agents.

### Branch-Protected Workflow
```javascript
// ✅ Correct workflow
async executeTaskWithGit(task) {
  // 1. Check current branch (should not be main/master/develop/dev)
  const currentBranch = await this.git.getCurrentBranch();
  if (this.git.isProtectedBranch(currentBranch)) {
    throw new Error(`Cannot work on protected branch: ${currentBranch}`);
  }

  // 2. Create feature branch BEFORE any changes
  const featureBranch = `feature/task-${Date.now()}`;
  await this.git.createBranch(featureBranch);

  // 3. Make changes
  await this.fileOps.writeFile('src/file.js', newContent);

  // 4. Stage changes
  await this.git.stageFiles('src/file.js');

  // 5. Commit with message
  await this.git.commit('feat: implement task');

  // 6. Push to feature branch (NEVER to main/master)
  await this.git.push(featureBranch);

  return { branch: featureBranch, commit: 'abc123' };
}
```

### Protected Branch Check
```javascript
// Pattern used throughout codebase
function isProtectedBranch(branchName) {
  const protectedBranches = ['main', 'master', 'develop', 'dev'];
  const lower = branchName?.toLowerCase() || '';
  return protectedBranches.includes(lower);
}

// Used before commits
if (this.isProtectedBranch(currentBranch)) {
  throw new Error(`Cannot commit to protected branch`);
}
```

---

## Error Handling Pattern

Consistent error handling throughout agents.

### Try-Catch-Finally
```javascript
// ✅ Good: Comprehensive error handling
async processMessage(userMessage, onProgress) {
  let heartbeatInterval;
  
  try {
    // Setup
    heartbeatInterval = setInterval(() => {
      onProgress?.({ type: 'heartbeat', message: '💓...' });
    }, 10000);

    // Main logic
    const result = await this.executeTask();
    
    return result;
  } catch (error) {
    console.error('[Agent] Error:', error.message);
    
    // Log to database
    if (this.userId) {
      await errorLogDb.create({
        userId: this.userId,
        errorType: 'agent_error',
        message: error.message,
        stack: error.stack
      });
    }
    
    throw error;
  } finally {
    // Always cleanup
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    await this.cleanup();
  }
}
```

### Tool Execution Error Handling
```javascript
// ✅ Pattern used for all tool execution
async executeTool(name, input) {
  try {
    switch (name) {
      case 'read_file':
        return await this.fileOps.readFile(input.file_path);
      case 'write_file':
        return await this.fileOps.writeFile(input.file_path, input.content);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[Agent] Tool execution error (${name}):`, error.message);
    // Return error object, don't throw (so AI can handle it)
    return { success: false, error: error.message };
  }
}
```

---

## File Operation Pattern

Safe file operations with path validation.

### Safe Path Resolution
```javascript
// ✅ Pattern used for all file operations
function resolveSafePath(basePath, userPath) {
  const resolved = path.resolve(basePath, userPath);
  
  // Prevent directory traversal attacks
  if (!resolved.startsWith(basePath)) {
    throw new Error('Path outside workspace');
  }
  
  return resolved;
}

// Usage
const fullPath = this.resolveSafePath(this.workspaceDir, userPath);
```

### File Reading Pattern
```javascript
// ✅ Good: Handle errors, return consistent format
async readFile(filePath) {
  try {
    const fullPath = this.getFullPath(filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### File Writing Pattern
```javascript
// ✅ Good: Create directories, handle errors
async writeFile(filePath, content) {
  try {
    const fullPath = this.getFullPath(filePath);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf-8');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Conversation History Management Pattern

Optimize and manage AI conversation history.

### History Optimization
```javascript
// Pattern used in agents
const optimizedHistory = optimizeConversationHistory(this.conversationHistory, {
  maxHistory: 24,              // Keep last 24 messages
  keepRecent: 8,               // Always keep last 8 messages
  compressOld: true,           // Summarize old messages
  deduplicate: true,           // Remove duplicates
  maxMessageTokens: 1000       // Token limit per message
});

// Then send to AI with history
const response = await this.openai.chat.completions.create({
  model: this.model,
  messages: [
    { role: 'system', content: this.systemPrompt },
    ...optimizedHistory  // Optimized history here
  ],
  tools: this.tools,
  tool_choice: 'auto'
});
```

### Adding to History
```javascript
// ✅ Pattern: Always add messages to history
// Add user message
this.conversationHistory.push({ role: 'user', content: userMessage });

// Add AI response
this.conversationHistory.push({ role: 'assistant', content: message.content });

// Add tool results
this.conversationHistory.push(...toolResults);
```

---

## WebSocket Communication Pattern

Real-time updates to frontend via WebSocket.

### Message Types
```javascript
// Status updates
onProgress?.({
  type: 'status',
  message: '🔄 Round 5/25: Analyzing...',
  round: 5,
  totalRounds: 25
});

// Text response from AI
onProgress?.({
  type: 'text',
  content: 'I found 3 security vulnerabilities...'
});

// Tool execution start
onProgress?.({
  type: 'tool_call',
  tool: 'read_file',
  input: { file_path: 'src/index.js' },
  message: '📖 Reading file...'
});

// Tool execution result
onProgress?.({
  type: 'tool_result',
  tool: 'read_file',
  result: fileContent,
  message: '✅ File read completed'
});

// Keepalive heartbeat
onProgress?.({
  type: 'heartbeat',
  message: '💓 Agent is still working...'
});

// Error
onProgress?.({
  type: 'error',
  error: 'Failed to read file',
  code: 'READ_ERROR'
});
```

---

## Database Transaction Pattern

Safe multi-step operations with Prisma transactions.

### Transaction Pattern
```javascript
// ✅ Good: Use transactions for related operations
const result = await prisma.$transaction(async (tx) => {
  // Step 1: Create user
  const user = await tx.user.create({
    data: { email: 'user@example.com' }
  });

  // Step 2: Create session
  const session = await tx.session.create({
    data: { userId: user.id }
  });

  // Step 3: Update config
  await tx.config.update({
    where: { id: 1 },
    data: { lastLoginUserId: user.id }
  });

  return { user, session };
});
// All-or-nothing: if any step fails, entire transaction rolls back
```

---

## Logging Pattern

Consistent logging throughout codebase.

### Log Format
```javascript
// Context-based logging
console.log('[ServiceName] Message with details');

// Examples:
console.log('[OpenAIAgent] Starting agent execution');
console.log('[GitOperations] Pushing branch: feature/auth');
console.log('[Bugbot] Analyzing 15 files...');

// With emojis for clarity
console.log('📖 [FileOps] Reading: src/index.js');
console.log('✅ [Agent] Task completed');
console.log('❌ [Git] Failed to push: permission denied');
console.log('⚠️ [Agent] Warning: file too large, chunking...');

// Errors with full context
console.error('[OpenAIAgent] Error:', error.message);
if (error.stack) {
  console.error('Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
}
```

---

## API Pattern

RESTful API response pattern.

### Success Response
```javascript
// ✅ Consistent success format
res.json({
  success: true,
  data: { userId: 123, email: 'user@example.com' },
  message: 'User created successfully'
});
```

### Error Response
```javascript
// ✅ Consistent error format
res.status(400).json({
  success: false,
  error: 'Validation error',
  code: 'VALIDATION_ERROR',
  details: { field: 'email', message: 'Invalid email format' }
});
```

---

## Caching Pattern

Reduce API calls and improve performance.

### File Content Caching
```javascript
// ✅ Pattern: Cache frequently accessed files
class FileOps {
  constructor() {
    this.fileCache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  async readFile(path) {
    // Check cache first
    if (this.fileCache.has(path)) {
      const cached = this.fileCache.get(path);
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.content;
      }
    }

    // Read from disk
    const content = await fs.readFile(path, 'utf-8');

    // Store in cache
    this.fileCache.set(path, { content, timestamp: Date.now() });

    return content;
  }

  clearCache() {
    this.fileCache.clear();
  }
}
```

---

## Rate Limiting Pattern

Handle API rate limits gracefully.

### Retry with Exponential Backoff
```javascript
// ✅ Pattern: Retry on rate limit
async makeApiCall() {
  let retries = 0;
  const MAX_RETRIES = 3;

  while (retries < MAX_RETRIES) {
    try {
      return await this.openai.chat.completions.create({ ... });
    } catch (error) {
      if (error.status === 429 && retries < MAX_RETRIES) {
        // Calculate backoff: 2^retries seconds
        const delayMs = Math.pow(2, retries) * 1000;
        console.warn(`⚠️ Rate limited. Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        retries++;
      } else {
        throw error;
      }
    }
  }
}
```