/**
 * @entity serialize_utility
 *
 * @meta
 * project: an_app
 * file_name: src/utility/serialize.js
 * version: 1.0.0
 * status: draft
 * author: {{author}}
 *
 * @objective
 * json, markdown, and plain text serialization helpers.
 *
 * @usage
 * ```js
 * const json_str = to_json(entity);
 * const md = to_markdown(entity);
 * ```
 *
 * @keywords
 * serialize, json, markdown, format
 *
 * @changelog
 * - 2026-08-22: 1.0.0: initial draft
 */
export function to_json(data, pretty = false) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

export function from_json(text) {
  try {
    return { data: JSON.parse(text) };
  } catch (e) {
    return { errors: [{ code: 'parse_error', message: e.message }] };
  }
}

export function to_markdown_table(rows, headers) {
  if (!rows || rows.length === 0) return '';
  const cols = headers || Object.keys(rows[0]);
  const lines = [];
  lines.push('| ' + cols.join(' | ') + ' |');
  lines.push('| ' + cols.map(() => ':---').join(' | ') + ' |');
  for (const row of rows) {
    lines.push('| ' + cols.map(c => String(row[c] ?? '')).join(' | ') + ' |');
  }
  return lines.join('\n');
}

export function to_plain_text(data) {
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
}
