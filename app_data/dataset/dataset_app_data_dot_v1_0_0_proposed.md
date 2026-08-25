# App Data Dataset

## Purpose

This folder stores approved dataset artifacts.

## Shape

A dataset is a one-dimensional array of approved values.

Allowed:

```js
["entity", "workflow", "template"]
```

Not allowed:

```js
[["entity"], ["workflow"]]
```

```js
[{ "name": "entity" }]
```

## Rules

- one dataset per group of words or values
- values use snake_case
- no duplicates
- no banned active names unless the dataset is explicitly the banned-name list
- attributes and parameters do not belong here; put them in `app_data/data_table`
- relationships do not belong here; put them in `app_data/datamap`
