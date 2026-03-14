import { Dialect, RuleType } from '../engine/converter.js';

export const getBulmaRules = (): RuleType[] => {
  const rules: RuleType[] = [
    // Layout
    { match: 'container', replace: ['container', 'mx-auto'], confidence: 0.8 },
    { match: 'section', replace: ['py-12', 'px-6'], confidence: 0.8 },
    { match: 'columns', replace: ['flex', 'flex-wrap', '-mx-3'], confidence: 0.8 },
    { match: 'column', replace: ['flex-1', 'px-3'], confidence: 0.8 },

    // Widths
    { match: 'is-half', replace: ['w-1/2'] },
    { match: 'is-one-third', replace: ['w-1/3'] },
    { match: 'is-two-thirds', replace: ['w-2/3'] },
    { match: 'is-one-quarter', replace: ['w-1/4'] },
    { match: 'is-three-quarters', replace: ['w-3/4'] },
    { match: 'is-full', replace: ['w-full'] },

    // Typography
    { match: 'title', replace: ['text-3xl', 'font-bold', 'mb-6'] },
    { match: 'subtitle', replace: ['text-xl', 'font-normal', 'mb-6'] },
    { match: /^is-([1-6])$/, replace: (m) => {
        const sizes = { '1': '6xl', '2': '5xl', '3': '4xl', '4': '3xl', '5': '2xl', '6': 'xl' };
        return [`text-${sizes[m[1] as keyof typeof sizes]}`];
    }, confidence: 0.8 },
    { match: 'has-text-centered', replace: ['text-center'] },
    { match: 'has-text-left', replace: ['text-left'] },
    { match: 'has-text-right', replace: ['text-right'] },
    { match: /^has-text-(primary|link|info|success|warning|danger)$/, replace: (m) => {
        const colors = {
            primary: 'teal-500',
            link: 'blue-500',
            info: 'cyan-500',
            success: 'green-500',
            warning: 'yellow-500',
            danger: 'red-500'
        };
        return [`text-${colors[m[1] as keyof typeof colors]}`];
    }, confidence: 0.8 },

    // Buttons
    { match: 'button', replace: ['inline-flex', 'items-center', 'justify-center', 'px-4', 'py-2', 'border', 'rounded', 'leading-none', 'focus:outline-none', 'transition-colors'] },
    { match: /^is-(primary|link|info|success|warning|danger|light|dark)$/, replace: (m) => {
        const colors = {
            primary: 'teal-500',
            link: 'blue-500',
            info: 'cyan-500',
            success: 'green-500',
            warning: 'yellow-500',
            danger: 'red-500',
            light: 'gray-100',
            dark: 'gray-800'
        };
        const c = colors[m[1] as keyof typeof colors];
        const textC = ['warning', 'light'].includes(m[1]) ? 'text-gray-900' : 'text-white';
        return [`bg-${c}`, `border-${c}`, textC];
    }, confidence: 0.8 },
    { match: 'is-outlined', replace: ['bg-transparent', 'hover:bg-current', 'hover:text-white'] }, // This usually needs contextual processing for the color
    { match: 'is-small', replace: ['text-sm', 'px-3', 'py-1'] },
    { match: 'is-medium', replace: ['text-lg', 'px-5', 'py-2.5'] },
    { match: 'is-large', replace: ['text-xl', 'px-6', 'py-3'] },

    // Components
    { match: 'box', replace: ['bg-white', 'rounded-lg', 'shadow', 'p-5'] },
    { match: 'card', replace: ['bg-white', 'rounded', 'shadow', 'overflow-hidden'] },
    { match: 'notification', replace: ['bg-gray-100', 'rounded', 'p-5'] },
    { match: 'message', replace: ['bg-gray-100', 'rounded', 'overflow-hidden'] },

    // Forms
    { match: 'field', replace: ['mb-3'] },
    { match: 'control', replace: ['relative'] },
    { match: 'input', replace: ['appearance-none', 'inline-flex', 'items-center', 'justify-start', 'relative', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded', 'shadow-inner', 'leading-normal', 'focus:outline-none'] },
    { match: 'textarea', replace: ['appearance-none', 'block', 'w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded', 'leading-normal', 'focus:outline-none'] },
    { match: 'select', replace: ['inline-block', 'relative'] },
    { match: 'label', replace: ['block', 'text-gray-700', 'font-bold', 'mb-2'] },
    { match: 'help', replace: ['block', 'text-xs', 'mt-1', 'text-gray-500'] },
  ];
  return rules;
};

export const bulma: Dialect = {
  name: 'bulma',
  rules: getBulmaRules()
};
