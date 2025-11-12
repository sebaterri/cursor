# Best Practices for Code Quality, Security & Performance

This document contains universal best practices that apply to **ALL programming languages and frameworks**.

---

## 🔒 **SECURITY BEST PRACTICES**

### 1. Input Validation & Sanitization

**❌ VULNERABLE:**
```javascript
// Direct SQL query with user input
app.get('/user/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(query);
});

// No validation on email
app.post('/register', (req, res) => {
  const user = User.create({ email: req.body.email });
});
```

**✅ SECURE:**
```javascript
// Parameterized query
app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) throw new Error('Invalid ID');
  db.query('SELECT * FROM users WHERE id = ?', [id]);
});

// Validate before use
app.post('/register', (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!isValidEmail(email)) throw new Error('Invalid email');
  const user = User.create({ email });
});
```

### 2. Never Hardcode Secrets

**❌ VULNERABLE:**
```javascript
const apiKey = 'sk-abc123xyz789';
const dbPassword = 'admin123';
const jwtSecret = 'my-super-secret-key';

// Log secrets
console.log('Token:', userToken);
```

**✅ SECURE:**
```javascript
const apiKey = process.env.OPENAI_API_KEY;
const dbPassword = process.env.DB_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

// Never log secrets
console.log('Token:', token.substring(0, 10) + '...');
```

### 3. Protect Against Common Attacks

**SQL Injection:**
```javascript
// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good: Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

**XSS (Cross-Site Scripting):**
```javascript
// ❌ Bad: Render user input directly in HTML
const html = `<div>${userInput}</div>`;

// ✅ Good: Escape or use safe methods
const escaped = escapeHtml(userInput);
const html = `<div>${escaped}</div>`;
// OR use frameworks that auto-escape
const jsx = <div>{userInput}</div>;
```

**CSRF (Cross-Site Request Forgery):**
```javascript
// ✅ Good: Use CSRF tokens
app.post('/delete-user', csrfProtection, (req, res) => {
  // Token validated automatically
});
```

### 4. Authentication & Authorization

**❌ WEAK:**
```javascript
// Storing passwords in plain text
db.users.create({ email, password: plaintext });

// No role checking
app.delete('/admin/users/:id', (req, res) => {
  User.delete(id);
});

// Long-lived tokens
jwt.sign({ userId }, secret, { expiresIn: '30d' });
```

**✅ STRONG:**
```javascript
// Hash passwords with salt
const hashedPassword = await bcrypt.hash(password, 10);
db.users.create({ email, password: hashedPassword });

// Check authorization
app.delete('/admin/users/:id', requireAdmin, (req, res) => {
  if (req.user.role !== 'admin') throw new Error('Unauthorized');
  User.delete(id);
});

// Short-lived tokens with refresh
jwt.sign({ userId }, secret, { expiresIn: '15m' });
```

### 5. Rate Limiting & DoS Protection

**❌ VULNERABLE:**
```javascript
// No rate limiting
app.post('/api/login', (req, res) => {
  authenticateUser(req.body);
});
```

**✅ PROTECTED:**
```javascript
// Rate limit per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.post('/api/login', limiter, (req, res) => {
  authenticateUser(req.body);
});
```

### 6. HTTPS & Secure Headers

**✅ ALWAYS:**
```javascript
// Force HTTPS
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security headers
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true 
}));
```

---

## ⚡ **PERFORMANCE BEST PRACTICES**

### 1. Database Optimization

**❌ SLOW (N+1 Query Problem):**
```javascript
// Queries database multiple times
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
  // This queries database for EACH user!
}
```

**✅ FAST (Eager Loading):**
```javascript
// Single optimized query
const users = await User.findAll({
  include: ['posts'],  // Load relations in one query
  select: ['id', 'email', 'name'] // Only select needed fields
});
```

### 2. Caching Strategy

**❌ NO CACHING:**
```javascript
app.get('/top-products', async (req, res) => {
  // Queries database every time
  const products = await Product.findAll({
    where: { featured: true },
    limit: 10
  });
  res.json(products);
});
```

**✅ WITH CACHING:**
```javascript
// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

app.get('/top-products', async (req, res) => {
  const cached = cache.get('top_products');
  if (cached) return res.json(cached);
  
  const products = await Product.findAll({
    where: { featured: true },
    limit: 10
  });
  
  cache.set('top_products', products);
  res.json(products);
});
```

### 3. Connection Pooling

**❌ BAD:**
```javascript
// Creating new connection for each request
const connection = mysql.createConnection(config);
connection.query(...);
connection.end();
```

**✅ GOOD:**
```javascript
// Reuse connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

pool.query(...); // Reuses connections automatically
```

### 4. Async Operations & Concurrency

**❌ SEQUENTIAL (SLOW):**
```javascript
// Executes one at a time
const user = await fetchUser(id);
const posts = await fetchPosts(user.id);
const comments = await fetchComments(posts[0].id);
// Total time: user + posts + comments
```

**✅ PARALLEL (FAST):**
```javascript
// Executes simultaneously
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
]);
// Total time: max(user, posts, comments)
```

### 5. Pagination for Large Results

**❌ BAD:**
```javascript
// Returns all 1 million records
const users = await User.findAll();
res.json(users);
```

**✅ GOOD:**
```javascript
// Paginate results
const page = req.query.page || 1;
const limit = 20;
const offset = (page - 1) * limit;

const { rows, count } = await User.findAndCountAll({
  offset,
  limit,
  order: [['createdAt', 'DESC']]
});

res.json({
  data: rows,
  total: count,
  page,
  pages: Math.ceil(count / limit)
});
```

### 6. Lazy Loading & Code Splitting

**❌ LOADS EVERYTHING:**
```javascript
// Loads entire app for every route
import * as AllModules from './modules';
```

**✅ LOAD ON DEMAND:**
```javascript
// Load only what's needed
const AdminModule = lazy(() => import('./modules/admin'));
const ReportModule = lazy(() => import('./modules/reports'));
```

---

## 🧹 **CODE QUALITY BEST PRACTICES**

### 1. Keep Functions Small & Focused

**❌ TOO LARGE:**
```javascript
// 200+ lines doing multiple things
async function processUserRegistration(req, res) {
  // Validate input
  // Hash password
  // Create user
  // Send email
  // Generate JWT
  // Set cookie
  // Log to analytics
  // ... more code
}
```

**✅ SINGLE RESPONSIBILITY:**
```javascript
// Small, focused functions
async function validateUserInput(data) { ... }
async function createUserAccount(email, hashedPassword) { ... }
async function sendWelcomeEmail(email) { ... }
async function generateAuthToken(userId) { ... }

async function registerUser(req, res) {
  const validated = await validateUserInput(req.body);
  const user = await createUserAccount(validated.email, validated.password);
  await sendWelcomeEmail(user.email);
  const token = await generateAuthToken(user.id);
  res.json({ user, token });
}
```

### 2. DRY (Don't Repeat Yourself)

**❌ REPETITIVE:**
```javascript
// Email validation repeated everywhere
if (!email.includes('@')) throw new Error('Invalid email');
if (email.length < 5) throw new Error('Email too short');

// Password validation repeated everywhere
if (password.length < 8) throw new Error('Password too short');
if (!/[A-Z]/.test(password)) throw new Error('Need uppercase');
```

**✅ REUSABLE FUNCTIONS:**
```javascript
// Validation functions
function isValidEmail(email) {
  return email.includes('@') && email.length >= 5;
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password);
}

// Use everywhere
if (!isValidEmail(email)) throw new Error('Invalid email');
if (!isValidPassword(password)) throw new Error('Invalid password');
```

### 3. Meaningful Variable Names

**❌ UNCLEAR:**
```javascript
const d = new Date();
const u = await getUser(id);
const x = u.p * 0.1;
const temp = [];
```

**✅ CLEAR:**
```javascript
const currentDate = new Date();
const user = await getUser(id);
const discountAmount = user.price * 0.1;
const validatedEmails = [];
```

### 4. Remove Dead Code

**❌ CLUTTERED:**
```javascript
// Old code commented out
// const oldLogic = async () => { ... };
// const result = await oldLogic();

// Unused variables
const tempData = getSomeData();

// Unused imports
import { unusedFunction } from './utils';
```

**✅ CLEAN:**
```javascript
// Remove commented code (use git history if needed)
// Remove unused variables
// Remove unused imports

// Only keep active code
```

### 5. Proper Error Messages

**❌ UNHELPFUL:**
```javascript
throw new Error('Error');
throw new Error('Failed');
console.error(error);
```

**✅ HELPFUL:**
```javascript
throw new Error('User not found with ID: 123. Check user creation endpoint.');
throw new Error('Failed to send email to user@example.com: SMTP timeout after 5s');
console.error('[UserService] Error fetching user:', error.message);
```

---

## 🧪 **TESTING BEST PRACTICES**

### 1. Test Coverage

**❌ NO TESTS:**
```javascript
// No test file exists
function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100);
}
```

**✅ TESTED:**
```javascript
describe('calculateDiscount', () => {
  it('should calculate 10% discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });
  
  it('should handle 0 discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
  
  it('should handle invalid inputs', () => {
    expect(() => calculateDiscount(-100, 10)).toThrow();
  });
});
```

### 2. Happy Path + Edge Cases

**❌ INCOMPLETE:**
```javascript
test('should create user', async () => {
  const user = await User.create({ email: 'test@example.com' });
  expect(user.id).toBeDefined();
});
// Only tests happy path!
```

**✅ COMPREHENSIVE:**
```javascript
describe('User.create', () => {
  it('should create user with valid email', async () => {
    const user = await User.create({ email: 'test@example.com' });
    expect(user.id).toBeDefined();
  });
  
  it('should reject invalid email', async () => {
    expect(() => User.create({ email: 'invalid' })).toThrow();
  });
  
  it('should reject duplicate email', async () => {
    await User.create({ email: 'test@example.com' });
    expect(() => User.create({ email: 'test@example.com' })).toThrow();
  });
  
  it('should handle null/undefined', async () => {
    expect(() => User.create({ email: null })).toThrow();
  });
});
```

---

## 📝 **DOCUMENTATION BEST PRACTICES**

### 1. API Documentation

**❌ UNDOCUMENTED:**
```javascript
app.post('/users', (req, res) => { ... });
```

**✅ DOCUMENTED:**
```javascript
/**
 * POST /users
 * Creates a new user account
 * 
 * @param {string} email - User's email (required)
 * @param {string} password - Password, min 8 chars (required)
 * @param {string} name - Full name (optional)
 * 
 * @returns {Object} { id, email, name, createdAt }
 * @throws {400} Invalid email format
 * @throws {409} Email already exists
 * @throws {422} Password too weak
 * 
 * @example
 * POST /users
 * { "email": "user@example.com", "password": "SecurePass123" }
 * Response: { "id": 1, "email": "user@example.com", ... }
 */
app.post('/users', (req, res) => { ... });
```

### 2. README with Setup Instructions

**✅ COMPLETE README:**
```markdown
# Project Name

## Overview
What this project does

## Tech Stack
- Node.js 18+
- PostgreSQL 14+
- React 18+

## Quick Start
1. Clone repo
2. Copy .env.example to .env
3. npm install
4. npm run dev

## API Documentation
See /docs/API.md

## Common Issues
See /docs/TROUBLESHOOTING.md
```

---

## 🔍 **DEBUGGING & MONITORING BEST PRACTICES**

### 1. Meaningful Logging

**❌ UNHELPFUL:**
```javascript
console.log('error');
console.log('data:', data);
```

**✅ HELPFUL:**
```javascript
console.error('[UserService] Error creating user:', error.message);
console.log('[Database] Query executed in 45ms: SELECT * FROM users');
console.warn('[Auth] Failed login attempt from IP 192.168.1.1');
```

### 2. Structured Errors

**❌ GENERIC:**
```javascript
throw new Error('Something went wrong');
```

**✅ INFORMATIVE:**
```javascript
throw new ApplicationError({
  code: 'USER_NOT_FOUND',
  message: 'User with ID 123 not found',
  statusCode: 404,
  details: { userId: 123, searchedAt: new Date() }
});
```

### 3. Health Checks

**✅ GOOD:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.connected ? 'ok' : 'down',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

---

## 🚀 **DEPLOYMENT & ENVIRONMENT BEST PRACTICES**

### 1. Environment Variables

**❌ HARDCODED:**
```javascript
const DB_HOST = 'localhost';
const API_KEY = 'sk-123456';
const DEBUG = true;
```

**✅ ENVIRONMENT-BASED:**
```javascript
const DB_HOST = process.env.DB_HOST || 'localhost';
const API_KEY = process.env.API_KEY;
const DEBUG = process.env.NODE_ENV === 'development';

// Validate required env vars
if (!API_KEY) {
  throw new Error('Missing required env var: API_KEY');
}
```

### 2. Configuration Management

**✅ GOOD:**
```javascript
const config = {
  development: {
    db: 'postgres://localhost/myapp',
    logLevel: 'debug',
    cache: false
  },
  production: {
    db: process.env.DATABASE_URL,
    logLevel: 'info',
    cache: true
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
```

---

## 📋 **QUICK CHECKLIST - Before Pushing Code**

- ✅ No hardcoded secrets or API keys
- ✅ Input validation on all user inputs
- ✅ Error handling with try-catch
- ✅ Meaningful error messages
- ✅ No N+1 queries
- ✅ Pagination for large datasets
- ✅ Tests written for new features
- ✅ Code reviewed by teammate
- ✅ No console.log() in production code
- ✅ Environment variables configured
- ✅ Dependencies up to date
- ✅ No unused imports/variables
- ✅ Documentation updated
- ✅ Performance tested