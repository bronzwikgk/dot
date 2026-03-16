# Shunya Handbook

Version: `0.1.0`  
Audience: Internal team at Shunya.ek (`dot shunya ek pvt ltd`)

## 1. Why We Exist

Shunya.ek starts from `shunya` (empty) and moves toward `ek` (one): from problem to solution.

We build tools, systems, and workflows that make work efficient, safe, and joyful.  
Our work is practical, creative, and collaborative: templates, apps, frameworks, plugins, utilities, and process systems.

Elevator line:

> A fearless adventure is knowing what to do when no one is there to tell you what to do.

## 2. Team Beliefs

- Make mistakes and learn fast.
- Knowledge should be free and remain free.
- Help your mate.
- Start from wherever you are.
- Reinvent the wheel if needed.
- Search first, then ask.
- Plan and communicate.
- Be responsible for your actions.
- Do not assume certainty without proof.
- Motivate instead of demotivate.

Everything we publish should be:

- Thoughtful
- Interesting
- Proud
- Bold
- Human

## 3. Core Working Model

We take `action` on an `entity` through clear operations, roles, and flows.

### 3.1 Story as the Unit of Work

A task is treated as a story that travels across stages and statuses.

Major milestones:

1. Birth: `Shunya` (`InQue`)
2. Process: `Dot` (`In Development`)
3. End: `Ek` (`Deployed to Market`)

### 3.2 Story Inputs and Lifecycle

Story input can arrive through:

- Message
- Notification
- File link
- Verbal discussion
- Document

Lifecycle baseline:

1. Add labels (`Priority`, `Audience`).
2. Self-assign the story.
3. Capture MVI in story description.
4. Record stage updates in comments.
5. Move approved content to files.
6. Deploy outcome to a URL.

### 3.3 Story Types

- Dataset
- User story
- User flow
- System flow
- Action-engine flow
- Template
- Plugin
- Utility
- Class
- Method
- Product
- Project
- Document
- Proposal
- Change
- Release
- Comment
- Page
- App

## 4. The 5D Operating Cycle

Shunya follows a 5D release cycle:

1. Discover
2. Define
3. Design
4. Develop
5. Deploy

Review, audit, and approvals happen across these stages.

### 4.1 Discover

Goal: identify the right problem and audience, then build a discovery dataset.

Actions:

- Understand
- Research
- Find
- Filter

Outputs:

- Project charter
- Stakeholder map
- Objectives and scope
- Market analysis
- Competitive analysis
- Requirement specification
- User stories/use cases
- Prioritization matrix
- Risk register and mitigation plan
- Feasibility and risk assessment reports

### 4.2 Define

Goal: define solution direction with clarity.

Define:

- Story/project dataset
- Modules and features
- User stories
- Competition and inspiration
- User and system flows
- Roadmap

### 4.3 Design

Goal: convert direction into system shape.

Design scope:

- Architecture
- Database design
- Dataset structure
- User and system flows
- Pages and components
- Classes and methods

### 4.4 Develop

Goal: build and validate implementation.

Activities:

- Build components
- Build pages
- Test
- Review
- Benchmark

### 4.5 Deploy

Goal: ship with documentation and confidence.

Sequence:

- Generate docs: user, developer, technical, manifest
- Audit
- Push
- Merge
- Test
- Deploy user flow
- Deploy release notes
- Deploy feed

## 5. Story Flow in Practice

Practical activity flow:

1. Understand MVI (Minimum Viable Input/Information).
2. Choose template.
3. Expand objective, purpose, and overview in comments.
4. Break into 5D stage tasks.
5. Create sub-tasks.
6. Create roadmap in the relevant folder/branch.
7. Add due date.
8. Change status to `InAction`.
9. Post content or file links in comments.
10. Complete the work with task-linked commit message.
11. Push.
12. Notify relevant people.
13. Get approvals at each stage end.

## 6. Commit and Session Discipline

### 6.1 Commit Frequency

- Commit at least hourly during active development.
- Keep commits atomic (one logical change).
- Ensure tests pass before commit.
- Share work through deployment/publishing workflow.

### 6.2 Login/Logout Commits

Use session bookend commits:

- Login: `Login: [Date & Time] - Starting session`
- Logout: `Logout: [Date & Time] - Ending session`

Recommended team message content for login/logout:

- Agenda
- Learning from yesterday/today
- Motivational note
- Day summary

### 6.3 Progress Commit Format

`Progress: [Date & Time] - [Brief work summary]`

## 7. Communication Protocol

- Respect time and clarity.
- Prefer focused conversation over scattered comment chains.
- Avoid unnecessary meetings.
- Primary channels: Discord and WhatsApp.
- Keep communications logged and auditable.
- Maintain professional, respectful behavior.
- Reject bullying and heroism culture.
- Use simple language for shared understanding.
- Submit structured communication requests with:
  - Agenda
  - Priority
  - Expected timeframe

## 8. Documentation Standards

Document rules:

- Follow the generic document template.
- Include linked TOC on each page.
- Give each list item a unique indexable ID.
- Track total item count in lists.

## 9. Semantic Versioning Standard

Use `Major.Minor.Patch`.

- Major: breaking change
- Minor: backward-compatible feature
- Patch: backward-compatible fix

Guidelines:

- Keep changelog updated.
- Maintain compatibility discipline.
- Use stable versions for production release.

## 10. Working with LLM and GPT

### 10.1 LLM Workflow

1. Start from unknown and clarify brief.
2. Build prompt list plus guideline list.
3. Request and build datasets + TOC.
4. Ask for map and tree; compare both.
5. Evaluate output repeatedly.
6. Build mapping and seek recommendations.

### 10.2 GPT Guidance (Legacy Internal Notes)

- Follow output limits and constraints.
- Use structured markdown outputs.
- Apply semantic versioning from `0-0-1`.
- Keep lists uniquely indexable.
- Follow SOLID/OOP principles.
- Include glossary and evaluation reporting.

## 11. Templates Library

### 11.1 Story Manifest Template

Contains sections for:

- Story meta
- MVI (objective, purpose, problem)
- Solution
- Scope (modules, actors, actions, flows, services, dataset)
- Current world scan (competition, inspiration, tutorials)
- Tech specs (pipeline, architecture, methods, DB, UI)
- User docs (install, test, use)
- Roadmap, activity, team, resources, effort breakdown, glossary

### 11.2 Generic Document Template

Includes:

- Meta
- MVI
- Team
- Content and references
- Format and appendices
- Accessibility/security/feedback
- Additional/legal/archival
- Footer and glossary

### 11.3 Proposal Template

Includes:

- Project overview and type
- Objectives
- Scope, deliverables, features, timeline
- Methodology
- Budget
- Team and responsibilities
- Terms and approval

### 11.4 Release Notes Template

Includes:

- Overview
- Features
- Enhancements
- Fixes
- Performance
- Security
- Known issues
- Feedback and contact

### 11.5 Change Log Template

Tracks:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

## 12. Legacy JavaScript Style Reference

The repository also includes a legacy JavaScript style guide snapshot.

Key directives in that document:

- Always declare variables with `var` (legacy compatibility context).
- Use `NAMES_LIKE_THIS` for constant values.
- Use `@const` annotations for non-overwritable references.
- Always use semicolons.
- Prefer standard features over non-standard patterns.
- Use normal `for` loops for arrays in that legacy style context.
- Avoid using `Array` as a hash map.
- Prefer literals for `Array` and `Object`.
- Keep global names prefixed and avoid global aliases.
- Use explicit scope.
- Use newlines to group logic.
- Use JSDoc.

Note: The file itself states a newer ES6-era guide exists and should be preferred for new code.

## 13. Assets and Links

- Handbook header image: `handbook_dot_in_action/assest/img/handbook_header_dia.png`
- Knowledge center reference: `https://linear.app/method`
- Story manifest reference link in source: `https://gitlab.com/bronzwik/shunya-projects/-/wikis/story-manifest-v-0-0-1`

## 14. Final Note

This handbook is a practical operating system for moving work from uncertainty to shipped value, without losing joy, clarity, or responsibility.
