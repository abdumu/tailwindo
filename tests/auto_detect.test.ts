import { describe, it, expect } from 'vitest';
import { autoDetectDialect } from '../src/dialects/index.js';

describe('Auto Detect Dialect', () => {
  it('detects bootstrap 5', () => {
    expect(autoDetectDialect('<div class="g-3 ms-2 fw-bold text-start"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="col-md-6 btn-primary container-fluid text-end"></div>')).toBe('bootstrap5');
  });

  it('detects bootstrap 4', () => {
    expect(autoDetectDialect('<div class="ml-2 pr-3 font-weight-bold text-left"></div>')).toBe('bootstrap4');
    expect(autoDetectDialect('<div class="col-md-6 btn-primary container-fluid font-weight-light"></div>')).toBe('bootstrap4');
  });

  it('detects bulma', () => {
    expect(autoDetectDialect('<div class="columns"><div class="column is-half has-text-centered"></div></div>')).toBe('bulma');
    expect(autoDetectDialect('<div class="hero notification"><div class="box field control"></div></div>')).toBe('bulma');
  });

  it('detects foundation', () => {
    expect(autoDetectDialect('<div class="grid-x"><div class="cell small-12 medium-6"></div></div>')).toBe('foundation');
    expect(autoDetectDialect('<div class="callout top-bar hide-for-small-only"></div>')).toBe('foundation');
  });

  it('handles mixed content resolving to highest score', () => {
    // Both bulma and bootstrap, but bulma signals are stronger
    expect(autoDetectDialect('<div class="columns column is-half btn-primary container-fluid"></div>')).toBe('bulma');

    // Foundation grid but some bootstrap colors
    expect(autoDetectDialect('<div class="grid-x cell small-12 btn-primary"></div>')).toBe('foundation');
  });
});
