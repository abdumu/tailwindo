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

  it('should extract components deterministically', () => {
    const bulmaDialect: Dialect = {
      name: 'bulma',
      rules: []
    };

    // Process same content twice
    const content = 'button is-primary is-small';

    const converter1 = new Converter(bulmaDialect, '', true, 'mixed');
    converter1.convertClasses(content);

    const converter2 = new Converter(bulmaDialect, '', true, 'mixed');
    converter2.convertClasses(content);

    // Order of inserted classes in map values
    expect(converter1.extractedComponents.get('button')).toEqual(converter2.extractedComponents.get('button'));
    expect(converter1.extractedComponents.get('is-primary')).toEqual(converter2.extractedComponents.get('is-primary'));

    // To ensure CLI components CSS is deterministic, it sorts keys
    const keys1 = Array.from(converter1.extractedComponents.keys()).sort();
    const keys2 = Array.from(converter2.extractedComponents.keys()).sort();

    expect(keys1).toEqual(keys2);

    // Also, output HTML should keep the original tokens since it's componentsMode
    const res = converter1.convertClasses(content);
    expect(res.converted).toBe(content);
  });
});
