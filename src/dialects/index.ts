import { bootstrap4, getBootstrap4Rules } from './bootstrap4.js';
import { bootstrap5, getBootstrap5Rules } from './bootstrap5.js';
import { bulma, getBulmaRules } from './bulma.js';
import { foundation, getFoundationRules } from './foundation.js';
import { Dialect } from '../engine/converter.js';

export const dialects = {
  bootstrap4,
  bootstrap5,
  bulma,
  foundation
};

export type DialectName = keyof typeof dialects | 'auto';

export function autoDetectDialect(content: string): keyof typeof dialects {
  const scores = {
    bootstrap5: 0,
    bootstrap4: 0,
    bulma: 0,
    foundation: 0
  };

  // Bootstrap 5 specifics
  if (/\b(g[xy]?-\d|ms-\d|me-\d|ps-\d|pe-\d|fw-(bold|normal|light)|text-(start|end))\b/.test(content)) scores.bootstrap5 += 5;
  // Bootstrap 4 specifics
  if (/\b(ml-\d|mr-\d|pl-\d|pr-\d|font-weight-(bold|normal|light)|text-(left|right))\b/.test(content)) scores.bootstrap4 += 2;
  // General Bootstrap
  if (/\b(col-(sm|md|lg|xl)-\d+|btn-(primary|secondary|success|danger|warning|info|light|dark)|container-fluid)\b/.test(content)) {
      scores.bootstrap5 += 2;
      scores.bootstrap4 += 2;
  }

  // Bulma specifics
  if (/\b(columns|column|is-(half|one-third|two-thirds|one-quarter|three-quarters|full)|has-text-(centered|left|right|primary|link|info|success|warning|danger))\b/.test(content)) scores.bulma += 5;
  if (/\b(hero|navbar|notification|message|box|field|control)\b/.test(content)) scores.bulma += 1;

  // Foundation specifics
  if (/\b(grid-x|grid-y|cell|small-\d+|medium-\d+|large-\d+|show-for-|hide-for-)\b/.test(content)) scores.foundation += 5;
  if (/\b(callout|top-bar)\b/.test(content)) scores.foundation += 2;

  let bestMatch: keyof typeof dialects = 'bootstrap4';
  let maxScore = scores.bootstrap4;

  for (const [dialect, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestMatch = dialect as keyof typeof dialects;
    }
  }

  return bestMatch;
}

export function getDialect(name: DialectName, content: string = ''): keyof typeof dialects {
  if (name === 'auto') {
    return autoDetectDialect(content);
  }
  return name;
}

export function getDialectWithConfig(name: DialectName, content: string = '', configColors?: Record<string, string>): Dialect {
  const resolvedName = getDialect(name, content);

  if (resolvedName === 'bootstrap4') {
    return {
      name: 'bootstrap4',
      rules: getBootstrap4Rules(configColors)
    };
  } else if (resolvedName === 'bootstrap5') {
    return {
      name: 'bootstrap5',
      rules: getBootstrap5Rules(configColors)
    };
  } else if (resolvedName === 'bulma') {
    return {
      name: 'bulma',
      rules: getBulmaRules()
    };
  } else {
    return {
      name: 'foundation',
      rules: getFoundationRules()
    };
  }
}
