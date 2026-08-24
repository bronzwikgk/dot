# Git Integration - Shared

## Version 1.0.0

---

## 1. Purpose

This document defines how git is used for the **shared** projects repository (`dot`). This repo carries the reusable building blocks of the system: plugins (code needing global_context), utilities (pure functions), and pipeline templates. Git provides versioning, traceability, and recovery for all shared code.

---

## 2. Repository Model

| Aspect | Definition |
|:---|:---|
| Remote | `https://github.com/bronzwikgk/dot.git` |
| Content | Full code for each shared version: plugins, utilities, pipeline templates |
| Execution | Code here is imported by consuming apps (for example an_app); nothing executes in the repo itself |
| Versioning | One independent version line per major version |
| Default branch | `master` always holds the current latest stable version |

---

## 3. Branch Strategy

### 3.1 Model

Each major semantic version lives on its own long-lived branch containing the **full code of that version**. No development-flow branches (no develop, story, or feature branches).

| Branch | Content | Lifetime |
|:---|:---|:---|
| `v2` | Complete shared v2 code: plugins, utilities, pipelines | Lives until v2 is retired |
| `v3` | Complete shared v3 code | Created on major bump |
| `master` | Mirror of current latest stable version | Permanent |
| `wip_dot` | Work in progress; validated work promotes into the active version branch | Long-lived rolling |

### 3.2 Rules

| # | Rule |
|:---|:---|
| B1 | One branch per major version (`v2`, `v3`, ...) |
| B2 | Each branch is fully self-contained; clones of any branch work standalone |
| B3 | MINOR and PATCH changes are commits inside the existing version branch |
| B4 | MAJOR change creates a new branch from the final state of the previous one |
| B5 | Old version branches are frozen after the new major branch is created |
| B6 | No routine merges between version branches; port fixes deliberately via cherry-pick if needed |
| B7 | `master` fast-forwards to a version branch head exactly at each release |
| B8 | Every exact release is pinned with an annotated tag |
| B9 | All new work commits land on `wip_dot`; promote into the active version branch only after validation |

### 3.3 Structure Snapshot per Branch

```
shared/
├── code/
│   ├── plugins/      need global_context (runner, validator, runtime, policy_gate, ...)
│   └── utilities/    pure functions (tokenizer, parser, compiler, resolver, transformer)
├── pipelines/        MD templates defining usage of plugins and utilities
├── doc/              policies and guides (this file)
└── VERSION
```

---

## 4. Commit Convention

### 4.1 Message Format

```
<stage>(<scope>): <description>
```

### 4.2 Stage Prefixes

| Prefix | Stage | Example |
|:---|:---|:---|
| `discover` | Discover | `discover(initial): import utility and plugin code` |
| `define` | Define | `define(core): add plugin utility pipeline policy` |
| `design` | Design | `design(pipeline): draft template_find_information structure` |
| `develop` | Develop | `develop(utilities): add tokenizer edge case handling` |
| `deploy` | Deploy | `deploy(v2): prepare v2_0_0 release` |
| `deliver` | Deliver | `deliver(v2): finalize changelog for v2_0_0` |

### 4.3 Description Rules

| Rule | Description |
|:---|:---|
| R1 | Imperative mood ("add" not "added") |
| R2 | No capital first letter |
| R3 | No period at end |
| R4 | Max 72 characters |

---

## 5. Release Workflow

### 5.1 Minor or Patch Release (inside `vN`)

```bash
git checkout v2
# ... make changes, commit with stage convention ...
echo "2.1.0" > VERSION
git add .
git commit -m "deliver(v2): bump version to 2.1.0"
git tag -a v2_1_0 -m "Release 2.1.0"
git checkout master
git merge --ff-only v2
git push origin master v2 --tags
```

### 5.2 Major Release (new version line)

```bash
git checkout v2                      # final state of previous line
git checkout -b v3                   # new independent line
# ... breaking changes committed here ...
echo "3.0.0" > VERSION
git commit -m "deliver(v3): prepare v3_0_0"
git tag -a v3_0_0 -m "Release 3.0.0"
git checkout master
git merge --ff-only v3
git push origin master v3 --tags
```

### 5.3 Porting a Fix Between Versions

```bash
git checkout v3
git cherry-pick <commit-hash>       # deliberate, reviewed port
```

---

## 6. Tag Strategy

### 6.1 Format

```
v<MAJOR>_<MINOR>_<PATCH>
```

Underscore separators keep tags consistent with our snake_case naming policy.

### 6.2 Rules

| # | Rule |
|:---|:---|
| T1 | Tags are annotated, always created on a version branch |
| T2 | A tag is immutable once pushed |
| T3 | Tag name matches the VERSION file content at that commit |

---

## 7. Version Management

### 7.1 Version File

The `VERSION` file at repo root holds the exact current version:

```
2.0.0
```

### 7.2 Bump Rules

| Change | Bump | Example |
|:---|:---|:---|
| Breaking plugin or utility interface change | Major | `3.0.0` |
| New plugin, utility, or pipeline template | Minor | `2.1.0` |
| Bug fix or doc clarification | Patch | `2.0.1` |

---

## 8. Security

| # | Rule |
|:---|:---|
| S1 | Never commit credentials, tokens, or secret files |
| S2 | Remote URLs live in local git config only, never in tracked files |

---

## Change Log

| Version | Date | Change |
|:---|:---|:---|
| 1.0.0 | 2026-08-24 | Initial git integration guide with version-per-branch model |
