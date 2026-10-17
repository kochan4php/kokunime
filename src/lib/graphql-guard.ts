// Depth/complexity budget for the GraphQL endpoint. The route matches a fixed
// query grammar with regexes (no AST library), so this lightweight analyzer is
// the guard against pathological nesting instead.
export const GRAPHQL_MAX_DEPTH = 5;
export const GRAPHQL_MAX_COMPLEXITY = 60;

interface QueryAnalysis {
  depth: number;
  complexity: number;
}

const RESERVED = new Set(["query", "mutation", "subscription", "fragment", "on", "true", "false", "null"]);

// Braces inside string literals are ignored; every non-reserved identifier
// (field/argument token) counts one complexity unit.
export const analyzeQuery = (query: string): QueryAnalysis => {
  let depth = 0;
  let maxDepth = 0;
  let complexity = 0;
  let inString: string | null = null;
  let word = "";

  const flushWord = (): void => {
    if (word && !RESERVED.has(word)) complexity++;
    word = "";
  };

  for (let index = 0; index < query.length; index++) {
    const char = query[index];
    if (inString) {
      if (char === "\\") {
        index++;
        continue;
      }
      if (char === inString) inString = null;
      continue;
    }
    if (char === '"' || char === "'") {
      flushWord();
      inString = char;
      continue;
    }
    if (char === "{") {
      flushWord();
      depth++;
      maxDepth = Math.max(maxDepth, depth);
      continue;
    }
    if (char === "}") {
      flushWord();
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (/[A-Za-z0-9_]/.test(char ?? "")) {
      word += char;
      continue;
    }
    flushWord();
  }
  flushWord();

  return { depth: maxDepth, complexity };
};
