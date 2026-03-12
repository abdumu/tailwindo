import { describe, it, expect } from 'vitest';
import { parseServerClasses } from '../src/parsers/server.js';

describe('Server Template Parser', () => {
  it('should find classes ignoring dynamic blade/twig chunks', () => {
    const code = `<div class="d-flex {{ $active ? 'p-3' : 'p-2' }} text-center bg-primary"></div>`;
    const tokens = parseServerClasses(code);
    expect(tokens.length).toBe(2);
    expect(tokens[0].value).toBe('d-flex ');
    expect(tokens[1].value).toBe(' text-center bg-primary');

    expect(code.substring(tokens[0].start, tokens[0].end)).toBe('d-flex ');
    expect(code.substring(tokens[1].start, tokens[1].end)).toBe(' text-center bg-primary');
  });

  it('should handle PHP blocks', () => {
    const code = `<span class='font-weight-bold <?= $foo ?>'></span>`;
    const tokens = parseServerClasses(code);
    expect(tokens.length).toBe(1);
    expect(tokens[0].value).toBe('font-weight-bold ');

    expect(code.substring(tokens[0].start, tokens[0].end)).toBe('font-weight-bold ');
  });

  it('should handle regular classes just fine', () => {
    const code = `<span class="mt-3"></span>`;
    const tokens = parseServerClasses(code);
    expect(tokens.length).toBe(1);
    expect(tokens[0].value).toBe('mt-3');
  });
});
