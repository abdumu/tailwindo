export interface RuleType {
  match: string | RegExp;
  replace: string[] | ((matches: RegExpMatchArray) => string[]);
  confidence?: number;
}

export interface Dialect {
  rules: RuleType[];
  name: string;
}

import { contextualRules } from './contextualRules.js';

export interface ConversionResult {
  original: string;
  converted: string;
  mappedTokens: { from: string; to: string; confidence: number }[];
  unmappedTokens: string[];
  customTokens: string[];
}

export class Converter {
  private dialect: Dialect;
  private prefix: string;
  private componentsMode: boolean;
  private mode: 'utilities' | 'fidelity' | 'mixed';
  public extractedComponents: Map<string, string[]>;

  constructor(dialect: Dialect, prefix: string = '', componentsMode: boolean = false, mode: 'utilities' | 'fidelity' | 'mixed' = 'mixed') {
    this.dialect = dialect;
    this.prefix = prefix;
    this.componentsMode = componentsMode;
    this.mode = mode;
    this.extractedComponents = new Map();
  }

  isBootstrapLikeToken(token: string): boolean {
    if (token.includes(':')) return false;
    if (this.prefix && token.startsWith(this.prefix)) return false;
    if (token.startsWith('tw-')) return false;
    if (token.includes('__') || token.includes('--')) return false; // BEM

    const bsPatterns = [
      /^(m|p)[trblxyse]?-(0|1|2|3|4|5|auto)$/, // spacing
      /^d-\w+/, // display
      /^(text|bg)-\w+/, // text/bg
      /^(justify-content|align-items|align-self)-\w+/, // flex
      /^(ms|me|ps|pe)-(0|1|2|3|4|5|auto)$/, // bs5 logical
      /^(g|gx|gy)-(0|1|2|3|4|5)$/, // gap
      /^(fw|fst)-\w+/, // weights
      /^(container|row|col|btn|alert|badge|card|form)(-|$)/ // grid/components
    ];

    return bsPatterns.some(pattern => pattern.test(token));
  }

  convertClasses(classString: string): ConversionResult {
    // Regex to match tokens and the whitespace between them.
    // It captures both word/class tokens and whitespace tokens separately.
    const tokens = classString.split(/(\s+)/);
    let convertedString = '';
    const mappedTokens: { from: string; to: string; confidence: number }[] = [];
    const unmappedTokens: string[] = [];
    const customTokens: string[] = [];

    // Filter out whitespace for contextual rules match
    let nonSpaceTokens = tokens.filter(t => t.trim() !== '');

    // Track tokens replaced by contextual rules to prevent double-conversion and preserve whitespace
    const replacedByContextual = new Map<string, string>(); // Original token string -> Replacements string

    // Contextual Rules Pass
    if (this.mode !== 'utilities') {
      for (const rule of contextualRules) {
        if (rule.appliesToDialects.includes(this.dialect.name as any) && rule.match(nonSpaceTokens)) {
          const result = rule.transform(nonSpaceTokens); // Add options for colors etc. later if needed
          nonSpaceTokens = result.tokens;

          for (const mapping of result.mapped) {
            if (this.componentsMode) {
              // Keep original tokens for HTML, record mapping for CSS
              for (const fromToken of mapping.from) {
                if (!this.extractedComponents.has(fromToken)) {
                   this.extractedComponents.set(fromToken, mapping.to.map(t => this.prefix + t));
                }
                mappedTokens.push({ from: fromToken, to: fromToken, confidence: mapping.confidence });
              }

              // In components mode, we want the token to remain untouched in HTML.
              // We set its replacement to itself so it won't be processed by single-token rules later.
              for (const fromToken of mapping.from) {
                replacedByContextual.set(fromToken, fromToken);
              }
            } else {
              // Normal utility conversion mode
              for (const fromToken of mapping.from) {
                 const toJoined = mapping.to.map(t => this.prefix + t).join(' ');
                 mappedTokens.push({ from: fromToken, to: toJoined, confidence: mapping.confidence });
                 replacedByContextual.set(fromToken, toJoined);
              }
            }
          }
        }
      }
    }

    convertedString = '';

    for (const token of tokens) {
      if (!token) continue;

      if (/^\s+$/.test(token)) {
        convertedString += token;
        continue;
      }

      // Check if handled by contextual pass
      if (replacedByContextual.has(token)) {
        convertedString += replacedByContextual.get(token);
        // Do not pass this to single-token dialect rules to avoid double-conversion!
        continue;
      }

      // Single-token Dialect Rules Pass
      let replaced = false;
      for (const rule of this.dialect.rules) {
        if (typeof rule.match === 'string') {
          if (rule.match === token) {
            const resultClasses = Array.isArray(rule.replace)
              ? rule.replace
              : (rule.replace as unknown as (m: RegExpMatchArray) => string[])([token]); // fallback, string match has no groups

            const joined = resultClasses.map(c => this.prefix + c).join(' ');
            convertedString += joined;
            mappedTokens.push({ from: token, to: joined, confidence: rule.confidence ?? 1.0 });
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
            mappedTokens.push({ from: token, to: joined, confidence: rule.confidence ?? 0.8 });
            replaced = true;
            break;
          }
        }
      }

      if (!replaced) {
        convertedString += token;
        if (this.isBootstrapLikeToken(token)) {
          unmappedTokens.push(token);
        } else if (token.trim() !== '') {
          customTokens.push(token);
        }
      }
    }

    return {
      original: classString,
      converted: convertedString,
      mappedTokens,
      unmappedTokens,
      customTokens
    };
  }
}
