import { TokenRange } from './html.js';

export function parseServerClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  // A heuristic approach for server templates (Blade, Twig, ERB, PHP, etc.)
  // We look for class="value" or class='value'
  // Then inside the value, we ignore dynamic blocks like {{ ... }}, {% ... %}, <?= ... ?>, <% ... %>, @{...}

  // Find all class attributes
  const classAttrRegex = /class\s*=\s*(['"])([\s\S]*?)\1/gi;
  let match;

  while ((match = classAttrRegex.exec(content)) !== null) {
    const value = match[2];
    const valueStart = match.index + match[0].indexOf(match[1]) + 1;

    // Now find dynamic chunks inside value
    // Common dynamic chunks: {{ }}, {% %}, {!! !!}, <?= ?>, <?php ?>, <% %>, <%= %>, @{ }
    // We match these blocks and collect the literal strings between them

    // Non-greedy match for dynamic blocks
    const dynamicRegex = /(\{\{.*?\}\}|\{%.*?%\}|\{!!.*?!!\}|<\?=.*?\?>|<\?php.*?\?>|<%.*?%>|@\{.*?\})/g;

    let lastIndex = 0;
    let dynMatch;

    while ((dynMatch = dynamicRegex.exec(value)) !== null) {
      const literal = value.substring(lastIndex, dynMatch.index);
      if (literal) { // don't push empty strings
        tokens.push({
          start: valueStart + lastIndex,
          end: valueStart + dynMatch.index,
          value: literal
        });
      }
      lastIndex = dynamicRegex.lastIndex;
    }

    // Push the remaining string
    if (lastIndex < value.length) {
      const literal = value.substring(lastIndex);
      if (literal) {
        tokens.push({
          start: valueStart + lastIndex,
          end: valueStart + value.length,
          value: literal
        });
      }
    }
  }

  return tokens;
}
