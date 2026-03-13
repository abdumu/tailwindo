import { describe, it, expect } from 'vitest';
import { Converter, Dialect } from '../src/engine/converter.js';

const dummyDialect: Dialect = {
  name: 'dummy',
  rules: [
    { match: 'd-none', replace: ['hidden'] },
    { match: /^m-(.*)$/, replace: (m: RegExpMatchArray) => [`m-${m[1]}`] }
  ]
};

describe('Converter Engine', () => {
  it('should convert matching string rules', () => {
    const converter = new Converter(dummyDialect);
    const result = converter.convertClasses('d-none unknown d-none');
    expect(result.converted).toBe('hidden unknown hidden');
    expect(result.mappedTokens.length).toBe(2);
    expect(result.unmappedTokens.length).toBe(0);
    expect(result.customTokens.length).toBe(1);
    expect(result.customTokens[0]).toBe('unknown');
  });

  it('should handle whitespace preservation', () => {
    const converter = new Converter(dummyDialect);
    const result = converter.convertClasses('  d-none\n \t m-4   ');
    expect(result.converted).toBe('  hidden\n \t m-4   ');
  });
});
