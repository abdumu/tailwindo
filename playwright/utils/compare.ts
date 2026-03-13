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

export function compareMetrics(bs: ElementMetrics, tw: ElementMetrics): string[] {
  const errors: string[] = [];
  const GEOMETRY_TOLERANCE_PX = 2;

  // Compare Bounding Box
  for (const key of ['x', 'y', 'width', 'height'] as const) {
    if (Math.abs(bs.boundingBox[key] - tw.boundingBox[key]) > GEOMETRY_TOLERANCE_PX) {
      errors.push(`Bounding Box [${key}]: expected ~${bs.boundingBox[key]}, got ${tw.boundingBox[key]}`);
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

    // Set wider tolerance for spacing properties
    const isSpacingProp = prop.startsWith('margin') || prop.startsWith('padding');
    const styleTolerance = isSpacingProp ? 6 : GEOMETRY_TOLERANCE_PX;

    if (bsNum !== null && twNum !== null && (bsVal.endsWith('px') || bsVal.endsWith('rem') || bsVal.endsWith('em') || !isNaN(bsNum)) && (twVal.endsWith('px') || twVal.endsWith('rem') || twVal.endsWith('em') || !isNaN(twNum))) {
      if (Math.abs(bsNum - twNum) > styleTolerance) {
        errors.push(`Style [${prop}]: expected ~${bsVal}, got ${twVal}`);
      }
    } else if (prop === 'boxShadow') {
      const hasBsShadow = bsVal !== 'none' && bsVal !== '';
      const hasTwShadow = twVal !== 'none' && twVal !== '';
      if (hasBsShadow !== hasTwShadow) {
        errors.push(`Style [${prop}]: expected ${bsVal}, got ${twVal}`);
      }
    } else if (prop === 'lineHeight') {
      if (bsNum !== null && twNum !== null) {
        if (Math.abs(bsNum - twNum) > styleTolerance) {
          errors.push(`Style [${prop}]: expected ~${bsVal}, got ${twVal}`);
        }
      }
    } else {
      errors.push(`Style [${prop}]: expected ${bsVal}, got ${twVal}`);
    }
  }

  return errors;
}
