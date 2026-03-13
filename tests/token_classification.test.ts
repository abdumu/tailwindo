import { describe, it, expect } from 'vitest';
import { Converter, Dialect } from '../src/engine/converter.js';

describe('Token Classification', () => {
  it('identifies unmapped bootstrap tokens', () => {
    const converter = new Converter({ name: 'dummy', rules: [] });

    // Spacing
    expect(converter.isBootstrapLikeToken('mt-3')).toBe(true);
    expect(converter.isBootstrapLikeToken('px-4')).toBe(true);
    // Display
    expect(converter.isBootstrapLikeToken('d-none')).toBe(true);
    // Grid/Components
    expect(converter.isBootstrapLikeToken('container')).toBe(true);
    expect(converter.isBootstrapLikeToken('row')).toBe(true);
    expect(converter.isBootstrapLikeToken('col-md-6')).toBe(true);
    expect(converter.isBootstrapLikeToken('btn-primary')).toBe(true);
  });

  it('identifies custom/tailwind tokens', () => {
    const converter = new Converter({ name: 'dummy', rules: [] });

    // Custom prefixes/BEM
    expect(converter.isBootstrapLikeToken('app-header')).toBe(false);
    expect(converter.isBootstrapLikeToken('js-modal')).toBe(false);
    expect(converter.isBootstrapLikeToken('foo__bar')).toBe(false);
    // Tailwind specific
    expect(converter.isBootstrapLikeToken('md:flex')).toBe(false);
    expect(converter.isBootstrapLikeToken('hover:bg-red-500')).toBe(false);
    // Unrelated words
    expect(converter.isBootstrapLikeToken('unknown')).toBe(false);
  });
});
