# Code vs Documentation Analysis

## Critical Conflicts

### 1. Logger Metrics Snapshot Inconsistency
**Documentation** (`code_shared_logger_v3_0_0_draft.md`):
```js
metrics.snapshot();
// [["hits", 2], ["gauge:load", 7]]
```

**Actual Code** (`code_shared_logger_v3_0_0_draft.js`):
```js
snapshot() {
  return {
    counters: Array.from(this.counters.entries()),
    gauges: Array.from(this.gauges.entries()),
    timers: Array.from(this.timers.entries())
  };
}
```

**Issue**: Documentation shows flat array, code returns object with separate arrays. This is a breaking API mismatch.

### 2. Action Entity v3.0.0 Constructor Signature
**Documentation** (`code_shared_action_entity_v3_0_0_draft.md`):
```js
const tasks = new action_entity("tasks", {
  schema: {
    title: { required: true },
    status: { enum: ["open", "closed"] },
    due: { type: "date" }
  }
});
```

**Actual Code** (`code_shared_action_entity_v3_0_0_draft.js`):
```js
constructor(name, config = {}, driver = null, options = {}) {
```

**Issue**: Documentation shows 2 parameters, code accepts 4. No mention of driver or options in docs.

### 3. Runner Error Codes Inconsistent
**Documentation** mentions `[SYS-06]` errors for invalid steps/tasks.

**Actual Code** uses:
- `[SYS-04]` for action limit exceeded
- `[SYS-05]` for nesting depth exceeded
- `[SYS-06]` for plan validation errors

**Issue**: Documentation doesn't mention `[SYS-04]` or `[SYS-05]` error codes.

## Documentation Gaps

### 1. Action Entity v3.1.0 Missing Methods
**Documented but not implemented**:
- `diff_entities(before, after)`
- `bump_version(entity, level)`
- `export_entity(entity)`
- `import_entity(text)`

**Partial implementations**:
- `validate_graph()` - exists but not fully documented
- `get_dependencies(id)` - exists but behavior differs from docs

### 2. Validator Missing Methods
**Documented but not in code**:
- `validate_schema(data, schema)` - only basic validation exists
- `validate_import_format(name)` - exists but not documented
- `validate_cell_status(status)` - exists but not documented

### 3. Runner Missing Features
**Documented but not implemented**:
- Parallel DAG execution (docs say "dependency-ordered tasks" but code runs sequentially)
- Task registry class instantiation (partially implemented)
- `TERMINATE` status preservation (exists but not documented)

### 4. Entity Runner Incomplete
**Documentation** says it:
- "records timing plus diagnostics"
- "registered stages or an explicit requested stage list"

**Code** has:
- Timing collection ✓
- Diagnostics ✓
- Stage list support ✓
- Missing: Error recovery modes, detailed timing breakdown

## Naming Convention Violations

### 1. Class Naming
**Convention**: `snake_case` for classes

**Violations**:
- `action_entity` (correct)
- `entity_registry` (correct)
- `collection_util` (correct)
- `text_util` (correct)
- `vector_math_util` (correct)
- `stats_util` (correct)
- `markdown_pipeline` (correct)
- `entity_parser` (correct)
- `entity_reasoner` (correct)
- `entity_validator` (correct)
- `entity_runner` (correct)
- `app_generator` (correct)
- `runner` (should be `workflow_runner` for consistency)

### 2. Method Naming
**Convention**: `snake_case` for methods

**Violations**:
- `execute_action` (correct)
- `topological_sort` (correct)
- `_walk_ast` (private, acceptable)
- `_walk_dag` (private, acceptable)
- `generate_id` (correct)
- `get_timestamp` (correct)
- `clone_value` (correct - but should be `clone_record`)

### 3. Variable Naming
**Convention**: `snake_case` for variables

**Violations**:
- `DEFAULT_ACTION_LIMIT` (constant, acceptable)
- `DEFAULT_DEPTH_LIMIT` (constant, acceptable)
- `session_counter` (correct)
- `active_sessions` (correct)
- `cache_limit` (correct)

## Implementation Issues

### 1. Memory Driver Inconsistency
**v3.0.0** (`code_shared_action_entity_v3_0_0_draft.js`):
```js
generate_id() {
  this.id_counter += 1;
  return `${this.name}_${this.id_counter}`;
}
```

**v3.1.0** (`code_shared_action_entity_v3_1_0_draft.js`):
```js
generate_id(prefix = this.name) {
  this.id_counter += 1;
  return `${prefix}_${this.id_counter}`;
}
```

**Issue**: Different signatures, different behavior.

### 2. Cache Implementation Differences
**v3.0.0**: Simple LRU with defensive copies
**v3.1.0**: Enhanced with derived fields and deep merge

**Issue**: Incompatible cache behaviors between versions.

### 3. Validation Depth
**v3.0.0**: Basic schema validation only
**v3.1.0**: Full entity validation with relationships, policies, contracts

**Issue**: Major feature gap not clearly documented.

### 4. Query Return Shape
**v3.0.0**:
```js
return { ok: true, data: records.map(record => ({ ...record })) };
```

**v3.1.0**:
```js
return Array.isArray(result) ? expanded.map(clone_value) : { ...result, data: expanded.map(clone_value) };
```

**Issue**: Inconsistent return shapes between versions.

## Missing Test Coverage

### 1. No Unit Tests
- No `*.test.js` files exist
- Only smoke checks mentioned in docs
- No test runner configuration

### 2. Missing Edge Case Tests
- Null/undefined inputs
- Empty arrays/objects
- Boundary conditions
- Error handling paths

### 3. No Integration Tests
- Cross-component interaction tests
- End-to-end workflow tests
- Performance tests

## Documentation Inconsistencies

### 1. Version Numbering
**Files use**: `v3_0_0_draft`, `v3_1_0_draft`
**Docs reference**: `v3.0.0`, `v3.1.0`

**Issue**: Inconsistent version format.

### 2. Import Path References
**Documentation** references:
```js
import { action_entity } from './dot/code/plugins/code_shared_action_entity_v3_1_0_draft.js';
```

**Actual imports** in code:
```js
import { entity_validator } from "../utilities/code_shared_entity_validator_v3_0_0_draft.js";
```

**Issue**: Doc paths don't match actual import structure.

### 3. Feature Status
**Documentation** says:
- "Full unit tests are not yet generated"
- "Schema enforcement is still basic"

**But doesn't clarify**:
- Which features are complete vs planned
- What "basic" means quantitatively
- Timeline for completion

## Security Concerns

### 1. Banned Word Validation
**Issue**: Banned words list is not documented or exposed.

### 2. Input Sanitization
**Issue**: No HTML/script injection prevention beyond basic escaping.

### 3. Rate Limiting
**Issue**: Action budget exists but no documentation on configuration.

## Performance Issues

### 1. No Caching Strategy
- Cache is LRU but no documentation on optimal sizes
- No cache invalidation strategy
- No cache hit/miss metrics

### 2. Memory Usage
- In-memory storage only
- No memory limits documented
- No garbage collection strategy

### 3. Query Performance
- Linear scan for all queries
- No indexing strategy
- No pagination support

## Recommendations

### Immediate Fixes
1. Fix logger snapshot API to match documentation
2. Document all error codes (`[SYS-04]`, `[SYS-05]`)
3. Add missing method implementations for v3.1.0
4. Standardize version format in filenames

### Short-term Improvements
1. Add comprehensive unit tests
2. Document all configuration options
3. Add performance benchmarks
4. Create integration test suite

### Long-term Enhancements
1. Add TypeScript definitions
2. Implement proper indexing
3. Add persistence drivers
4. Create monitoring dashboards