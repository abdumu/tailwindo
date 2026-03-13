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
  'py-1.5',
  'px-4',
  'rounded',
  'leading-normal',
  'no-underline',
  'transition-colors',
  'duration-150',
];

const btnSizes: Record<string, string[]> = {
  'btn-sm': ['py-1', 'px-2', 'text-sm', 'rounded-sm'],
  'btn-lg': ['py-2', 'px-6', 'text-lg', 'rounded-lg'],
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

      // Base btn
      newTokens = remove(newTokens, ['btn']);
      mapped.push({ from: ['btn'], to: btnBase, confidence: 0.9 });

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
  // Alerts
  {
    name: 'alert',
    appliesToDialects: ['bootstrap4', 'bootstrap5'],
    match: (tokens) => tokens.includes('alert'),
    transform: (tokens, options) => {
      let newTokens = [...tokens];
      const mapped: { from: string[]; to: string[]; confidence: number }[] = [];

      newTokens = remove(newTokens, ['alert']);
      mapped.push({ from: ['alert'], to: ['relative', 'py-3', 'px-4', 'mb-4', 'border', 'border-solid', 'border-gray-200', 'border-transparent', 'rounded'], confidence: 0.9 });

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
        'card-header': ['py-3', 'px-4', 'mb-0', 'bg-gray-100', 'border-b', 'border-solid', 'border-gray-200'],
        'card-footer': ['py-3', 'px-4', 'bg-gray-100', 'border-t', 'border-solid', 'border-gray-200'],
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
        'form-check': ['block', 'min-h-[1.5rem]', 'pl-[1.5em]', 'mb-[0.125rem]'],
        'form-check-input': ['float-left', '-ml-[1.5em]', 'w-[1em]', 'h-[1em]', 'mt-[0.25em]', 'align-top', 'bg-white', 'bg-no-repeat', 'bg-center', 'bg-contain', 'border', 'border-solid', 'border-gray-300', 'appearance-none', 'checked:bg-blue-600', 'checked:border-blue-600', 'focus:outline-none'],
        'form-check-label': ['inline-block', 'text-gray-800'],
        'input-group': ['relative', 'flex', 'flex-wrap', 'items-stretch', 'w-full'],
        'input-group-text': ['flex', 'items-center', 'py-1.5', 'px-3', 'text-base', 'font-normal', 'text-gray-700', 'text-center', 'whitespace-nowrap', 'bg-gray-100', 'border', 'border-solid', 'border-gray-300', 'rounded']
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
