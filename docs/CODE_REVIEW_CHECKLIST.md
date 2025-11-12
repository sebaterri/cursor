# Code Review Checklist - For Agents to Use When Auditing Code

This is the **systematic checklist** agents should follow when analyzing and reviewing code.

---

## 🔒 **SECURITY AUDIT CHECKLIST**

### Input & Output
- [ ] All user inputs are validated and sanitized
- [ ] SQL queries use parameterized statements (never string concatenation)
- [ ] API responses properly escape data to prevent XSS
- [ ] File uploads validate file type and size
- [ ] URL redirects validate against whitelist

### Authentication & Authorization
- [ ] Passwords are hashed with salt (bcrypt, scrypt, or Argon2)
- [ ] JWT tokens have expiration times (not lifetime tokens)
- [ ] Session tokens are cryptographically secure
- [ ] Protected routes check user authorization
- [ ] Admin endpoints require admin role validation
- [ ] API keys are never logged or exposed

### Secrets & Configuration
- [ ] No API keys or secrets in source code
- [ ] No secrets in comments or documentation
- [ ] Environment variables used for all secrets
- [ ] `.env` file is in `.gitignore`
- [ ] Secret rotation mechanism exists
- [ ] Default credentials changed from package defaults

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS/TLS enforced for all data in transit
- [ ] Sensitive data not logged (passwords, tokens, PII)
- [ ] Database connections use SSL
- [ ] CORS properly configured (not `*` for everything)
- [ ] Sensitive data masked in logs

### Error Handling & Information Disclosure
- [ ] Error messages don't leak system information
- [ ] Stack traces not shown to end users
- [ ] Internal error codes logged, generic messages to users
- [ ] Failed login attempts don't reveal if email exists
- [ ] Rate limiting prevents brute force attacks

### Dependencies & Vulnerabilities
- [ ] Dependency versions are locked or pinned
- [ ] No deprecated dependencies
- [ ] Regular updates checked (`npm audit`, `pip audit`)
- [ ] Known vulnerabilities patched immediately
- [ ] Minimal dependencies (avoid bloat)

### Infrastructure & Deployment
- [ ] HTTPS/TLS enabled
- [ ] Security headers set (X-Frame-Options, CSP, etc.)
- [ ] CORS whitelist is restrictive
- [ ] Rate limiting implemented
- [ ] DDoS protection in place
- [ ] WAF (Web Application Firewall) rules configured
- [ ] Database backups encrypted

---

## ⚡ **PERFORMANCE AUDIT CHECKLIST**

### Database Queries
- [ ] No N+1 query problems (verify with query logs)
- [ ] Proper indexes on frequently queried fields
- [ ] SELECT queries specify needed columns (not *)
- [ ] Lazy loading used for heavy relationships
- [ ] Connection pooling implemented
- [ ] Query timeouts configured
- [ ] Database statistics updated

### Caching Strategy
- [ ] Frequently accessed data is cached
- [ ] Cache invalidation strategy documented
- [ ] Cache TTL appropriately configured
- [ ] Cache key collisions prevented
- [ ] Distributed cache for horizontal scaling
- [ ] Cache hit rates monitored

### API & Network
- [ ] API responses compressed (gzip/brotli)
- [ ] Pagination implemented for large datasets
- [ ] Unnecessary API calls eliminated
- [ ] Request/response sizes minimized
- [ ] Batch operations for bulk processing
- [ ] Timeouts configured for API calls

### Frontend Performance
- [ ] Code splitting/lazy loading implemented
- [ ] Unused dependencies removed
- [ ] Bundle size monitored
- [ ] Images optimized and lazy loaded
- [ ] CSS is minified
- [ ] JavaScript is minified/bundled

### Async & Concurrency
- [ ] Long operations run asynchronously
- [ ] Promise.all() used for parallel operations
- [ ] Race conditions prevented with locks/transactions
- [ ] Background jobs don't block main thread
- [ ] Worker threads used for CPU-intensive tasks

### Monitoring & Profiling
- [ ] Slow queries logged and monitored
- [ ] Performance metrics tracked
- [ ] Response times measured
- [ ] Database query times tracked
- [ ] Memory usage monitored
- [ ] CPU usage profiled

---

## 🧹 **CODE QUALITY AUDIT CHECKLIST**

### Readability & Maintainability
- [ ] Code is self-documenting (clear variable names)
- [ ] Functions have single responsibility
- [ ] Functions are reasonably sized (< 50 lines ideally)
- [ ] Nesting depth is manageable (< 4 levels)
- [ ] Complex logic has explanatory comments
- [ ] No magic numbers (use named constants)
- [ ] No misleading comments

### DRY (Don't Repeat Yourself)
- [ ] No significant code duplication
- [ ] Common logic extracted to utilities
- [ ] Configuration centralized
- [ ] Constants not duplicated

### Standards & Conventions
- [ ] Code follows language conventions
- [ ] Consistent naming (camelCase, snake_case, PascalCase)
- [ ] Consistent indentation and formatting
- [ ] Files organized logically
- [ ] No mixing of naming conventions

### Dependencies & Imports
- [ ] No circular dependencies
- [ ] No unused imports
- [ ] No unused variables
- [ ] Minimal external dependencies
- [ ] Dependencies are up-to-date and maintained

### Testing
- [ ] Unit tests exist for critical functions
- [ ] Edge cases are tested
- [ ] Error conditions are tested
- [ ] Test coverage > 70% (ideally > 80%)
- [ ] Integration tests for critical flows
- [ ] No skipped/pending tests (remove or fix)

### Logging
- [ ] Appropriate log levels used (error, warn, info, debug)
- [ ] Logs include context (service name, timestamp, user ID)
- [ ] Logs don't contain sensitive data
- [ ] No debug logs in production code
- [ ] Log aggregation configured

---

## 📚 **DOCUMENTATION AUDIT CHECKLIST**

### Code Documentation
- [ ] Complex algorithms explained
- [ ] Non-obvious decisions documented
- [ ] Edge cases documented
- [ ] Performance considerations noted
- [ ] Known issues/TODOs documented

### Function/Method Documentation
- [ ] Parameters documented
- [ ] Return values documented
- [ ] Exceptions/errors documented
- [ ] Examples provided for complex functions
- [ ] Deprecated methods marked

### API Documentation
- [ ] All endpoints documented
- [ ] Request/response formats shown
- [ ] Authentication requirements documented
- [ ] Error codes documented
- [ ] Rate limits documented
- [ ] Example requests/responses provided

### README
- [ ] Project purpose clear
- [ ] Setup instructions complete
- [ ] Tech stack listed
- [ ] How to run development environment
- [ ] How to run tests
- [ ] Common issues & troubleshooting
- [ ] Contributing guidelines

### Configuration
- [ ] Environment variables documented
- [ ] Configuration options explained
- [ ] Default values shown
- [ ] Required vs optional documented
- [ ] Sensitive config never logged

---

## 🛡️ **RELIABILITY & RESILIENCE CHECKLIST**

### Error Handling
- [ ] All error paths handled
- [ ] Meaningful error messages
- [ ] Error context preserved (original error included)
- [ ] No silent failures
- [ ] Errors logged appropriately
- [ ] User-facing errors don't expose internals

### Data Integrity
- [ ] Input validation before processing
- [ ] No data loss on errors
- [ ] Transactions for multi-step operations
- [ ] Rollback on failure
- [ ] Idempotent operations where possible

### Fault Tolerance
- [ ] Retry logic with exponential backoff
- [ ] Timeouts configured
- [ ] Circuit breakers for external services
- [ ] Graceful degradation when services fail
- [ ] Fallback mechanisms documented

### Availability
- [ ] No single points of failure
- [ ] Redundancy for critical services
- [ ] Health checks implemented
- [ ] Automatic recovery mechanisms
- [ ] Monitoring alerts configured

### Scalability
- [ ] Horizontal scaling possible
- [ ] No hard-coded limits
- [ ] Connection pooling configured
- [ ] Database indexes for growth
- [ ] Caching strategy for scale

---

## 🚀 **BEST PRACTICES AUDIT CHECKLIST**

### General Best Practices
- [ ] SOLID principles followed
- [ ] Design patterns used appropriately
- [ ] Anti-patterns identified and removed
- [ ] Code smells addressed
- [ ] Premature optimization avoided
- [ ] Comments explain WHY, not WHAT

### Security Best Practices
- [ ] Principle of least privilege
- [ ] Defense in depth
- [ ] Secure defaults
- [ ] Fail securely
- [ ] Security by design

### Performance Best Practices
- [ ] Optimized algorithms
- [ ] Efficient data structures
- [ ] Resource cleanup (connections, files)
- [ ] Memory leaks prevented
- [ ] Proper use of async/await

### Maintenance Best Practices
- [ ] Version control best practices
- [ ] Meaningful commit messages
- [ ] Feature branches for changes
- [ ] Code review before merge
- [ ] Deprecation warnings for API changes

---

## 📋 **SPECIFIC ISSUES TO LOOK FOR**

### Likely Bugs
- [ ] Off-by-one errors in loops
- [ ] Null pointer dereferences
- [ ] Race conditions
- [ ] Incorrect null/undefined checks
- [ ] Logic errors in conditionals
- [ ] Missing break/return statements
- [ ] Incorrect array operations

### Common Vulnerabilities (OWASP Top 10)
- [ ] Injection flaws
- [ ] Broken authentication
- [ ] Sensitive data exposure
- [ ] XML External Entities (XXE)
- [ ] Broken access control
- [ ] Security misconfiguration
- [ ] Cross-site scripting (XSS)
- [ ] Insecure deserialization
- [ ] Using components with known vulnerabilities
- [ ] Insufficient logging & monitoring

### Performance Problems
- [ ] Synchronous operations where async needed
- [ ] Missing indexes on database columns
- [ ] Unbounded queries
- [ ] Inefficient algorithms
- [ ] Memory leaks
- [ ] N+1 queries
- [ ] Cache misses on important data

---

## ✅ **AUDIT REPORT FORMAT**

When agents complete an audit, they should provide:

### 1. **Executive Summary**
- Overall code quality score (1-10)
- Number of critical issues
- Number of high priority issues
- Number of medium priority issues
- Estimated effort to fix

### 2. **Critical Issues** (Must fix before production)
- Issue title
- Location (file:line)
- Description
- Risk/Impact
- Recommended fix

### 3. **High Priority Issues** (Fix soon)
- Issue title
- Location (file:line)
- Description
- Recommendation

### 4. **Medium Priority Issues** (Should fix)
- Issue title
- Location (file:line)
- Brief description

### 5. **Low Priority Issues** (Nice to have)
- Issue title
- Suggestion

### 6. **Positive Findings**
- Well-implemented security practices
- Excellent performance optimizations
- Good test coverage
- Clean architecture

### 7. **Recommendations**
- High-impact improvements
- Technical debt to address
- Monitoring to add
- Documentation to create

---

## 🔍 **HOW AGENTS SHOULD USE THIS CHECKLIST**

1. **Before analyzing code**, load this checklist
2. **For each file**, go through relevant sections
3. **Document findings** with specificity (file:line)
4. **Prioritize issues** by severity
5. **Suggest fixes** with code examples
6. **Generate report** using the format above

**Example Issue Report:**
```
CRITICAL: SQL Injection vulnerability
Location: server/routes/user.js:45
Code: const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
Risk: Attacker can execute arbitrary SQL queries
Fix: Use parameterized query:
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [req.params.id]);
```