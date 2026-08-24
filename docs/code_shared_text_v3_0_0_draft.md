# Shared Text Utility

## File

`code/utilities/code_shared_text_v3_0_0_draft.js`

## What It Is

The shared text utility provides small text helpers for escaping, tokenization, whitespace normalization, and mapped string joining.

It is dependency-free and intended for shared runtime code that needs predictable text handling without repeatedly defining local helpers.

## What It Does

`TextUtil` exposes:

- `escape_text(value)`
- `join_mapped(items, map_function)`
- `tokenize(text_value)`
- `normalize_spaces(value)`

Named wrapper exports are also available:

- `escape_text(value)`
- `join_mapped(items, map_function)`
- `tokenize(text_value)`
- `normalize_spaces(value)`

## When To Use It

Use this utility when code needs simple text preparation.

Good use cases:

- Escaping text before inserting into HTML-like output.
- Tokenizing plain English-ish identifiers or text.
- Normalizing whitespace in generated content.
- Mapping arrays into joined strings.

Avoid using it for:

- Full HTML sanitization.
- Markdown parsing.
- Unicode-aware natural language tokenization.
- Locale-specific case folding.
- Template rendering with untrusted markup.

## Examples

Escape text:

```js
const text = new TextUtil();

text.escape_text("<b>Ann's & Bob</b>");
// "&lt;b&gt;Ann&#39;s &amp; Bob&lt;/b&gt;"
```

Tokenize:

```js
text.tokenize("Hello, AI-2026! a B cde");
// ["hello", "ai", "2026", "cde"]
```

Normalize spaces:

```js
text.normalize_spaces("  hello\n\tworld  ");
// "hello world"
```

Join mapped:

```js
text.join_mapped([1, 2, 3], value => String(value * 2));
// "246"
```

Wrapper export:

```js
import { normalize_spaces } from "./code_shared_text_v3_0_0_draft.js";

normalize_spaces("a   b");
// "a b"
```

## Escaping Behavior

`escape_text()` replaces:

- `&` with `&amp;`
- `<` with `&lt;`
- `>` with `&gt;`
- `"` with `&quot;`
- `'` with `&#39;`

It coerces input with `String(value)`.

## Tokenization Behavior

`tokenize()`:

- Coerces missing input to an empty string.
- Lowercases the text.
- Splits on non-ASCII alphanumeric runs.
- Removes tokens with length `1`.

Example:

```js
tokenize("A bb 123");
// ["bb", "123"]
```

## Runtime Contract

Maintainers and agents should preserve these guarantees:

- `new TextUtil()` must work with no config.
- `escape_text()` should escape ampersand before other entities.
- `tokenize(null)` returns `[]`.
- `normalize_spaces(null)` returns `""`.
- `join_mapped(null, fn)` returns `""`.
- `join_mapped([], fn)` returns `""`.
- Named wrapper exports should match class method behavior.

## How It Was Tested

Focused checks were run with Node ESM import:

```powershell
@'
import assert from 'node:assert/strict';
import TextUtil, { escape_text, tokenize, normalize_spaces, join_mapped } from './code/utilities/code_shared_text_v3_0_0_draft.js';
const t = new TextUtil();
assert.equal(t.escape_text('<a href="x">Bob & Ann\\'s</a>'), '&lt;a href=&quot;x&quot;&gt;Bob &amp; Ann&#39;s&lt;/a&gt;');
assert.equal(escape_text('&<>"\\''), '&amp;&lt;&gt;&quot;&#39;');
assert.deepEqual(t.tokenize('Hello, AI-2026! a B cde'), ['hello', 'ai', '2026', 'cde']);
assert.deepEqual(tokenize(null), []);
assert.equal(t.normalize_spaces('  hello\\n\\tworld  '), 'hello world');
assert.equal(normalize_spaces(null), '');
assert.equal(t.join_mapped([1, 2, 3], x => String(x * 2)), '246');
assert.equal(join_mapped(null, x => x), '');
console.log('text checks passed');
'@ | node --input-type=module
```

Expected output:

```text
text checks passed
```

## How To Update It

When updating this utility:

1. Preserve named wrapper exports unless all callers are updated in the same utility pass.
2. Add focused checks for null and empty input behavior.
3. Test escaping order when changing `escape_text()`.
4. Document any tokenization rule changes.
5. Update this document with any new helper or behavior guarantee.
6. Update the matching maintenance log in `log/code_shared_text_v3_0_0_draft.log.md`.
7. Commit only text code, text docs, and text log for the text utility pass.

## Known Limits

- `escape_text()` is escaping, not full sanitization.
- `tokenize()` is ASCII-oriented.
- `join_mapped()` expects a valid mapping function when items are present.
- Unicode word segmentation is not supported.
