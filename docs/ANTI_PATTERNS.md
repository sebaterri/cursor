# Anti-Patterns: What NOT to Do

**IMPORTANT:** When reviewing code, agents should identify and flag these anti-patterns for refactoring.

---

## 🚫 **COMMON ANTI-PATTERNS TO AVOID**

### 1. God Objects / God Functions

**❌ ANTI-PATTERN:**
```javascript
// One class/function doing EVERYTHING
class UserManager {
  // Authentication
  async login(email, password) { ... }
  async logout() { ... }
  
  // Email operations
  async sendEmail(to, subject, body) { ... }
  
  // Database operations
  async saveToDatabase(user) { ... }
  
  // Payments
  async processPayment(userId, amount) { ... }
  
  // Logging
  async log(message) { ... }
  
  // 50+ more methods...
}
```

**✅ PATTERN:**
```javascript
// Separated concerns
class AuthService { login, logout }
class EmailService { sendEmail }
class UserRepository { save, findById }
class PaymentService { processPayment }
class Logger { log }
```

### 2. Deep Nesting / Arrow Hell

**❌ ANTI-PATTERN:**
```javascript
// Deeply nested callbacks (callback hell)
fetchUser(id, (err, user) => {
  if (err) {
    fetchBackup(id, (err, backup) => {
      if (err) {
        sendError(err, (err) => {
          console.error('Fatal error');
        });
      }
    });
  }
});
```

**✅ PATTERN:**
```javascript
// Use async/await
try {
  const user = await fetchUser(id);
  return user;
} catch (err) {
  const backup = await fetchBackup(id);
  if (!backup) await sendError(err);
  throw err;
}
```

### 3. Magic Numbers / Magic Strings

**❌ ANTI-PATTERN:**
```javascript
if (user.age > 18) { ... }  // What's magic about 18?
if (status === 'active') { ... }  // What are the other statuses?
const timeout = 5000;  // Is this 5 seconds? milliseconds?
const maxRetries = 3;  // Why 3?
```

**✅ PATTERN:**
```javascript
const LEGAL_AGE = 18;
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};
const TIMEOUT_MS = 5000;  // Clearly milliseconds
const MAX_RETRY_ATTEMPTS = 3;  // Clear purpose

if (user.age > LEGAL_AGE) { ... }
if (status === USER_STATUS.ACTIVE) { ... }
```

### 4. Swallowing Exceptions

**❌ ANTI-PATTERN:**
```javascript
// Error silently ignored
try {
  const data = JSON.parse(jsonString);
} catch (e) {
  // Nothing happens, code continues with broken state
}

// Default value hides errors
const result = riskyOperation().catch(() => null);

// Undefined error handling
async function fetchData() {
  return await api.get('/data');  // If it fails, caller doesn't know
}
```

**✅ PATTERN:**
```javascript
// Explicit error handling
try {
  const data = JSON.parse(jsonString);
} catch (e) {
  console.error('Failed to parse JSON:', e);
  throw new Error('Invalid JSON format');
}

// Explicit about errors
const result = await riskyOperation().catch(err => {
  logger.error('Operation failed:', err);
  throw err;
});

// Clear error contract
async function fetchData() {
  try {
    return await api.get('/data');
  } catch (err) {
    throw new DataFetchError('Failed to fetch data', err);
  }
}
```

### 5. Long Parameter Lists

**❌ ANTI-PATTERN:**
```javascript
function createUser(firstName, lastName, email, phone, address, city, state, zip, country, role, permissions, preferences, settings, metadata) {
  // Which parameters are required? What are defaults?
}

// Impossible to use correctly
createUser('John', 'Doe', 'john@example.com', '555-1234', '123 Main', 'NYC', 'NY', '10001', 'USA', 'admin', [...], {...}, {...}, {...});
```

**✅ PATTERN:**
```javascript
function createUser(userData) {
  const {
    firstName,    // required
    lastName,     // required
    email,        // required
    phone,        // optional
    address,      // optional
    role = 'user' // default
  } = userData;
}

// Much clearer
createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'admin'
});
```

### 6. Boolean Parameters (Flags)

**❌ ANTI-PATTERN:**
```javascript
// What does the true/false mean?
generateReport(data, true, false);

function generateReport(data, includeMetadata, sortDescending) {
  // Later: what was that second parameter?
}
```

**✅ PATTERN:**
```javascript
// Crystal clear
generateReport(data, { includeMetadata: true, sortDescending: false });

function generateReport(data, options = {}) {
  const { includeMetadata = false, sortDescending = false } = options;
}

// Or use separate functions
generateReportWithMetadata(data);
generateReportSortedDescending(data);
```

### 7. Mutable Global State

**❌ ANTI-PATTERN:**
```javascript
// Global variables that can be modified anywhere
let globalUser = null;
let globalCache = {};
let requestCount = 0;

app.get('/user', (req, res) => {
  globalUser = fetchUser();  // Can be modified from anywhere
  globalCache['user'] = globalUser;  // Shared state problems
  requestCount++;  // Race conditions in concurrent requests
});
```

**✅ PATTERN:**
```javascript
// Use function scoping and dependency injection
class UserService {
  constructor() {
    this.cache = new Map();  // Encapsulated state
  }
  
  async getUser(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const user = await fetchUser(id);
    this.cache.set(id, user);
    return user;
  }
}

// Pass dependencies
app.get('/user', (req, res) => {
  const user = userService.getUser(req.params.id);
});
```

### 8. Side Effects in Pure Functions

**❌ ANTI-PATTERN:**
```javascript
// Function modifies external state (side effect)
let totalCalculated = 0;

function calculateTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  totalCalculated = total;  // Modifying external state!
  console.log(total);  // Side effect: logging
  db.save(total);  // Side effect: database write
  return total;
}

// Unpredictable behavior
calculateTotal(items1);
console.log(totalCalculated);  // What value is this?
```

**✅ PATTERN:**
```javascript
// Pure function - no side effects
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Separate concerns
const total = calculateTotal(items);
console.log(total);  // Clear what we're logging
await db.save(total);  // Explicit database operation
```

### 9. Inconsistent Error Handling

**❌ ANTI-PATTERN:**
```javascript
// Some methods throw, some return errors, some return null
class UserService {
  getUser(id) {
    // Throws error
    if (!id) throw new Error('ID required');
    return db.user.findById(id);
  }
  
  createUser(data) {
    // Returns error object
    if (!data.email) return { error: 'Email required' };
    return db.user.create(data);
  }
  
  deleteUser(id) {
    // Returns null on error
    return db.user.delete(id).catch(() => null);
  }
}

// Caller has to handle 3 different patterns!
```

**✅ PATTERN:**
```javascript
// Consistent error handling
class UserService {
  async getUser(id) {
    if (!id) throw new ValidationError('ID required');
    const user = await db.user.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
  
  async createUser(data) {
    if (!data.email) throw new ValidationError('Email required');
    return await db.user.create(data);
  }
  
  async deleteUser(id) {
    if (!id) throw new ValidationError('ID required');
    return await db.user.delete(id);
  }
}

// Caller knows: will throw on error or return success
```

### 10. Copy-Paste Code (Duplicate Code)

**❌ ANTI-PATTERN:**
```javascript
// Email validation repeated everywhere
if (email.includes('@') && email.includes('.')) { ... }
// ... 20 lines later
if (email.includes('@') && email.includes('.')) { ... }
// ... 50 lines later
if (email.includes('@') && email.includes('.')) { ... }
```

**✅ PATTERN:**
```javascript
// DRY - Don't Repeat Yourself
function isValidEmail(email) {
  return email.includes('@') && email.includes('.');
}

// Use everywhere
if (isValidEmail(email)) { ... }
```

### 11. Temporal Coupling

**❌ ANTI-PATTERN:**
```javascript
// Functions must be called in specific order, not obvious
const user = await fetchUser(id);
const posts = await fetchUserPosts(user.id);  // Depends on user being fetched first
const comments = await fetchPostComments(posts[0].id);  // Depends on posts

// If order is wrong, silent failure
const comments = await fetchPostComments(posts[0].id);  // posts undefined!
const posts = await fetchUserPosts(user.id);
const user = await fetchUser(id);
```

**✅ PATTERN:**
```javascript
// Explicit dependencies
async function loadUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(user.id);
  const comments = posts.length > 0 ? await fetchPostComments(posts[0].id) : [];
  return { user, posts, comments };
}

// Single function handles order
const data = await loadUserData(id);
```

### 12. Premature Optimization

**❌ ANTI-PATTERN:**
```javascript
// Over-complex for no reason
const result = cache?.get?.('key')?.value?.[0]?.toLowerCase?.().trim?.();

// Obscure bitwise operations
const isEven = (n) => !(n & 1);
const isPowerOfTwo = (n) => (n & (n - 1)) === 0;

// Micro-optimizations
const arr = Array(1000).fill(0).map((_, i) => i);  // Pre-allocate?
```

**✅ PATTERN:**
```javascript
// Clear and maintainable first
const cached = cache?.get('key');
const value = cached?.value?.[0];
const result = value?.toLowerCase().trim();

// Readable code
const isEven = (n) => n % 2 === 0;
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

// Standard approaches
const arr = Array.from({ length: 1000 }, (_, i) => i);
```

### 13. Error Information Loss

**❌ ANTI-PATTERN:**
```javascript
// Throwing generic error, losing context
try {
  const data = await fetchData();
} catch (error) {
  throw new Error('Request failed');  // Loses original error!
}

// Logging without context
console.error(error);  // No timestamp, no service name
```

**✅ PATTERN:**
```javascript
// Preserve error context
try {
  const data = await fetchData();
} catch (error) {
  throw new Error(`Failed to fetch user data: ${error.message}`);
  // OR
  throw new FetchError('Failed to fetch data', { cause: error, userId });
}

// Log with context
console.error('[UserService] Error:', {
  message: error.message,
  code: error.code,
  userId: userId,
  timestamp: new Date(),
  stack: error.stack.split('\n')[0]
});
```

### 14. Race Conditions

**❌ ANTI-PATTERN:**
```javascript
// Check-then-act (race condition)
if (!user.verified) {
  // Between check and act, user could have been verified elsewhere
  await markAsVerified(user.id);
}

// Multiple async operations on same data
let count = 0;
async function increment() {
  count++;  // Race condition in concurrent calls
  await db.save(count);
}
```

**✅ PATTERN:**
```javascript
// Atomic operation
await User.update(
  { id: user.id, verified: false },
  { verified: true }
);

// Use database transactions
const result = await db.$transaction(async (tx) => {
  const updated = await tx.user.update({ where: { id }, data: { verified: true } });
  return updated;
});
```

### 15. Ignoring Type Safety

**❌ ANTI-PATTERN:**
```javascript
// No type checking
function process(data) {
  return data.map(item => item.value * 2);  // What if data is null? What if item.value is string?
}

// Any type everywhere
const makeRequest = (url, options) => { ... }
```

**✅ PATTERN:**
```javascript
// TypeScript with types
interface DataItem {
  value: number;
}

function process(data: DataItem[]): number[] {
  if (!Array.isArray(data)) throw new Error('Expected array');
  return data.map(item => item.value * 2);
}

// Or runtime validation
function makeRequest(url: string, options: Record<string, unknown>): Promise<Response> {
  if (typeof url !== 'string') throw new Error('URL must be string');
  return fetch(url, options);
}
```

---

## 📋 **Anti-Pattern Detection Checklist**

When reviewing code, agents should check for:

- ✅ God objects (classes doing too much)
- ✅ Deep callback nesting (use async/await)
- ✅ Magic numbers (use named constants)
- ✅ Swallowed exceptions (no silent failures)
- ✅ Long parameter lists (use objects)
- ✅ Boolean flag parameters (use named parameters)
- ✅ Global mutable state (use encapsulation)
- ✅ Side effects in pure functions (separate concerns)
- ✅ Inconsistent error handling (standardize)
- ✅ Duplicate code (DRY principle)
- ✅ Temporal coupling (document dependencies)
- ✅ Premature optimization (clarity first)
- ✅ Lost error information (preserve context)
- ✅ Race conditions (use atomicity)
- ✅ Missing type safety (add validation)