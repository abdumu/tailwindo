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

export const getBootstrap5Rules = (customColors?: Record<string, string>): RuleType[] => {
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
    { match: /^d-(sm|md|lg|xl|xxl)-(none|inline|inline-block|block|table|table-cell|table-row|flex|inline-flex)$/, replace: (m) => [`${m[1]}:${m[2] === 'none' ? 'hidden' : m[2]}`] , confidence: 0.8 },

    // text alignment
    { match: 'text-start', replace: ['text-left'] },
    { match: 'text-end', replace: ['text-right'] },
    { match: 'text-center', replace: ['text-center'] },
    { match: /^text-(sm|md|lg|xl|xxl)-(start|end|center)$/, replace: (m) => {
      const align = m[2] === 'start' ? 'left' : (m[2] === 'end' ? 'right' : m[2]);
      return [`${m[1]}:text-${align}`];
    }},

    // text transform
    { match: 'text-lowercase', replace: ['lowercase'] },
    { match: 'text-uppercase', replace: ['uppercase'] },
    { match: 'text-capitalize', replace: ['capitalize'] },

    // font weight
    { match: 'fw-bold', replace: ['font-bold'] },
    { match: 'fw-bolder', replace: ['font-black'] },
    { match: 'fw-normal', replace: ['font-normal'] },
    { match: 'fw-light', replace: ['font-light'] },
    { match: 'fw-lighter', replace: ['font-thin'] },
    { match: 'fst-italic', replace: ['italic'] },
    { match: 'fst-normal', replace: ['not-italic'] },

    // flex alignment
    { match: /^justify-content-(start|end|center|between|around|evenly)$/, replace: (m) => {
      const align = m[1] === 'start' ? 'start' : (m[1] === 'end' ? 'end' : m[1]);
      return [`justify-${align}`]; // tailwind uses start, end
    }},
    { match: /^justify-content-(sm|md|lg|xl|xxl)-(start|end|center|between|around|evenly)$/, replace: (m) => [`${m[1]}:justify-${m[2]}`] , confidence: 0.8 },

    { match: /^align-items-(start|end|center|stretch|baseline)$/, replace: (m) => [`items-${m[1]}`] , confidence: 0.8 },
    { match: /^align-items-(sm|md|lg|xl|xxl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:items-${m[2]}`] , confidence: 0.8 },

    { match: /^align-self-(start|end|center|stretch|baseline)$/, replace: (m) => [`self-${m[1]}`] , confidence: 0.8 },
    { match: /^align-self-(sm|md|lg|xl|xxl)-(start|end|center|stretch|baseline)$/, replace: (m) => [`${m[1]}:self-${m[2]}`] , confidence: 0.8 },


    // Grid
    { match: 'container', replace: ['container', 'mx-auto'] },
    { match: 'container-fluid', replace: ['w-full'] },
    { match: /^container-(sm|md|lg|xl|xxl)$/, replace: (m) => [`container`, 'mx-auto', `max-w-screen-${m[1]}`] , confidence: 0.8 },
    { match: 'row', replace: ['flex', 'flex-wrap', '-mx-3'] },
    { match: 'col', replace: ['flex-1', 'px-3'] },
    { match: /^col-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => [`w-${m[1]}/12`, 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl|xxl)-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => [`${m[1]}:w-${m[2]}/12`, 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl|xxl)$/, replace: (m) => [`${m[1]}:flex-1`, 'px-3'] , confidence: 0.8 },
    { match: /^col-auto$/, replace: ['w-auto', 'px-3'] , confidence: 0.8 },
    { match: /^col-(sm|md|lg|xl|xxl)-auto$/, replace: (m) => [`${m[1]}:w-auto`, 'px-3'] , confidence: 0.8 },
    { match: /^offset-(1|2|3|4|5|6|7|8|9|10|11)$/, replace: (m) => [`ml-${m[1]}/12`] , confidence: 0.8 },
    { match: /^offset-(sm|md|lg|xl|xxl)-(1|2|3|4|5|6|7|8|9|10|11)$/, replace: (m) => [`${m[1]}:ml-${m[2]}/12`] , confidence: 0.8 },

    // Buttons
    { match: 'btn', replace: ['inline-block', 'font-normal', 'text-center', 'whitespace-nowrap', 'align-middle', 'select-none', 'border', 'border-transparent', 'py-1.5', 'px-3', 'rounded', 'leading-normal', 'no-underline', 'transition-colors', 'duration-150'] },
    { match: /^btn-(primary|secondary|success|danger|warning|info|light|dark)$/, replace: (m) => {
        const c = colors[m[1]];
        const textC = ['warning', 'info', 'light'].includes(m[1]) ? 'text-gray-900' : 'text-white';
        return [`bg-${c}`, `border-${c}`, textC, `hover:bg-${c.replace(/\d+/, d => Math.max(0, parseInt(d) - 100))}`];
    }},
    { match: /^btn-outline-(primary|secondary|success|danger|warning|info|light|dark)$/, replace: (m) => {
        const c = colors[m[1]];
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
    { match: /^navbar-expand-(sm|md|lg|xl|xxl)$/, replace: (m) => [`${m[1]}:flex-nowrap`, `${m[1]}:justify-start`] , confidence: 0.8 },
    { match: 'navbar-toggler', replace: ['py-1', 'px-2', 'text-lg', 'leading-none', 'bg-transparent', 'border', 'border-transparent', 'rounded', 'lg:hidden'] },
    { match: 'navbar-collapse', replace: ['flex-basis-full', 'grow', 'items-center', 'lg:flex'] },
    { match: 'collapse', replace: ['hidden'] },

    // Miscellaneous
    { match: 'text-decoration-none', replace: ['no-underline'] },
    { match: 'list-unstyled', replace: ['list-none', 'pl-0'] },

    // Borders & radius
    { match: 'border', replace: ['border', 'border-solid', 'border-gray-200'] },
    { match: 'border-0', replace: ['border-0'] },
    { match: 'border-top', replace: ['border-t', 'border-gray-200'] },
    { match: 'border-bottom', replace: ['border-b', 'border-gray-200'] },
    { match: 'border-start', replace: ['border-l', 'border-gray-200'] },
    { match: 'border-end', replace: ['border-r', 'border-gray-200'] },
    { match: 'border-top-0', replace: ['border-t-0'] },
    { match: 'border-bottom-0', replace: ['border-b-0'] },
    { match: 'border-start-0', replace: ['border-l-0'] },
    { match: 'border-end-0', replace: ['border-r-0'] },
    { match: /^border-(primary|secondary|success|danger|warning|info|light|dark|white)$/, replace: (m) => [`border-${colors[m[1] as keyof typeof colors]}`], confidence: 0.8 },
    { match: 'rounded', replace: ['rounded'] },
    { match: 'rounded-0', replace: ['rounded-none'] },
    { match: 'rounded-circle', replace: ['rounded-full'] },
    { match: 'rounded-pill', replace: ['rounded-full'] },
    { match: 'rounded-top', replace: ['rounded-t'] },
    { match: 'rounded-bottom', replace: ['rounded-b'] },
    { match: 'rounded-start', replace: ['rounded-l'] },
    { match: 'rounded-end', replace: ['rounded-r'] },
    { match: 'rounded-1', replace: ['rounded-sm'] },
    { match: 'rounded-2', replace: ['rounded'] },
    { match: 'rounded-3', replace: ['rounded-md'] },
    { match: 'rounded-4', replace: ['rounded-lg'] },
    { match: 'rounded-5', replace: ['rounded-xl'] },

    // Sizing
    { match: 'w-25', replace: ['w-1/4'] },
    { match: 'w-50', replace: ['w-1/2'] },
    { match: 'w-75', replace: ['w-3/4'] },
    { match: 'w-100', replace: ['w-full'] },
    { match: 'w-auto', replace: ['w-auto'] },
    { match: 'h-25', replace: ['h-1/4'] },
    { match: 'h-50', replace: ['h-1/2'] },
    { match: 'h-75', replace: ['h-3/4'] },
    { match: 'h-100', replace: ['h-full'] },
    { match: 'h-auto', replace: ['h-auto'] },
    { match: 'mw-100', replace: ['max-w-full'] },
    { match: 'mh-100', replace: ['max-h-full'] },

    // Positioning
    { match: 'position-relative', replace: ['relative'] },
    { match: 'position-absolute', replace: ['absolute'] },
    { match: 'position-fixed', replace: ['fixed'] },
    { match: 'position-sticky', replace: ['sticky'] },
    { match: 'top-0', replace: ['top-0'] },
    { match: 'top-50', replace: ['top-1/2'] },
    { match: 'top-100', replace: ['top-full'] },
    { match: 'bottom-0', replace: ['bottom-0'] },
    { match: 'bottom-50', replace: ['bottom-1/2'] },
    { match: 'bottom-100', replace: ['bottom-full'] },
    { match: 'start-0', replace: ['left-0'] },
    { match: 'start-50', replace: ['left-1/2'] },
    { match: 'start-100', replace: ['left-full'] },
    { match: 'end-0', replace: ['right-0'] },
    { match: 'end-50', replace: ['right-1/2'] },
    { match: 'end-100', replace: ['right-full'] },
    { match: 'translate-middle', replace: ['-translate-x-1/2', '-translate-y-1/2'] },
    { match: 'translate-middle-x', replace: ['-translate-x-1/2'] },
    { match: 'translate-middle-y', replace: ['-translate-y-1/2'] },
    { match: 'fixed-top', replace: ['fixed', 'top-0', 'inset-x-0', 'z-50'] },
    { match: 'fixed-bottom', replace: ['fixed', 'bottom-0', 'inset-x-0', 'z-50'] },
    { match: 'sticky-top', replace: ['sticky', 'top-0', 'z-50'] },
    { match: 'sticky-bottom', replace: ['sticky', 'bottom-0', 'z-50'] },

    // Typography
    { match: /^h([1-6])$/, replace: (m) => {
        const sizes = { '1': '4xl', '2': '3xl', '3': '2xl', '4': 'xl', '5': 'lg', '6': 'base' };
        return [`text-${sizes[m[1] as keyof typeof sizes]}`, 'font-medium', 'leading-tight', 'mt-0', 'mb-2'];
    }, confidence: 0.8 },
    { match: /^fs-([1-6])$/, replace: (m) => {
        const sizes = { '1': '4xl', '2': '3xl', '3': '2xl', '4': 'xl', '5': 'lg', '6': 'base' };
        return [`text-${sizes[m[1] as keyof typeof sizes]}`];
    }, confidence: 0.8 },
    { match: /^display-([1-6])$/, replace: (m) => {
        const sizes = { '1': '7xl', '2': '6xl', '3': '5xl', '4': '4xl', '5': '3xl', '6': '2xl' };
        return [`text-${sizes[m[1] as keyof typeof sizes]}`, 'font-light', 'leading-none'];
    }, confidence: 0.8 },
    { match: 'lead', replace: ['text-lg', 'font-light'] },
    { match: 'small', replace: ['text-sm'] },
    { match: 'text-wrap', replace: ['whitespace-normal'] },
    { match: 'text-nowrap', replace: ['whitespace-nowrap'] },
    { match: 'text-break', replace: ['break-words'] },
    { match: 'text-truncate', replace: ['truncate'] },
    { match: 'lh-1', replace: ['leading-none'] },
    { match: 'lh-sm', replace: ['leading-tight'] },
    { match: 'lh-base', replace: ['leading-normal'] },
    { match: 'lh-lg', replace: ['leading-loose'] },

    // Visibility & overflow
    { match: 'visible', replace: ['visible'] },
    { match: 'invisible', replace: ['invisible'] },
    { match: 'overflow-auto', replace: ['overflow-auto'] },
    { match: 'overflow-hidden', replace: ['overflow-hidden'] },
    { match: 'overflow-visible', replace: ['overflow-visible'] },
    { match: 'overflow-scroll', replace: ['overflow-scroll'] },

    // Shadows
    { match: 'shadow-none', replace: ['shadow-none'] },
    { match: 'shadow-sm', replace: ['shadow-sm'] },
    { match: 'shadow', replace: ['shadow'] },
    { match: 'shadow-lg', replace: ['shadow-lg'] },

    // Colors & Backgrounds
    { match: /^text-(primary|secondary|success|danger|warning|info|light|dark|white|muted)$/, replace: (m) => [`text-${colors[m[1] as keyof typeof colors]}`] , confidence: 0.8 },
    { match: /^bg-(primary|secondary|success|danger|warning|info|light|dark|white|transparent)$/, replace: (m) => [`bg-${colors[m[1] as keyof typeof colors]}`] , confidence: 0.8 },
    { match: /^bg-opacity-(10|25|50|75|100)$/, replace: (m) => [`bg-opacity-${m[1]}`] , confidence: 0.8 },
    { match: /^text-opacity-(25|50|75|100)$/, replace: (m) => [`text-opacity-${m[1]}`] , confidence: 0.8 },
    { match: 'bg-gradient', replace: ['bg-gradient-to-b', 'from-white/10', 'to-transparent'] },

    // Flex
    { match: 'flex-row', replace: ['flex-row'] },
    { match: 'flex-column', replace: ['flex-col'] },
    { match: 'flex-row-reverse', replace: ['flex-row-reverse'] },
    { match: 'flex-column-reverse', replace: ['flex-col-reverse'] },
    { match: 'flex-wrap', replace: ['flex-wrap'] },
    { match: 'flex-nowrap', replace: ['flex-nowrap'] },
    { match: 'flex-wrap-reverse', replace: ['flex-wrap-reverse'] },
    { match: 'flex-fill', replace: ['flex-auto'] },
    { match: /^flex-(sm|md|lg|xl|xxl)-(row|column|row-reverse|column-reverse|wrap|nowrap|wrap-reverse|fill)$/, replace: (m) => {
      let f = m[2];
      if (f === 'column') f = 'col';
      if (f === 'column-reverse') f = 'col-reverse';
      if (f === 'fill') f = 'auto';
      return [`${m[1]}:flex-${f}`];
    }, confidence: 0.8 },
    { match: 'flex-grow-0', replace: ['grow-0'] },
    { match: 'flex-grow-1', replace: ['grow'] },
    { match: 'flex-shrink-0', replace: ['shrink-0'] },
    { match: 'flex-shrink-1', replace: ['shrink'] },

    // spacing m, p (BS5 uses start/end for left/right mapping to s/e or l/r)
    {
      match: /^(m|p)(t|b|s|e|x|y)?-(0|1|2|3|4|5|auto)$/,
      replace: (m) => {
        const prop = m[1];
        let side = m[2] || '';
        if (side === 's') side = 'l'; // convert start to left
        if (side === 'e') side = 'r'; // convert end to right
        const size = m[3];
        const mappedSize = spacings[size as keyof typeof spacings];
        return [`${prop}${side}-${mappedSize}`];
      }
    },
    // responsive spacing m, p
    {
      match: /^(m|p)(t|b|s|e|x|y)?-(sm|md|lg|xl|xxl)-(0|1|2|3|4|5|auto)$/,
      replace: (m) => {
        const prop = m[1];
        let side = m[2] || '';
        if (side === 's') side = 'l';
        if (side === 'e') side = 'r';
        const bp = m[3];
        const size = m[4];
        const mappedSize = spacings[size as keyof typeof spacings];
        return [`${bp}:${prop}${side}-${mappedSize}`];
      }
    },
    // g, gx, gy gap
    { match: /^g(x|y)?-(0|1|2|3|4|5)$/, replace: (m) => {
      const axis = m[1] || '';
      const size = m[2];
      const mappedSize = spacings[size as keyof typeof spacings];
      return [`gap${axis ? `-${axis}` : ''}-${mappedSize}`];
    }},
    { match: /^g(x|y)?-(sm|md|lg|xl|xxl)-(0|1|2|3|4|5)$/, replace: (m) => {
      const axis = m[1] || '';
      const bp = m[2];
      const size = m[3];
      const mappedSize = spacings[size as keyof typeof spacings];
      return [`${bp}:gap${axis ? `-${axis}` : ''}-${mappedSize}`];
    }},

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
    { match: 'table-hover', replace: ['[&>tbody>tr:hover>*]:bg-gray-200'] },
];
  return rules;
};

export const bootstrap5: Dialect = {
  name: 'bootstrap5',
  rules: getBootstrap5Rules()
};
