import { RuleType } from '../engine/converter.js';

export const sharedComponentRules: RuleType[] = [
  // General Utilities
  { match: 'whitespace-no-wrap', replace: ['whitespace-nowrap'] },
  { match: 'flex-no-wrap', replace: ['flex-nowrap'] },
  { match: 'flex-no-shrink', replace: ['flex-shrink-0'] },
  { match: 'sr-only-focusable', replace: ['focus:not-sr-only'] },
  { match: 'border-1', replace: ['border'] },

  // Buttons
  { match: 'btn', replace: ['inline-block', 'font-normal', 'text-center', 'align-middle', 'cursor-pointer', 'select-none', 'border', 'border-transparent', 'py-2', 'px-4', 'rounded', 'leading-normal'] },
  { match: 'btn-primary', replace: ['bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-4', 'focus:ring-blue-300'] },
  { match: 'btn-secondary', replace: ['bg-gray-600', 'text-white', 'hover:bg-gray-700'] },
  { match: 'btn-block', replace: ['w-full', 'block'] },

  // Grid
  { match: 'row', replace: ['flex', 'flex-wrap', '-mx-4'] },
  { match: 'col', replace: ['px-4', 'flex-1'] },
  { match: /^col-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => [`w-${m[1]}/12`, 'px-4'] },
  { match: /^col-(sm|md|lg|xl|xxl)-(1|2|3|4|5|6|7|8|9|10|11|12)$/, replace: (m) => {
    const bp = m[1] === 'xxl' ? '2xl' : m[1];
    return [`${bp}:w-${m[2]}/12`, 'px-4'];
  }},

  // Cards
  { match: 'card', replace: ['relative', 'flex', 'flex-col', 'min-w-0', 'break-words', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow-sm'] },
  { match: 'card-body', replace: ['flex-auto', 'p-5'] },

  // Forms
  { match: 'form-control', replace: ['block', 'w-full', 'px-3', 'py-1.5', 'text-base', 'font-normal', 'text-gray-700', 'bg-white', 'bg-clip-padding', 'border', 'border-gray-300', 'rounded', 'transition', 'ease-in-out', 'm-0', 'focus:text-gray-700', 'focus:bg-white', 'focus:border-blue-600', 'focus:outline-none'] },

  // Alerts
  { match: 'alert', replace: ['relative', 'px-4', 'py-3', 'mb-4', 'border', 'rounded'] },
  { match: 'alert-primary', replace: ['bg-blue-100', 'border-blue-400', 'text-blue-700'] },
  { match: 'alert-secondary', replace: ['bg-gray-100', 'border-gray-400', 'text-gray-700'] },
  { match: 'alert-success', replace: ['bg-green-100', 'border-green-400', 'text-green-700'] },
  { match: 'alert-danger', replace: ['bg-red-100', 'border-red-400', 'text-red-700'] },
  { match: 'alert-warning', replace: ['bg-yellow-100', 'border-yellow-400', 'text-yellow-700'] },
  { match: 'alert-info', replace: ['bg-teal-100', 'border-teal-400', 'text-teal-700'] },
  { match: 'alert-light', replace: ['bg-white', 'border-gray-300', 'text-gray-800'] },
  { match: 'alert-dark', replace: ['bg-gray-800', 'border-gray-900', 'text-white'] }
];
