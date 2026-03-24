import { describe, it, expect } from 'vitest';
import { Converter, Dialect } from '../src/engine/converter.js';

describe('Token Classification', () => {
  it('identifies unmapped bootstrap tokens', () => {
    const converter = new Converter({ name: 'bootstrap5', rules: [] });

    // Spacing
    expect(converter.isFrameworkLikeToken('mt-3')).toBe(true);
    expect(converter.isFrameworkLikeToken('px-4')).toBe(true);
    // Display
    expect(converter.isFrameworkLikeToken('d-none')).toBe(true);
    // Grid/Components
    expect(converter.isFrameworkLikeToken('container')).toBe(true);
    expect(converter.isFrameworkLikeToken('row')).toBe(true);
    expect(converter.isFrameworkLikeToken('col-md-6')).toBe(true);
    expect(converter.isFrameworkLikeToken('btn-primary')).toBe(true);
  });

  it('identifies unmapped bulma tokens', () => {
    const converter = new Converter({ name: 'bulma', rules: [] });

    expect(converter.isFrameworkLikeToken('is-primary')).toBe(true);
    expect(converter.isFrameworkLikeToken('has-text-centered')).toBe(true);
    expect(converter.isFrameworkLikeToken('columns')).toBe(true);
    expect(converter.isFrameworkLikeToken('column')).toBe(true);
  });

  it('identifies unmapped foundation tokens', () => {
    const converter = new Converter({ name: 'foundation', rules: [] });

    expect(converter.isFrameworkLikeToken('grid-x')).toBe(true);
    expect(converter.isFrameworkLikeToken('cell')).toBe(true);
    expect(converter.isFrameworkLikeToken('small-12')).toBe(true);
    expect(converter.isFrameworkLikeToken('medium-6')).toBe(true);
    expect(converter.isFrameworkLikeToken('show-for-medium')).toBe(true);
  });

  it('identifies custom/tailwind tokens', () => {
    const converter = new Converter({ name: 'bootstrap5', rules: [] });

    // Custom prefixes/BEM
    expect(converter.isFrameworkLikeToken('app-header')).toBe(false);
    expect(converter.isFrameworkLikeToken('js-modal')).toBe(false);
    expect(converter.isFrameworkLikeToken('foo__bar')).toBe(false);
    // Tailwind specific
    expect(converter.isFrameworkLikeToken('md:flex')).toBe(false);
    expect(converter.isFrameworkLikeToken('hover:bg-red-500')).toBe(false);
    // Unrelated words
    expect(converter.isFrameworkLikeToken('unknown')).toBe(false);
  });
});
