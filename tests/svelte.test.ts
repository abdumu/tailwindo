import { describe, it, expect } from 'vitest';
import { parseSvelteClasses } from '../src/parsers/svelte.js';

describe('Svelte Parser', () => {
  it('should find class literals inside attributes', () => {
    const code = `
<script>
  let active = true;
</script>

<div class="d-flex p-3 {active ? 'd-block' : ''} text-center">
  Hello
</div>
    `;
    const tokens = parseSvelteClasses(code);
    expect(tokens.length).toBe(3);
    // AST chunk 'd-flex p-3 ' and ' text-center', plus dynamic chunk
    expect(tokens[0].value).toBe('d-flex p-3 ');
    expect(tokens[1].type).toBe('dynamic');
    expect(tokens[2].value).toBe(' text-center');
    expect(code.substring(tokens[0].start, tokens[0].end)).toBe('d-flex p-3 ');
    expect(code.substring(tokens[2].start, tokens[2].end)).toBe(' text-center');
  });
});
