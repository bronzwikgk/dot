# Templates

## Purpose

Store reusable templates organized by subdomain.

## Structure

Each subdomain should have its own folder:

```text
templates/
  <subdomain_name>/
    template_<subdomain_name>_overview_v<version>_<status>.md
    template_<name>_v<version>_<status>.md
```

## Rules

- group templates by subdomain
- every template is an entity or produces entities
- every template needs source reason, owner domain, inputs, outputs, schema,
  validation, and example use
- do not create a new template name without checking approved names and the
  current conversation
