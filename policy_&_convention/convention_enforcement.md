# Convention Enforcement
## How the system prevents violations before they happen

| property | value |
| :--- | --- |
| document_id | convention_enforcement_an_app_v1 |
| version | 1.0.0 |
| status | active |

---

## 1. Banned Words

These words are FORBIDDEN in all code, docs, and names:

| banned | replacement | reason |
|--------|-------------|--------|
| engine | processor or system | not in ontology |
| class | factory function | r6 convention |
| get / set | use descriptive names | unclear intent |
| data | use specific name | too generic |
| handler | use specific name | too generic |
| util | use specific name | too generic |

---

## 2. Enforcement Points

### 2.1 Before File Creation
```
CHECK: filename does not contain banned words
CHECK: filename is snake_case
CHECK: filename matches taxonomy pattern
IF FAIL: rename automatically
```

### 2.2 Before Code Generation
```
CHECK: generated code has no banned words
CHECK: generated code uses factory pattern
CHECK: generated code has JSDoc header
IF FAIL: regenerate with corrections
```

### 2.3 Before Commit
```
CHECK: all files pass watchman rules
CHECK: no convention violations
CHECK: all tests pass
IF FAIL: block commit, report violations
```

### 2.4 Before Output
```
CHECK: output follows all cv-rules
CHECK: output uses approved vocabulary
CHECK: output has proper naming
IF FAIL: regenerate output
```

---

## 3. Self-Enforcing Rules

The system should NOT check conventions after the fact. It should:

1. Use a vocabulary filter that blocks banned words at input
2. Use a naming function that always produces snake_case
3. Use a template system that always generates valid code
4. Use a validation function that runs before any output

### Vocabulary Filter
```javascript
function filter_banned_words(text) {
  return text
    .replace(/engine/gi, 'system')
    .replace(/\bclass\b/g, 'factory')
    .replace(/\bget_\w+/g, function(m) { return m.replace('get_', 'fetch_'); })
    .replace(/\bset_\w+/g, function(m) { return m.replace('set_', 'update_'); });
}
```

### Naming Function
```javascript
function to_snake_case(name) {
  return name
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_/, '');
}
```

### Validation Gate
```javascript
function validate_before_output(content) {
  var banned = ['engine', 'class', 'getData', 'setData'];
  for (var i = 0; i < banned.length; i++) {
    if (content.indexOf(banned[i]) !== -1) {
      return { valid: false, violation: banned[i] };
    }
  }
  return { valid: true };
}
```

---

## 4. Convention Checklist (run before EVERY output)

| # | check | auto-fix |
|---|-------|----------|
| 1 | no banned words | replace with approved term |
| 2 | snake_case naming | convert automatically |
| 3 | JSDoc header present | generate from entity |
| 4 | factory pattern | convert if class found |
| 5 | no default exports | convert to named |
| 6 | no external deps | use internal only |
| 7 | handlers never throw | wrap in try/catch |
| 8 | types ratified first | check ontology |

**The system prevents violations. It doesn't detect them after.**
