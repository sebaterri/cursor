# Making Your Agents Smarter with Intent Recognition

## The Problem

Your agents currently:
- ❌ Search for code when you just say "thanks"
- ❌ Pull in irrelevant context for simple questions
- ❌ Make assumptions about technical issues that don't exist
- ❌ Overthink simple conversations

## The Solution: Intent Recognition

This system analyzes user messages BEFORE taking action to understand:
1. **What type of request is it?** (conversation, question, task, bug, etc.)
2. **What entities are involved?** (files, technologies, errors)
3. **What tools are needed?** (search, read, edit, execute)
4. **What to AVOID doing?** (unnecessary searches, assumptions)

## How It Works

### Step 1: Analyze Intent

```javascript
const { analyzeUserIntent } = require('./lib/intentRecognition');

// User says: "Thanks!"
const intent = analyzeUserIntent("Thanks!", conversationHistory);

console.log(intent);
// {
//   type: 'conversation',
//   confidence: 0.5,
//   entities: {},
//   context: {
//     requiresCodeSearch: false,
//     requiresFileRead: false,
//     requiresExecution: false,
//     isFollowUp: false
//   },
//   suggestedTools: []  // NO TOOLS NEEDED!
// }
```

### Step 2: Use Response Plan

```javascript
const { IntentRecognizer } = require('./lib/intentRecognition');

const intent = analyzeUserIntent(userMessage, conversationHistory);
const plan = IntentRecognizer.generateResponsePlan(intent);

if (intent.type === 'conversation') {
  // Just respond - don't search anything!
  return "You're welcome! Let me know if you need anything else.";
}

if (plan.shouldSearch) {
  // Now it makes sense to search
  await searchCodebase(intent.entities.files);
}
```

## Integration Examples

### Example 1: Chat Agents

```javascript
// In your agent handler
app.post('/api/chat/sessions/:id/messages', async (req, res) => {
  const { content } = req.body;
  
  // STEP 1: Analyze intent FIRST
  const intent = analyzeUserIntent(content, chatHistory);
  
  // STEP 2: Act based on intent
  if (intent.type === 'conversation') {
    // Simple response - no code search needed
    return res.json({ 
      response: "Got it! Anything else I can help with?" 
    });
  }
  
  if (intent.type === 'bug_report' && intent.entities.errorTypes) {
    // Search for specific errors
    await searchForErrors(intent.entities.errorTypes);
  }
  
  if (intent.type === 'task' && intent.entities.files) {
    // Read specific files
    await readFiles(intent.entities.files);
  }
  
  // Continue with agent processing...
});
```

### Example 2: Background Agents

```javascript
// In your background agent
async function processAgentTask(task) {
  const intent = analyzeUserIntent(task.description, task.history);
  const plan = IntentRecognizer.generateResponsePlan(intent);
  
  // Only search if actually needed
  if (plan.shouldSearch) {
    await searchCodebase(intent.entities);
  }
  
  // Only read files if mentioned
  if (plan.shouldRead && intent.entities.files) {
    await readFiles(intent.entities.files);
  }
  
  // Execute based on intent type
  switch (intent.type) {
    case 'task':
      return await executeTask(intent);
    case 'bug_report':
      return await debugIssue(intent);
    case 'question':
      return await answerQuestion(intent);
    default:
      return await respondToConversation(intent);
  }
}
```

## Intent Types Explained

### 1. **conversation** (Most Important!)
**Triggers**: "thanks", "ok", "cool", "awesome", "yes", "no"
**Action**: Just respond - NO code search, NO file reading
**Example**: "Thanks!" → Just say "You're welcome!"

### 2. **question**
**Triggers**: "what", "how", "why", "?"
**Action**: Answer the question, search only if technical
**Example**: "What does this function do?" → Read that specific function

### 3. **bug_report**
**Triggers**: "error", "bug", "broken", "not working"
**Action**: Search for errors, read relevant files
**Example**: "Getting a 404 error" → Search for 404 handling

### 4. **task**
**Triggers**: "fix", "update", "change", "refactor"
**Action**: Search code, read files, make edits
**Example**: "Fix the login bug" → Search login code, fix it

### 5. **feature_request**
**Triggers**: "add", "create", "build", "implement"
**Action**: Search similar code, create new files
**Example**: "Add a button component" → Create Button.tsx

## What Gets Extracted

### Files
```javascript
"Fix the bug in App.tsx" 
→ entities.files = ['App.tsx']
```

### Technologies
```javascript
"The React component is broken"
→ entities.technologies = ['react']
```

### Actions
```javascript
"Fix and optimize the code"
→ entities.actions = ['fix', 'optimize']
```

### Errors
```javascript
"Getting a 404 error"
→ entities.errorTypes = ['404']
```

## The Key: Avoid Actions

This is what makes agents smart - knowing what NOT to do!

```javascript
const plan = IntentRecognizer.generateResponsePlan(intent);

console.log(plan.avoidActions);
// For conversation:
// [
//   'Do not search for unrelated code',
//   'Do not make assumptions about technical issues',
//   'Do not pull in irrelevant context'
// ]
```

## Real-World Examples

### ❌ Before (Dumb Agent)
```
User: "Thanks!"
Agent: *searches for "thanks" in codebase*
Agent: *reads authentication files*
Agent: *analyzes websocket connections*
Agent: "I found references to 'thanks' in your README..."
```

### ✅ After (Smart Agent)
```
User: "Thanks!"
Agent: *analyzes intent → type: 'conversation'*
Agent: *sees suggestedTools: []*
Agent: "You're welcome! 😊"
```

### ❌ Before (Dumb Agent)
```
User: "How did you know to do that?"
Agent: *searches for "know" and "do" in codebase*
Agent: *reads random files*
Agent: "I found 47 occurrences of 'know' in your code..."
```

### ✅ After (Smart Agent)
```
User: "How did you know to do that?"
Agent: *analyzes intent → type: 'question'*
Agent: *sees no technical entities*
Agent: *responds directly without code search*
Agent: "I recognized the pattern from our previous conversation..."
```

### ✅ Smart Agent (Actual Task)
```
User: "Fix the bug in App.tsx where the form doesn't submit"
Agent: *analyzes intent → type: 'bug_report'*
Agent: *entities: { files: ['App.tsx'], actions: ['fix'] }*
Agent: *suggestedTools: ['read_file', 'grep_search', 'edit']*
Agent: *reads App.tsx*
Agent: *searches for form submit handlers*
Agent: *fixes the bug*
Agent: "Fixed! The form was missing the onSubmit handler."
```

## Quick Integration Checklist

1. ✅ Import intent recognition in your agent handler
2. ✅ Analyze intent BEFORE doing anything else
3. ✅ Check if type is 'conversation' → respond without tools
4. ✅ Use suggestedTools array to know what tools to use
5. ✅ Use avoidActions to know what NOT to do
6. ✅ Only search/read when actually needed

## Testing Your Integration

```javascript
// Test cases
const testCases = [
  { input: "Thanks!", expected: 'conversation', tools: [] },
  { input: "How are you?", expected: 'conversation', tools: [] },
  { input: "Fix App.tsx", expected: 'task', tools: ['read_file', 'edit'] },
  { input: "Getting a 404 error", expected: 'bug_report', tools: ['grep_search'] },
  { input: "Add a button", expected: 'feature_request', tools: ['edit'] }
];

testCases.forEach(test => {
  const intent = analyzeUserIntent(test.input);
  console.log(`Input: "${test.input}"`);
  console.log(`Type: ${intent.type} (expected: ${test.expected})`);
  console.log(`Tools: ${intent.suggestedTools.join(', ')}`);
  console.log('---');
});
```

## The Result

Your agents will now:
- ✅ Respond naturally to conversations
- ✅ Only search when actually needed
- ✅ Focus on relevant files and technologies
- ✅ Avoid making assumptions
- ✅ Be more like me! 😄

## Next Steps

1. Integrate into your main agent handler
2. Test with simple conversations first
3. Gradually add to all agent types
4. Monitor improvements in response quality
5. Adjust patterns as needed

Your agents will be MUCH smarter! 🚀
