import { describe, it, expect } from 'vitest';
import { contextualRules } from '../src/engine/contextualRules.js';

describe('Contextual Rules Engine', () => {
  it('should transform button and size variants', () => {
    const btnRule = contextualRules.find(r => r.name === 'button')!;
    const tokens = ['btn', 'btn-primary', 'btn-lg', 'custom-class'];
    const result = btnRule.transform(tokens);

    expect(result.tokens).not.toContain('btn');
    expect(result.tokens).not.toContain('btn-primary');
    expect(result.tokens).not.toContain('btn-lg');
    expect(result.tokens).toContain('custom-class');
    expect(result.tokens).toContain('bg-blue-600'); // from btn-primary
    expect(result.tokens).toContain('text-[1.25rem]'); // from btn-lg explicitly mapped to literal
  });

  it('should transform forms correctly', () => {
    const formRule = contextualRules.find(r => r.name === 'form')!;
    const tokens = ['form-control', 'custom'];
    const result = formRule.transform(tokens);

    expect(result.tokens).not.toContain('form-control');
    expect(result.tokens).toContain('custom');
    expect(result.tokens).toContain('block');
    expect(result.tokens).toContain('w-full');
  });
  it('should transform bulma button', () => {
    const rule = contextualRules.find(r => r.name === 'bulma-button')!;
    const tokens = ['button', 'is-primary', 'is-outlined', 'is-small'];
    const result = rule.transform(tokens);

    expect(result.tokens).not.toContain('button');
    expect(result.tokens).toContain('border-teal-500');
    expect(result.tokens).toContain('text-teal-500');
    expect(result.tokens).toContain('bg-transparent');
    expect(result.tokens).toContain('text-sm');
  });

  it('should transform bulma columns', () => {
    const rule1 = contextualRules.find(r => r.name === 'bulma-columns-wrapper')!;
    const result1 = rule1.transform(['columns']);
    expect(result1.tokens).not.toContain('columns');
    expect(result1.tokens).toContain('flex');
    expect(result1.tokens).toContain('flex-wrap');

    const rule2 = contextualRules.find(r => r.name === 'bulma-column')!;
    const result2 = rule2.transform(['column', 'is-half']);
    expect(result2.tokens).not.toContain('column');
    expect(result2.tokens).toContain('w-1/2');
    expect(result2.tokens).toContain('px-3');
  });

  it('should transform foundation grid', () => {
    const rule1 = contextualRules.find(r => r.name === 'foundation-grid-x')!;
    const result1 = rule1.transform(['grid-x']);
    expect(result1.tokens).not.toContain('grid-x');
    expect(result1.tokens).toContain('flex');

    const rule2 = contextualRules.find(r => r.name === 'foundation-cell')!;
    const result2 = rule2.transform(['cell', 'small-12', 'medium-6']);
    expect(result2.tokens).not.toContain('cell');
    expect(result2.tokens).not.toContain('small-12');
    expect(result2.tokens).toContain('sm:w-12/12');
    expect(result2.tokens).toContain('md:w-6/12');
  });
});
