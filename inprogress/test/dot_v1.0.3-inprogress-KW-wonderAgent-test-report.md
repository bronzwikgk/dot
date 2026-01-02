# dot Test Report
version: v1.0.3
status: inprogress
agent: KW-wonderAgent
command: node -e "const path = require('path'); global.setTimeout = (fn, ms, ...args) => { fn(...args); return { ref() {}, unref() {} }; }; require('module')._load(path.resolve('..\\..\\shunya\\src\\plugins\\actionEntity\\actionEntity_v4.js'), null, true);"
working_directory: inprogress/test

## Results
- exit_code: 0
- all primary CRUD flows (create user, create session, create alarm, list, update) passed
- cache timers shortcut to immediate run via test override

## Notes
- TTL timers forced to run immediately in this test so the process exits cleanly; production run keeps TTL delays at 300s.
