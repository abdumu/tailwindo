export type ContextRule = {
  name: string;
  appliesToDialects: ('bootstrap4' | 'bootstrap5')[];
  match: (tokens: string[]) => boolean;
  transform: (
    tokens: string[],
    options?: {
      colors?: Record<string, string>;
      spacings?: Record<string, string>;
    }
  ) => {
    tokens: string[];
    mapped: { from: string[]; to: string[]; confidence: number }[];
    unmappedBootstrapTokens?: string[];
  };
  confidence: number;
};

// Helpers
export const hasAll = (tokens: string[], required: string[]) => required.every((t) => tokens.includes(t));
export const hasAny = (tokens: string[], anyOf: string[]) => anyOf.some((t) => tokens.includes(t));
export const remove = (tokens: string[], toRemove: string[]) => tokens.filter((t) => !toRemove.includes(t));
export const replaceOne = (tokens: string[], from: string, to: string[]) => {
  const index = tokens.indexOf(from);
  if (index === -1) return tokens;
  const newTokens = [...tokens];
  newTokens.splice(index, 1, ...to);
  return newTokens;
};

// Common components styles map
const btnBase = [
  'inline-block',
  'font-normal',
  'text-center',
  'whitespace-nowrap',
  'align-middle',
  'select-none',
  'border',
  'border-solid',
  'border-gray-200',
  'border-transparent',
  'py-[0.375rem]',
  'px-[0.75rem]',
  'rounded-[0.375rem]',
  'leading-[1.5]',
  'text-[1rem]',
  'no-underline',
  'transition-colors',
  'duration-150',
];

const btnSizes: Record<string, string[]> = {
  'btn-sm': ['py-[0.25rem]', 'px-[0.5rem]', 'text-[0.875rem]', 'rounded-[0.25rem]', 'leading-[1.5]'],
  'btn-lg': ['py-[0.5rem]', 'px-[1rem]', 'text-[1.25rem]', 'rounded-[0.5rem]', 'leading-[1.5]'],
};

const getBtnColors = (variant: string, colors: Record<string, string>) => {
  const c = colors[variant] || 'gray-500';
  const isLight = ['warning', 'info', 'light'].includes(variant);
  const textC = isLight ? 'text-gray-900' : 'text-white';
  const hoverC = c.replace(/\d+/, (d) => String(Math.max(0, parseInt(d) - 100)));
  return [`bg-${c}`, `border-${c}`, textC, `hover:bg-${hoverC}`];
};

const getBtnOutlineColors = (variant: string, colors: Record<string, string>) => {
  const c = colors[variant] || 'gray-500';
  return [`text-${c}`, `border-${c}`, `hover:bg-${c}`, 'hover:text-white'];
};

const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];

export const contextualRules: ContextRule[] = [
  // Buttons
  {
    name: 'button',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => tokens.includes('btn'),
    transform: (tokens, options) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];
      const colors = options?.colors || {
        primary: 'blue-600',
        secondary: 'gray-600',
        success: 'green-500',
        danger: 'red-600',
        warning: 'yellow-400',
        info: 'cyan-400',
        light: 'gray-100',
        dark: 'gray-800',
      };

      // Determine size overrides before pushing base
      const hasSm = tokens.includes('btn-sm');
      const hasLg = tokens.includes('btn-lg');

      const filteredBtnBase = btnBase.filter(cls => {
         if (hasSm || hasLg) {
           if (cls.startsWith('py-') || cls.startsWith('px-') || cls.startsWith('text-') || cls.startsWith('rounded-') || cls.startsWith('leading-')) {
             return false;
           }
         }
         return true;
      });

      // Base btn
      newTokens = remove(newTokens, ['btn']);
      mapped.push({ from: ['btn'], to: filteredBtnBase, confidence: 0.9 });

      // Variants
      for (const variant of variants) {
        if (newTokens.includes(`btn-${variant}`)) {
          newTokens = remove(newTokens, [`btn-${variant}`]);
          if (variant === 'link') {
            mapped.push({ from: [`btn-${variant}`], to: ['font-normal', 'text-blue-600', 'underline', 'hover:text-blue-800'], confidence: 0.9 });
          } else {
            mapped.push({ from: [`btn-${variant}`], to: getBtnColors(variant, colors), confidence: 0.9 });
          }
        }
        if (newTokens.includes(`btn-outline-${variant}`)) {
          newTokens = remove(newTokens, [`btn-outline-${variant}`]);
          mapped.push({ from: [`btn-outline-${variant}`], to: getBtnOutlineColors(variant, colors), confidence: 0.9 });
        }
      }

      // Sizes
      for (const size of Object.keys(btnSizes)) {
        if (newTokens.includes(size)) {
          newTokens = remove(newTokens, [size]);
          mapped.push({ from: [size], to: btnSizes[size], confidence: 0.9 });
        }
      }

      // Block (BS4)
      if (newTokens.includes('btn-block')) {
        newTokens = remove(newTokens, ['btn-block']);
        mapped.push({ from: ['btn-block'], to: ['block', 'w-full'], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Bulma Buttons
  {
    name: 'bulma-button',
    appliesToDialects: ['bulma'] as any[], // cast because types might need update if strict
    match: (tokens) => tokens.includes('button'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];
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

      const isLarge = newTokens.includes('is-large');

      newTokens = remove(newTokens, ['button']);
      if (isLarge) {
          mapped.push({ from: ['button'], to: ['relative', 'inline-flex', 'items-center', 'justify-center', 'px-[1.5rem]', 'py-[0.6875rem]', 'border-[1px]', 'border-solid', 'border-transparent', 'rounded-[4px]', 'leading-[1.5]', 'text-[1.5rem]', 'focus:outline-none', 'transition-colors'], confidence: 0.9 });
      } else {
          mapped.push({ from: ['button'], to: ['relative', 'inline-flex', 'items-center', 'justify-center', 'px-[1rem]', 'py-[0.4375rem]', 'border-[1px]', 'border-solid', 'border-transparent', 'rounded-[4px]', 'leading-[1.5]', 'text-[1rem]', 'focus:outline-none', 'transition-colors'], confidence: 0.9 });
      }

      for (const variant of Object.keys(colors)) {
        if (newTokens.includes(`is-${variant}`)) {
          newTokens = remove(newTokens, [`is-${variant}`]);
          const c = colors[variant as keyof typeof colors];
          const textC = ['warning', 'light'].includes(variant) ? 'text-gray-900' : 'text-white';

          if (newTokens.includes('is-outlined')) {
             newTokens = remove(newTokens, ['is-outlined']);
             mapped.push({ from: [`is-${variant}`, 'is-outlined'], to: [`border-${c}`, `text-${c}`, 'bg-transparent', `hover:bg-${c}`, 'hover:text-white'], confidence: 0.9 });
          } else {
             mapped.push({ from: [`is-${variant}`], to: [`bg-${c}`, `border-${c}`, textC], confidence: 0.9 });
          }
        }
      }

      if (newTokens.includes('is-small')) {
          newTokens = remove(newTokens, ['is-small']);
          mapped.push({ from: ['is-small'], to: ['text-sm', 'px-3', 'py-1'], confidence: 0.9 });
      }
      if (newTokens.includes('is-medium')) {
          newTokens = remove(newTokens, ['is-medium']);
          mapped.push({ from: ['is-medium'], to: ['text-lg', 'px-5', 'py-2.5'], confidence: 0.9 });
      }
      if (newTokens.includes('is-large')) {
          newTokens = remove(newTokens, ['is-large']);
          mapped.push({ from: ['is-large'], to: [], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Bulma Columns Wrappers
  {
    name: 'bulma-columns-wrapper',
    appliesToDialects: ['bulma'] as any[],
    match: (tokens) => tokens.includes('columns'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['columns']);
      mapped.push({ from: ['columns'], to: ['flex', 'flex-wrap', '-mx-3'], confidence: 0.9 });

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Foundation Button
  {
    name: 'foundation-button',
    appliesToDialects: ['foundation'] as any[],
    match: (tokens) => tokens.includes('button'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['button']);

      const hasLarge = newTokens.includes('large');
      const hasSmall = newTokens.includes('small');
      const hasTiny = newTokens.includes('tiny');

      let buttonBase = ['inline-block', 'align-middle', 'text-center', 'cursor-pointer', 'px-[1rem]', 'py-[0.85em]', 'text-[0.9rem]', 'leading-[1]', 'font-normal', 'transition-colors', 'duration-300', 'bg-blue-600', 'text-white', 'hover:bg-blue-700', 'border-[1px]', 'border-solid', 'border-transparent', 'mb-[1rem]', 'm-0'];

      if (hasLarge || hasSmall || hasTiny) {
         buttonBase = buttonBase.filter(cls => !cls.startsWith('py-') && !cls.startsWith('px-') && !cls.startsWith('text-') && cls !== 'leading-[1]');
      }

      const hasSecondary = newTokens.includes('secondary');
      const hasSuccess = newTokens.includes('success');
      const hasWarning = newTokens.includes('warning');
      const hasAlert = newTokens.includes('alert');

      if (hasSecondary || hasSuccess || hasWarning || hasAlert) {
         buttonBase = buttonBase.filter(cls => !cls.startsWith('bg-') && !cls.startsWith('text-') && !cls.startsWith('hover:bg-'));
      }

      mapped.push({ from: ['button'], to: buttonBase, confidence: 0.9 });

      if (hasLarge) {
        newTokens = remove(newTokens, ['large']);
        mapped.push({ from: ['large'], to: ['px-[1.25rem]', 'py-[1.0625rem]', 'text-[1.25rem]'], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Bulma Column Item
  {
    name: 'bulma-column',
    appliesToDialects: ['bulma'] as any[],
    match: (tokens) => tokens.includes('column'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['column']);

      const widthMap: Record<string, string> = {
          'is-half': 'w-1/2',
          'is-one-third': 'w-1/3',
          'is-two-thirds': 'w-2/3',
          'is-one-quarter': 'w-1/4',
          'is-three-quarters': 'w-3/4',
          'is-full': 'w-full'
      };

      let widthAdded = false;
      for (const [bulmaCls, twCls] of Object.entries(widthMap)) {
          if (newTokens.includes(bulmaCls)) {
              newTokens = remove(newTokens, [bulmaCls]);
              mapped.push({ from: ['column', bulmaCls], to: [twCls, 'px-3'], confidence: 0.9 });
              widthAdded = true;
          }
      }

      if (!widthAdded) {
          mapped.push({ from: ['column'], to: ['flex-1', 'px-3'], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Foundation Grid Wrapper
  {
    name: 'foundation-grid-x',
    appliesToDialects: ['foundation'] as any[],
    match: (tokens) => tokens.includes('grid-x'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['grid-x']);
      mapped.push({ from: ['grid-x'], to: ['flex', 'flex-wrap'], confidence: 0.9 });

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Foundation Cell Item
  {
    name: 'foundation-cell',
    appliesToDialects: ['foundation'] as any[],
    match: (tokens) => tokens.includes('cell'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['cell']);

      let widthAdded = false;

      const sizes = ['small', 'medium', 'large'];
      const fractions = Array.from({length: 12}, (_, i) => i + 1);

      for (const size of sizes) {
          const bp = size === 'small' ? 'sm' : (size === 'medium' ? 'md' : 'lg');
          for (const num of fractions) {
              const fCls = `${size}-${num}`;
              if (newTokens.includes(fCls)) {
                  newTokens = remove(newTokens, [fCls]);
                  mapped.push({ from: ['cell', fCls], to: [`${bp}:w-${num}/12`, 'min-w-0'], confidence: 0.9 });
                  widthAdded = true;
              }
          }
      }

      if (!widthAdded) {
          mapped.push({ from: ['cell'], to: ['flex-1', 'min-w-0'], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Alerts
  {
    name: 'alert',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => tokens.includes('alert'),
    transform: (tokens, options) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['alert']);
      mapped.push({ from: ['alert'], to: ['relative', 'p-[1rem]', 'mb-[1rem]', 'border-[1px]', 'border-solid', 'border-transparent', 'rounded-[0.375rem]'], confidence: 0.9 });

      const colors = options?.colors || {
        primary: 'blue-800',
        secondary: 'gray-800',
        success: 'green-800',
        danger: 'red-800',
        warning: 'yellow-800',
        info: 'cyan-800',
        light: 'gray-800',
        dark: 'gray-800',
      };

      for (const variant of variants) {
        if (newTokens.includes(`alert-${variant}`)) {
          newTokens = remove(newTokens, [`alert-${variant}`]);
          const baseColor = variant === 'warning' ? 'yellow' : (variant === 'danger' ? 'red' : (variant === 'success' ? 'green' : 'blue'));
          mapped.push({ from: [`alert-${variant}`], to: [`text-${baseColor}-800`, `bg-${baseColor}-100`, `border-${baseColor}-200`], confidence: 0.9 });
        }
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Badges
  {
    name: 'badge',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => tokens.includes('badge'),
    transform: (tokens, options) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['badge']);
      mapped.push({ from: ['badge'], to: ['inline-block', 'py-1', 'px-2', 'text-xs', 'font-bold', 'leading-none', 'text-center', 'whitespace-nowrap', 'align-baseline', 'rounded'], confidence: 0.9 });

      for (const variant of variants) {
        if (newTokens.includes(`badge-${variant}`)) {
          newTokens = remove(newTokens, [`badge-${variant}`]);
          const baseColor = variant === 'warning' ? 'yellow' : (variant === 'danger' ? 'red' : (variant === 'success' ? 'green' : (variant === 'secondary' ? 'gray' : 'blue')));
          mapped.push({ from: [`badge-${variant}`], to: [`bg-${baseColor}-500`, 'text-white'], confidence: 0.9 });
        }
      }

      if (newTokens.includes('badge-pill')) {
         newTokens = remove(newTokens, ['badge-pill']);
         mapped.push({ from: ['badge-pill'], to: ['rounded-full', 'px-3'], confidence: 0.9 });
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Cards
  {
    name: 'card',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => tokens.includes('card'),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['card']);
      mapped.push({ from: ['card'], to: ['relative', 'flex', 'flex-col', 'min-w-0', 'break-words', 'bg-white', 'bg-clip-border', 'border', 'border-solid', 'border-gray-200', 'rounded-md'], confidence: 0.9 });

      const cardParts: Record<string, string[]> = {
        'card-body': ['flex-auto', 'p-4'],
        'card-title': ['mb-2', 'text-xl', 'font-medium'],
        'card-text': ['mb-4'],
        'card-header': ['py-3', 'px-4', 'mb-0', 'bg-gray-100', 'border-b', 'border-gray-200'],
        'card-footer': ['py-3', 'px-4', 'bg-gray-100', 'border-t', 'border-gray-200'],
        'card-img-top': ['w-full', 'rounded-t-md']
      };

      for (const [part, to] of Object.entries(cardParts)) {
        if (newTokens.includes(part)) {
          newTokens = remove(newTokens, [part]);
          mapped.push({ from: [part], to, confidence: 0.9 });
        }
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  },
  // Forms
  {
    name: 'form',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => hasAny(tokens, ['form-control', 'form-select', 'form-check', 'input-group']),
    transform: (tokens) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      const formParts: Record<string, string[]> = {
        'form-control': ['block', 'w-full', 'py-1.5', 'px-3', 'text-base', 'font-normal', 'text-gray-700', 'bg-white', 'bg-clip-padding', 'border', 'border-solid', 'border-gray-300', 'rounded', 'transition', 'ease-in-out', 'm-0', 'focus:text-gray-700', 'focus:bg-white', 'focus:border-blue-600', 'focus:outline-none'],
        'form-control-sm': ['py-1', 'px-2', 'text-sm', 'rounded-sm'],
        'form-control-lg': ['py-2', 'px-4', 'text-lg', 'rounded-lg'],
        'form-select': ['block', 'w-full', 'py-1.5', 'px-3', 'text-base', 'font-normal', 'text-gray-700', 'bg-white', 'bg-clip-padding', 'border', 'border-solid', 'border-gray-300', 'rounded', 'transition', 'ease-in-out', 'm-0', 'focus:text-gray-700', 'focus:bg-white', 'focus:border-blue-600', 'focus:outline-none'],
        'form-label': ['inline-block', 'mb-2', 'text-gray-700'],
        'form-check': ['block', 'min-h-[1.5rem]', 'pl-[1.5em]', 'mb-4'],
        'form-check-input': ['float-left', '-ml-[1.5em]', 'w-[1em]', 'h-[1em]', 'mt-[0.25em]', 'align-top', 'bg-white', 'bg-no-repeat', 'bg-center', 'bg-contain', 'border', 'border-gray-300', 'appearance-none', 'checked:bg-blue-600', 'checked:border-blue-600', 'focus:outline-none'],
        'form-check-label': ['inline-block', 'text-gray-800'],
        'input-group': ['relative', 'flex', 'flex-wrap', 'items-stretch', 'w-full'],
        'input-group-text': ['flex', 'items-center', 'py-1.5', 'px-3', 'text-base', 'font-normal', 'text-gray-700', 'text-center', 'whitespace-nowrap', 'bg-gray-100', 'border', 'border-gray-300', 'rounded']
      };

      for (const [part, to] of Object.entries(formParts)) {
        if (newTokens.includes(part)) {
          newTokens = remove(newTokens, [part]);
          mapped.push({ from: [part], to, confidence: 0.9 });
        }
      }

      const allToTokens = mapped.flatMap((m) => m.to);
      return { tokens: [...newTokens, ...allToTokens], mapped };
    },
    confidence: 0.9,
  }
];
