/**
 * @objective: Tokenize natural language input into canonical integer tokens.
 * @roadmap: Part of the ourActionLang v2.2.0 deterministic pipeline.
 * @use_cases: Pre-processing for AST generation.
 * @constraints: No AI. Strictly uses dataset-driven lookup.
 */
export class ourActionLang_Tokenizer_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.synonyms = config.datasets?.synonyms ?? {};
    this.rules = config.rules ?? [];
    this.lookup = this.buildLookup(this.synonyms);
    this.options = {
      preserveQuoted: true,
      preservePaths: true,
      preserveKeyValue: true,
      ...(config.tokenizer ?? {})
    };
  }

  tokenize(input, runtimeOptions = {}) {
    if (!input || typeof input !== 'string') return [];

    const options = { ...this.options, ...runtimeOptions };
    const scannedTokens = this.scanTokens(input, options);
    const normalizedTokens = scannedTokens
      .map((token) => this.normalizeToken(token, options))
      .filter(Boolean);

    return normalizedTokens.map(token => {
      // Direct hit or synonym resolution
      const canonical = this.resolve(token);
      return {
        raw: token,
        canonical: canonical,
        token_id: this.synonyms[canonical]?.id ?? 0 // 0 = unknown/literal
      };
    });
  }

  scanTokens(input, options) {
    const tokens = [];
    const text = String(input);
    let i = 0;

    while (i < text.length) {
      const ch = text[i];
      if (/\s/.test(ch)) {
        i += 1;
        continue;
      }

      if (options.preserveQuoted && (ch === '"' || ch === "'")) {
        const quote = ch;
        let j = i + 1;
        let escaped = false;
        while (j < text.length) {
          const current = text[j];
          if (!escaped && current === quote) break;
          escaped = !escaped && current === "\\";
          if (current !== "\\") escaped = false;
          j += 1;
        }

        const end = j < text.length ? j + 1 : text.length;
        tokens.push(text.slice(i, end));
        i = end;
        continue;
      }

      let j = i;
      while (j < text.length && !/\s/.test(text[j])) {
        j += 1;
      }
      tokens.push(text.slice(i, j));
      i = j;
    }

    return tokens;
  }

  normalizeToken(token, options) {
    if (!token) return "";
    const trimmed = String(token).trim();
    if (!trimmed) return "";

    if (this.isQuoted(trimmed)) {
      return trimmed.slice(1, -1).toLowerCase();
    }

    const lowered = trimmed.toLowerCase();
    const cleaned = lowered.replace(/^[^\w@./\\:=-]+|[^\w@./\\:=-]+$/g, "");
    if (!cleaned) return "";

    if (options.preserveKeyValue && this.isKeyValue(cleaned)) {
      const separator = cleaned.includes("=") ? "=" : ":";
      const [key, value] = cleaned.split(separator);
      const safeKey = key.replace(/[^a-z0-9_./\\-]/g, "");
      const safeValue = (value ?? "").replace(/[^a-z0-9_./\\:-]/g, "");
      return safeKey && safeValue ? `${safeKey}${separator}${safeValue}` : safeKey || safeValue;
    }

    if (options.preservePaths && this.isPathLike(cleaned)) {
      return cleaned.replace(/[^a-z0-9_./\\:-]/g, "");
    }

    return cleaned.replace(/[^a-z0-9_@]/g, "");
  }

  isQuoted(token) {
    if (token.length < 2) return false;
    const first = token[0];
    const last = token[token.length - 1];
    return (first === '"' && last === '"') || (first === "'" && last === "'");
  }

  isPathLike(token) {
    return /^[a-z]:\\/.test(token) || token.includes("/") || token.includes("\\");
  }

  isKeyValue(token) {
    return /^[a-z0-9_.-]+[:=].+/.test(token);
  }

  resolve(token) {
    return this.lookup[token] ?? token;
  }

  buildLookup(synonyms) {
    const lookup = {};

    for (const [canonical, data] of Object.entries(synonyms)) {
      if (!(canonical in lookup)) {
        lookup[canonical] = canonical;
      }

      const aliases = data?.aliases ?? [];
      for (const alias of aliases) {
        // Preserve first definition order when aliases overlap.
        if (!(alias in lookup)) {
          lookup[alias] = canonical;
        }
      }
    }

    return lookup;
  }
}
