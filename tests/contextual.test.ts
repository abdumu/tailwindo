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
    expect(result.tokens).toContain('text-lg'); // from btn-lg
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
});
