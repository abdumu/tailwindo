import { bootstrap4, getBootstrap4Rules } from './bootstrap4.js';
import { bootstrap5, getBootstrap5Rules } from './bootstrap5.js';
import { Dialect } from '../engine/converter.js';

export const dialects = {
  bootstrap4,
  bootstrap5
};

export type DialectName = keyof typeof dialects | 'auto';

export function autoDetectDialect(content: string): 'bootstrap4' | 'bootstrap5' {
  // simple heuristic: BS5 uses gx-, gy-, g-, ms-, me-, ps-, pe-, fw-
  if (/\b(g[xy]?-\d|ms-\d|me-\d|ps-\d|pe-\d|fw-(bold|normal|light)|text-(start|end))\b/.test(content)) {
    return 'bootstrap5';
  }
  return 'bootstrap4';
}

export function getDialect(name: DialectName, content: string = ''): 'bootstrap4' | 'bootstrap5' {
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
  } else {
    return {
      name: 'bootstrap5',
      rules: getBootstrap5Rules(configColors)
    };
  }
}
