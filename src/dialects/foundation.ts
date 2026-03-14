import { Dialect, RuleType } from '../engine/converter.js';

export const getFoundationRules = (): RuleType[] => {
  const rules: RuleType[] = [
    // Grid
    { match: 'grid-x', replace: ['flex', 'flex-wrap'] },
    { match: 'grid-y', replace: ['flex', 'flex-col'] },
    { match: 'cell', replace: ['flex-1', 'min-w-0'] },

    // Widths
    { match: /^(small|medium|large)-([1-9]|1[0-2])$/, replace: (m) => {
        const bp = m[1] === 'small' ? 'sm' : (m[1] === 'medium' ? 'md' : 'lg');
        return [`${bp}:w-${m[2]}/12`];
    }, confidence: 0.8 },
    { match: /^(small|medium|large)-auto$/, replace: (m) => {
        const bp = m[1] === 'small' ? 'sm' : (m[1] === 'medium' ? 'md' : 'lg');
        return [`${bp}:w-auto`];
    }, confidence: 0.8 },
    { match: /^(small|medium|large)-shrink$/, replace: (m) => {
        const bp = m[1] === 'small' ? 'sm' : (m[1] === 'medium' ? 'md' : 'lg');
        return [`${bp}:w-min`]; // approximation
    }, confidence: 0.8 },

    // Components
    { match: 'button', replace: ['inline-block', 'align-middle', 'text-center', 'cursor-pointer', 'px-4', 'py-3', 'text-sm', 'leading-normal', 'font-normal', 'transition-colors', 'duration-300', 'bg-blue-600', 'text-white', 'hover:bg-blue-700'] },
    { match: 'callout', replace: ['relative', 'mb-4', 'p-4', 'border', 'border-gray-300', 'bg-gray-100', 'text-gray-800'] },
    { match: 'top-bar', replace: ['flex', 'items-center', 'justify-between', 'p-2', 'bg-gray-200'] },
    { match: 'menu', replace: ['flex', 'flex-wrap', 'list-none', 'p-0', 'm-0'] },
    { match: 'label', replace: ['inline-block', 'px-2', 'py-1', 'text-xs', 'leading-none', 'whitespace-nowrap', 'text-center', 'font-bold', 'rounded-sm', 'bg-blue-600', 'text-white'] },
    { match: 'badge', replace: ['inline-block', 'px-2', 'py-0.5', 'text-xs', 'leading-none', 'whitespace-nowrap', 'text-center', 'font-bold', 'rounded-full', 'bg-blue-600', 'text-white'] },

    // Utilities
    { match: 'text-center', replace: ['text-center'] },
    { match: 'text-left', replace: ['text-left'] },
    { match: 'text-right', replace: ['text-right'] },

    // Visibility
    { match: /^(show-for|hide-for)-(small|medium|large|xlarge|xxlarge)(-(only|up|down))?$/, replace: (m) => {
        const action = m[1];
        let bp = m[2];
        const mod = m[4] || 'up';

        if (bp === 'small') bp = 'sm';
        else if (bp === 'medium') bp = 'md';
        else if (bp === 'large') bp = 'lg';
        else if (bp === 'xlarge') bp = 'xl';
        else if (bp === 'xxlarge') bp = '2xl';

        if (action === 'show-for') {
            return ['hidden', `${bp}:block`];
        } else {
            return [`${bp}:hidden`];
        }
    }, confidence: 0.7 } // Approximate mapping
  ];
  return rules;
};

export const foundation: Dialect = {
  name: 'foundation',
  rules: getFoundationRules()
};
