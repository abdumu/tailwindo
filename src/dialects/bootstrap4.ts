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

const defaultColors = {
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

export const getBootstrap4Rules = (customColors?: Record<string, string>): RuleType[] => {
  const colors = { ...defaultColors, ...customColors };
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
    { match: /^d-(sm|md|lg|xl)-(none|inline|inline-block|block|table|table-cell|table-row|flex|inline-flex)$/, replace: (m) => [`${m[1]}:${m[2] === 'none' ? 'hidden' : m[2]}`] , confidence: 0.8 },

    // text alignment
    { match: 'text-left', replace: ['text-left'] },
    { match: 'text-right', replace: ['text-right'] },
    { match: 'text-center', replace: ['text-center'] },
    { match: 'text-justify', replace: ['text-justify'] },
    { match: /^text-(sm|md|lg|xl)-(left|right|center|justify)$/, replace: (m) => [`${m[1]}:text-${m[2]}`] , confidence: 0.8 },

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
    { match: /^justify-content-(start|end|center|between|around)$/, replace: (m) => [`justify-${m[1]}`] , confidence: 0.8 },
    { match: /^justify-content-(sm|md|lg|xl)-(start|end|center|between|around)$/, replace: (m) => [`${m[1]}:justify-${m[2]}`] , confidence: 0.8 },

    { match: /^align-items-(start|end|center|stretch|baseline)$/, replace: (m) => [`items-${m[1]}`] , confidence: 0.8 },
    { match: /^align-items-(sm|md|lg|xl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:items-${m[2]}`] , confidence: 0.8 },

    { match: /^align-self-(start|end|center|stretch|baseline)$/, replace: (m) => [`self-${m[1]}`] , confidence: 0.8 },
    { match: /^align-self-(sm|md|lg|xl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:self-${m[2]}`] , confidence: 0.8 },


    // Grid
    { match: 'container', replace: ['container'] },
    { match: 'container-fluid', replace: ['w-full'] },
    { match: 'row', replace: ['flex', 'flex-wrap', '-mx-3'] },
    { match: 'col', replace: ['flex-1', 'px-3'] },
    { match: /^col-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => [`w-${m[1]}/12`, 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl)-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => [`${m[1]}:w-${m[2]}/12`, 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl)$/, replace: (m) => [`${m[1]}:flex-1`, 'px-3'] , confidence: 0.8 },
    { match: /^col-auto$/, replace: ['w-auto', 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl)-auto$/, replace: (m) => [`${m[1]}:w-auto`, 'px-3'] , confidence: 0.8 },

    // Buttons
    { match: 'btn', replace: ['inline-block', 'font-normal', 'text-center', 'whitespace-nowrap', 'align-middle', 'select-none', 'border', 'border-transparent', 'py-1.5', 'px-3', 'rounded', 'leading-normal', 'no-underline', 'transition-colors', 'duration-150'] },
    { match: /^btn-(primary|secondary|success|danger|warning|info|light|dark)$/, replace: (m) => {
        const c = colors[m[1] as keyof typeof colors];
        const textC = ['warning', 'info', 'light'].includes(m[1]) ? 'text-gray-900' : 'text-white';
        return [`bg-${c}`, `border-${c}`, textC, `hover:bg-${c.replace(/\d+/, d => String(Math.max(0, parseInt(d) - 100)))}`];
    }},
    { match: /^btn-outline-(primary|secondary|success|danger|warning|info|light|dark)$/, replace: (m) => {
        const c = colors[m[1] as keyof typeof colors];
        const textC = [`text-${c}`];
        return [...textC, `border-${c}`, `hover:bg-${c}`, 'hover:text-white'];
    }},
    { match: 'btn-lg', replace: ['py-2', 'px-4', 'text-lg', 'rounded-lg'] },
    { match: 'btn-sm', replace: ['py-1', 'px-2', 'text-sm', 'rounded-sm'] },

    // Navbar
    { match: 'navbar', replace: ['relative', 'flex', 'flex-wrap', 'items-center', 'justify-between', 'py-2'] },
    { match: 'navbar-brand', replace: ['inline-block', 'pt-1', 'pb-1', 'mr-4', 'text-lg', 'whitespace-nowrap'] },
    { match: 'navbar-nav', replace: ['flex', 'flex-col', 'pl-0', 'mb-0', 'list-none'] },
    { match: 'nav-item', replace: [] }, // Often purely structural in flex
    { match: 'nav-link', replace: ['block', 'py-2', 'pr-4', 'pl-3'] },
    { match: /^navbar-expand-(sm|md|lg|xl)$/, replace: (m) => [`${m[1]}:flex-nowrap`, `${m[1]}:justify-start`] , confidence: 0.8 },
    { match: 'navbar-toggler', replace: ['py-1', 'px-2', 'text-lg', 'leading-none', 'bg-transparent', 'border', 'border-transparent', 'rounded', 'md:hidden'] }, // Default hidden on md
    { match: 'navbar-collapse', replace: ['flex-basis-full', 'grow', 'items-center', 'md:flex'] }, // Default flex on md
    { match: 'collapse', replace: ['hidden'] },

    // Miscellaneous
    { match: 'text-decoration-none', replace: ['no-underline'] },
    { match: 'list-unstyled', replace: ['list-none', 'pl-0'] },

    // Colors
    { match: /^text-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/, replace: (m) => [`text-${colors[m[1] as keyof typeof colors]}`] , confidence: 0.8 },
    { match: /^bg-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/, replace: (m) => [`bg-${colors[m[1] as keyof typeof colors]}`] , confidence: 0.8 },

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
    },


    // Navbars & Dropdowns
    { match: 'bg-body-tertiary', replace: ['bg-gray-100'] },
    { match: 'navbar-toggler-icon', replace: ['inline-block', 'w-6', 'h-6', 'bg-center', 'bg-no-repeat', 'bg-contain'] },
    { match: 'dropdown', replace: ['relative'] },
    { match: 'dropdown-toggle', replace: ['after:inline-block', 'after:ml-1', 'after:align-middle', 'after:content-[\'\']', 'after:border-t-[0.3em]', 'after:border-r-[0.3em]', 'after:border-b-0', 'after:border-l-[0.3em]', 'after:border-solid', 'after:border-t-current', 'after:border-r-transparent', 'after:border-l-transparent'] },
    { match: 'dropdown-menu', replace: ['absolute', 'z-10', 'hidden', 'float-left', 'min-w-[10rem]', 'py-2', 'm-0', 'text-left', 'list-none', 'bg-white', 'bg-clip-padding', 'border', 'border-gray-200', 'rounded'] },
    { match: 'dropdown-item', replace: ['block', 'w-full', 'py-1', 'px-4', 'clear-both', 'font-normal', 'text-gray-700', 'whitespace-nowrap', 'bg-transparent', 'border-0', 'hover:bg-gray-100'] },
    { match: 'dropdown-divider', replace: ['h-0', 'my-2', 'overflow-hidden', 'border-t', 'border-gray-200', 'opacity-100'] },

    // Cards
    { match: 'card', replace: ['relative', 'flex', 'flex-col', 'min-w-0', 'break-words', 'bg-white', 'bg-clip-border', 'border', 'border-gray-200', 'rounded-md'] },
    { match: 'card-body', replace: ['flex-auto', 'p-4'] },
    { match: 'card-title', replace: ['mb-2', 'text-xl', 'font-medium'] },
    { match: 'card-text', replace: ['mb-4'] },

    // Alerts
    { match: 'alert', replace: ['relative', 'py-3', 'px-4', 'mb-4', 'border', 'border-transparent', 'rounded'] },
    { match: 'alert-warning', replace: ['text-yellow-800', 'bg-yellow-100', 'border-yellow-200'] },
    { match: 'alert-dismissible', replace: ['pr-12'] },
    { match: 'fade', replace: ['transition-opacity', 'duration-150', 'ease-linear'] },
    { match: 'show', replace: ['opacity-100'] },
    { match: 'btn-close', replace: ['absolute', 'top-0', 'right-0', 'z-20', 'p-3', 'box-content', 'w-4', 'h-4', 'text-black', 'bg-transparent', 'border-0', 'rounded', 'opacity-50', 'hover:opacity-75'] },

    // Tables
    { match: 'table', replace: ['w-full', 'mb-4', 'text-left', 'align-top', 'border-collapse'] },
    { match: 'table-striped', replace: ['[&>tbody>tr:nth-of-type(odd)>*]:bg-gray-100'] },
    { match: 'table-hover', replace: ['[&>tbody>tr:hover>*]:bg-gray-200'] }

  ];
  return rules;
};

export const bootstrap4: Dialect = {
  name: 'bootstrap4',
  rules: getBootstrap4Rules()
};
