import { bootstrap4 } from './bootstrap4.js';
import { bootstrap5 } from './bootstrap5.js';

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
