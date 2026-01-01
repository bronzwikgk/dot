project: projectname
version: v1.1.14
status: note
agent: KW-wonderAgent
summary:
  - documented that all manifest/index files (including dataset indexes and renderer inputs) must be stored in `.txt`, `.tree`, or `.yml` formats per the latest guidance.
  - clarified that markdown files stem from rendering outputs or documentation rather than index sources.
instructions:
  - Use `.yml` (preferred), `.txt`, or `.tree` for any files acting as operational indexes (manifest, dataset tree, job queue references).
  - Reserve `.md` for rendered documentation outputs produced by tools like `ehh-renderDoc.mjs`.
  - When converting between formats, mention the original source and the generated `.md` snapshot in the changelog entry.
