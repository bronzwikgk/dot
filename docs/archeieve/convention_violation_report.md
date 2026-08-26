# Convention Violation Report

## Date: 2026-08-25
## Validator: validate_conventions.js

---

## Summary

| Violation Type | Count | Severity |
|:---|:---|:---|
| N1: camelCase/PascalCase | ~150+ | Error |
| N2: Duplicate names | ~100+ | Error |
| C2: forEach | ~20 | Error |
| C3: Arrow functions | ~80+ | Error |
| C5: require() | ~10 | Error |
| F1: JS not in code/ | ~20 | Error |
| D1: Object in dataset | ~8 | Error |
| D3: Missing type_names | ~3 | Error |

---

## Files with Most Violations

1. `code/plugins/code_shared_action_entity_v3_1_0_draft.js` - ~60 violations
2. `code/utilities/code_shared_entity_validator_v3_0_0_draft.js` - ~50 violations
3. `code/utilities/test_generation/code_shared_code_inspector_v2_2_0_draft.js` - ~50 violations
4. `code/utilities/test_generation/code_shared_test_generation_v2_2_0_draft.js` - ~40 violations
5. `code/plugins/code_shared_runner_v3_0_0_draft.js` - ~30 violations

---

## Violation Categories

### Naming Violations (N1, N2)
**Issue:** Code uses camelCase/PascalCase and has duplicate variable names.

**Examples:**
- `created_at` should be `created_at` (already correct)
- `SNAPSHOT_DIR` should be `snapshot_dir`
- `out` is used multiple times in same scope

**Fix:** Rename all variables to snake_case, rename duplicates with prefixes/suffixes.

### Coding Violations (C2, C3, C5)
**Issue:** Code uses forEach, arrow functions, and require().

**Examples:**
- `.forEach((item) => {...})` should be `for (const item of items) {...}`
- `() => {...}` should be `function() {...}`
- `require('fs')` should be `import { readFileSync } from 'fs'`

**Fix:** Convert all forEach to for...of, convert arrow functions to function expressions, convert require to import.

### Structure Violations (F1)
**Issue:** JS files are in wrong folders.

**Examples:**
- `code/plugins/code_shared_*.js` is correct
- `code/utilities/code_shared_*.js` is correct
- Root level `.js` files should be in `code/`

**Fix:** Move JS files to appropriate folders.

### Dataset Violations (D1, D3)
**Issue:** Datasets contain objects or missing type_names.

**Examples:**
- `{ id: 'test', ... }` should be flat strings
- Missing `const type_names = [...]`

**Fix:** Convert to flat arrays, add type_names.

---

## Decision Tree for Handling Violations

```
Violation Detected
├── Is it an Error?
│   ├── Yes → Stop work
│   │   ├── Can fix immediately?
│   │   │   ├── Yes → Fix and continue
│   │   │   └── No → Report to user and wait
│   │   └── Log violation
│   └── No → Is it a Warning?
│       ├── Yes → Log violation
│       │   ├── Can fix immediately?
│       │   │   ├── Yes → Fix and continue
│       │   │   └── Continue work, fix later
│       │   └── Log for later
│       └── No → Log and continue
└── Report violation
```

---

## Recommendations

1. **Immediate:** Fix naming violations in new code only
2. **Short-term:** Refactor existing code to comply with conventions
3. **Medium-term:** Add pre-commit hooks to catch violations
4. **Long-term:** Automated code formatting and validation

---

## Notes

- The validation script itself has violations (it's a tool, not production code)
- Some violations may be intentional (e.g., test code)
- Documentation files may have different rules than code files
