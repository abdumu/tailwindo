import { describe, it, expect } from 'vitest';
import { Converter } from '../../src/engine/converter.js';
import { getDialectWithConfig } from '../../src/dialects/index.js';

describe('Framework Conflation Tests', () => {
  it('isFrameworkLikeToken should only check the current dialect', () => {
    let dialect = getDialectWithConfig('bootstrap5', '', undefined);
    let converter = new Converter(dialect, '', false, 'mixed');

    // 'button' is a bulma/foundation class. In bootstrap it should be a custom token, not unmapped framework token
    expect(converter.isFrameworkLikeToken('button')).toBe(false);
    expect(converter.isFrameworkLikeToken('box')).toBe(false); // bulma
    expect(converter.isFrameworkLikeToken('grid-x')).toBe(false); // foundation
    expect(converter.isFrameworkLikeToken('btn')).toBe(true); // bootstrap
  });

  it('bulma dialect should not recognize bootstrap classes as framework tokens', () => {
    let dialect = getDialectWithConfig('bulma', '', undefined);
    let converter = new Converter(dialect, '', false, 'mixed');

    expect(converter.isFrameworkLikeToken('btn')).toBe(false); // bootstrap
    expect(converter.isFrameworkLikeToken('button')).toBe(true); // bulma/foundation (but here bulma)
    expect(converter.isFrameworkLikeToken('box')).toBe(true); // bulma
  });

  it('should not convert bulma box in bootstrap', () => {
    let dialect = getDialectWithConfig('bootstrap5', '', undefined);
    let converter = new Converter(dialect, '', false, 'mixed');

    // box is bulma component
    let res = converter.convertClasses('box');
    expect(res.converted).toBe('box'); // unchanged
  });
});
