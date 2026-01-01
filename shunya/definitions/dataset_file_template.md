---
Version: v1.0.0
Status: draft
Agent: Gemini CLI
Last Updated: 2025-12-29
---
# Dataset File Template

This document serves as a template for creating new dataset files within the project, specifying the required structure, metadata, and content guidelines.

## File Structure

```
<file-name>
meta:
  Author: <name/initials>
  Created: <date>
  Version: <version>
  Status: <status>
  Context: <short description>
  Keywords: [list, of, keywords, relevant, to, dataset]
  Similar Files:
    - <related-dataset-1>.yml
    - <related-dataset-2>.yml
```

## Definitions and Rules

*   **Dataset Item Structure**: Always `<unique-ID>:<item-name>:<label>:#<commented-definition>`
*   **Dataset Storage**: Datasets are lists of related items stored in `.yml` files.
*   **Complex Datasets (>10 items)**:
    1.  First create a dataset of labels (categories).
    2.  Then create the actual dataset using those labels.
*   **File Naming Convention**: `<dataset-name>_v<version>-<status>.yml`
*   **Output Order**:
    1.  File name
    2.  Meta
    3.  MVI (Minimum Viable Input)
    4.  Dataset content
    5.  Footer

## Instructions for Creation

*   Always include **semantic version** and file name in the header.
*   Add **MVI (Minimum Viable Input)** section after `meta`.
*   Enclose dataset content between `&&` markers.
*   In the `footer` section: add **Next Step** and **Token Size of Output**.
*   Ensure no duplicates, atomic values only, and consistent casing within dataset items.

## Minimum Viable Input (MVI)

```yaml
MVI:
  Objective: <what this dataset achieves>
  Purpose: <why this dataset exists>
  Audience: <who will use it>
  Output Type: <dataset-entity | dataset-outputFormat>
  Expected Output: <description of content to be generated>
```

## Dataset Content Area

```
&&
output:
  <dataset-items>
&&
```

## Footer

```yaml
footer:
  Next Step: <what to do after this dataset is created>
  Token Size: <number of tokens in this output>
```