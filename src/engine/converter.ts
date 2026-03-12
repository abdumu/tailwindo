export interface RuleType {
  match: string | RegExp;
  replace: string[] | ((matches: RegExpMatchArray) => string[]);
}

export interface Dialect {
  rules: RuleType[];
  name: string;
}

export interface ConversionResult {
  original: string;
  converted: string;
  mappedTokens: { from: string; to: string }[];
  unmappedTokens: string[];
}

export class Converter {
  private dialect: Dialect;
  private prefix: string;

  constructor(dialect: Dialect, prefix: string = '') {
    this.dialect = dialect;
    this.prefix = prefix;
  }

  convertClasses(classString: string): ConversionResult {
    // Regex to match tokens and the whitespace between them.
    // It captures both word/class tokens and whitespace tokens separately.
    const tokens = classString.split(/(\s+)/);
    let convertedString = '';
    const mappedTokens: { from: string; to: string }[] = [];
    const unmappedTokens: string[] = [];

    for (const token of tokens) {
      if (!token) continue;

      // If it's pure whitespace, preserve it exactly
      if (/^\s+$/.test(token)) {
        convertedString += token;
        continue;
      }

      // It's a class token
      let replaced = false;
      for (const rule of this.dialect.rules) {
        if (typeof rule.match === 'string') {
          if (rule.match === token) {
            const resultClasses = Array.isArray(rule.replace)
              ? rule.replace
              : (rule.replace as unknown as (m: RegExpMatchArray) => string[])([token]); // fallback, string match has no groups

            const joined = resultClasses.map(c => this.prefix + c).join(' ');
            convertedString += joined;
            mappedTokens.push({ from: token, to: joined });
            replaced = true;
            break;
          }
        } else if (rule.match instanceof RegExp) {
          const match = token.match(rule.match);
          if (match && match[0] === token) { // Ensure the whole token matches
            const resultClasses = Array.isArray(rule.replace)
              ? rule.replace
              : rule.replace(match);

            const joined = resultClasses.map(c => this.prefix + c).join(' ');
            convertedString += joined;
            mappedTokens.push({ from: token, to: joined });
            replaced = true;
            break;
          }
        }
      }

      if (!replaced) {
        convertedString += token;
        unmappedTokens.push(token);
      }
    }

    return {
      original: classString,
      converted: convertedString,
      mappedTokens,
      unmappedTokens
    };
  }
}
