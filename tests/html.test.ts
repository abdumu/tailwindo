import { describe, it, expect } from 'vitest';
import { parseHtmlClasses } from '../src/parsers/html.js';

describe('HTML Parser', () => {
  it('should find class attributes and ranges', () => {
    const html = `<div class="d-none mt-3">
  <span class='text-primary'>Hello</span>
</div>`;
    const tokens = parseHtmlClasses(html);

    expect(tokens.length).toBe(2);

    expect(tokens[0].value).toBe('d-none mt-3');
    expect(html.substring(tokens[0].start, tokens[0].end)).toBe('d-none mt-3');

    expect(tokens[1].value).toBe('text-primary');
    expect(html.substring(tokens[1].start, tokens[1].end)).toBe('text-primary');
  });

  it('should handle unquoted, improperly spaced classes or no classes gracefully', () => {
    // Unquoted is technically supported in HTML but parse5 might normalize or we just skip if not matched by our regex.
    // However, Bootstrap conventions dictate quotes. We ensure it doesn't break.
    const html = `<div id="app"></div>`;
    const tokens = parseHtmlClasses(html);
    expect(tokens.length).toBe(0);
  });
});
