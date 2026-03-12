import { Dialect, RuleType } from '../engine/converter.js';

const spacings = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '4',
  '4': '6',
  '5': '12',
  'auto': 'auto'
};

const colors = {
  'primary': 'blue-600',
  'secondary': 'gray-600',
  'success': 'green-500',
  'danger': 'red-600',
  'warning': 'yellow-500',
  'info': 'teal-500',
  'light': 'gray-100',
  'dark': 'gray-900',
  'white': 'white',
  'muted': 'gray-700',
};

const getRules = (): RuleType[] => {
  const rules: RuleType[] = [
    // display
    { match: 'd-none', replace: ['hidden'] },
    { match: 'd-inline', replace: ['inline'] },
    { match: 'd-inline-block', replace: ['inline-block'] },
    { match: 'd-block', replace: ['block'] },
    { match: 'd-table', replace: ['table'] },
    { match: 'd-table-cell', replace: ['table-cell'] },
    { match: 'd-table-row', replace: ['table-row'] },
    { match: 'd-flex', replace: ['flex'] },
    { match: 'd-inline-flex', replace: ['inline-flex'] },
    { match: /^d-(sm|md|lg|xl)-(none|inline|inline-block|block|table|table-cell|table-row|flex|inline-flex)$/, replace: (m) => [`${m[1]}:${m[2] === 'none' ? 'hidden' : m[2]}`] },

    // text alignment
    { match: 'text-left', replace: ['text-left'] },
    { match: 'text-right', replace: ['text-right'] },
    { match: 'text-center', replace: ['text-center'] },
    { match: 'text-justify', replace: ['text-justify'] },
    { match: /^text-(sm|md|lg|xl)-(left|right|center|justify)$/, replace: (m) => [`${m[1]}:text-${m[2]}`] },

    // text transform
    { match: 'text-lowercase', replace: ['lowercase'] },
    { match: 'text-uppercase', replace: ['uppercase'] },
    { match: 'text-capitalize', replace: ['capitalize'] },

    // font weight
    { match: 'font-weight-bold', replace: ['font-bold'] },
    { match: 'font-weight-normal', replace: ['font-normal'] },
    { match: 'font-weight-light', replace: ['font-light'] },
    { match: 'font-italic', replace: ['italic'] },

    // flex alignment
    { match: /^justify-content-(start|end|center|between|around)$/, replace: (m) => [`justify-${m[1]}`] },
    { match: /^justify-content-(sm|md|lg|xl)-(start|end|center|between|around)$/, replace: (m) => [`${m[1]}:justify-${m[2]}`] },

    { match: /^align-items-(start|end|center|stretch|baseline)$/, replace: (m) => [`items-${m[1]}`] },
    { match: /^align-items-(sm|md|lg|xl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:items-${m[2]}`] },

    { match: /^align-self-(start|end|center|stretch|baseline)$/, replace: (m) => [`self-${m[1]}`] },
    { match: /^align-self-(sm|md|lg|xl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:self-${m[2]}`] },

    // Colors
    { match: /^text-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/, replace: (m) => [`text-${colors[m[1] as keyof typeof colors]}`] },
    { match: /^bg-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/, replace: (m) => [`bg-${colors[m[1] as keyof typeof colors]}`] },

    // spacing m, p
    {
      match: /^(m|p)(t|b|l|r|x|y)?-(0|1|2|3|4|5|auto)$/,
      replace: (m) => {
        const prop = m[1];
        const side = m[2] || '';
        const size = m[3];
        const mappedSize = spacings[size as keyof typeof spacings];
        return [`${prop}${side}-${mappedSize}`];
      }
    },
    // responsive spacing m, p
    {
      match: /^(m|p)(t|b|l|r|x|y)?-(sm|md|lg|xl)-(0|1|2|3|4|5|auto)$/,
      replace: (m) => {
        const prop = m[1];
        const side = m[2] || '';
        const bp = m[3];
        const size = m[4];
        const mappedSize = spacings[size as keyof typeof spacings];
        return [`${bp}:${prop}${side}-${mappedSize}`];
      }
    }
  ];
  return rules;
};

export const bootstrap4: Dialect = {
  name: 'bootstrap4',
  rules: getRules()
};
