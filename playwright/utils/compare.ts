import { Page, Locator } from '@playwright/test';

export interface ElementMetrics {
  boundingBox: { x: number; y: number; width: number; height: number };
  styles: Record<string, string>;
}

const METRIC_PROPS = [
  'display', 'position',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'fontSize', 'fontWeight', 'lineHeight',
  'color', 'backgroundColor',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
  'boxShadow',
  'justifyContent', 'alignItems', 'gap', 'flexDirection', 'flexWrap'
];

export async function getElementMetrics(page: Page, locator: Locator): Promise<ElementMetrics> {
  const boundingBox = await locator.boundingBox();
  if (!boundingBox) {
    throw new Error('Element not found or not visible');
  }

  const styles = await locator.evaluate((el: HTMLElement) => {
    const computed = window.getComputedStyle(el);
    const props = [
      'display', 'position',
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontSize', 'fontWeight', 'lineHeight',
      'color', 'backgroundColor',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
      'boxShadow',
      'justifyContent', 'alignItems', 'gap', 'flexDirection', 'flexWrap'
    ];
    const res: Record<string, string> = {};
    props.forEach(p => {
      res[p] = computed[p as any] || '';
    });
    return res;
  });

  return { boundingBox, styles };
}

function extractNumber(val: string): number | null {
  const match = val.match(/^([-\d.]+)/);
  if (match) return parseFloat(match[1]);
  return null;
}

export interface ComparisonDiff {
  geometry: string[];
  spacing: string[];
  typography: string[];
  colors: string[];
  borders: string[];
  effects: string[];
  layout: string[];
}

// Specific overrides table keyed by fixture name -> property -> tolerance
const FIXTURE_OVERRIDES: Record<string, Record<string, number>> = {
  // Example: 'grid': { 'marginRight': 6 }
};

export function compareMetrics(bs: ElementMetrics, tw: ElementMetrics, fixtureName: string = ''): ComparisonDiff {
  const diff: ComparisonDiff = {
    geometry: [],
    spacing: [],
    typography: [],
    colors: [],
    borders: [],
    effects: [],
    layout: [],
  };
  const GEOMETRY_TOLERANCE_PX = 2;

  const overrides = FIXTURE_OVERRIDES[fixtureName] || {};

  // Compare Bounding Box
  for (const key of ['x', 'y', 'width', 'height'] as const) {
    const tolerance = overrides[key] !== undefined ? overrides[key] : GEOMETRY_TOLERANCE_PX;
    if (Math.abs(bs.boundingBox[key] - tw.boundingBox[key]) > tolerance) {
      diff.geometry.push(`Bounding Box [${key}]: expected ~${bs.boundingBox[key]}, got ${tw.boundingBox[key]}`);
    }
  }

  // Compare Styles
  for (const prop of METRIC_PROPS) {
    const bsVal = bs.styles[prop];
    const twVal = tw.styles[prop];

    // Same value
    if (bsVal === twVal) continue;

    const bsNum = extractNumber(bsVal);
    const twNum = extractNumber(twVal);

    // Avoid exact color matches given Tailwind uses a custom palette and Bootstrap uses distinct hex
    if (prop === 'color' || prop === 'backgroundColor') {
      continue;
    }

    let category: keyof ComparisonDiff = 'layout';
    if (prop.startsWith('margin') || prop.startsWith('padding')) category = 'spacing';
    else if (prop.startsWith('font') || prop === 'lineHeight') category = 'typography';
    else if (prop.toLowerCase().includes('color')) category = 'colors';
    else if (prop.startsWith('border')) category = 'borders';
    else if (prop === 'boxShadow') category = 'effects';
    else if (['display', 'position', 'justifyContent', 'alignItems', 'gap', 'flexDirection', 'flexWrap'].includes(prop)) category = 'layout';

    // Strict default tolerance
    const styleTolerance = overrides[prop] !== undefined ? overrides[prop] : GEOMETRY_TOLERANCE_PX;

    if (bsNum !== null && twNum !== null && (bsVal.endsWith('px') || bsVal.endsWith('rem') || bsVal.endsWith('em') || !isNaN(bsNum)) && (twVal.endsWith('px') || twVal.endsWith('rem') || twVal.endsWith('em') || !isNaN(twNum))) {
      if (Math.abs(bsNum - twNum) > styleTolerance) {
        diff[category].push(`Style [${prop}]: expected ~${bsVal}, got ${twVal}`);
      }
    } else if (prop === 'boxShadow') {
      const hasBsShadow = bsVal !== 'none' && bsVal !== '';
      const hasTwShadow = twVal !== 'none' && twVal !== '';
      if (hasBsShadow !== hasTwShadow) {
        diff[category].push(`Style [${prop}]: expected ${bsVal}, got ${twVal}`);
      }
    } else if (prop === 'lineHeight') {
      if (bsNum !== null && twNum !== null) {
        if (Math.abs(bsNum - twNum) > styleTolerance) {
          diff[category].push(`Style [${prop}]: expected ~${bsVal}, got ${twVal}`);
        }
      }
    } else {
      diff[category].push(`Style [${prop}]: expected ${bsVal}, got ${twVal}`);
    }
  }

  return diff;
}
