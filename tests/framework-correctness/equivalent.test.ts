import { describe, it, expect } from 'vitest';
import { Converter } from '../../src/engine/converter.js';
import { getDialectWithConfig } from '../../src/dialects/index.js';
import { parseHtmlClasses } from '../../src/parsers/html.js';
import { parseJsxClasses } from '../../src/parsers/jsx.js';
import { parseVueClasses } from '../../src/parsers/vue.js';
import { parseSvelteClasses } from '../../src/parsers/svelte.js';
import { parseServerClasses } from '../../src/parsers/server.js';

describe('Framework Correctness Tests', () => {
  const cssClasses = "container text-center mt-3";
  const expectedClasses = "container mx-auto px-3 text-center mt-4";

  const inputs = {
    html: `<div class="${cssClasses}"></div>`,
    jsx: `<div className="${cssClasses}"></div>`,
    vue: `<template><div :class="['${cssClasses}', dynamicClass]"></div></template>`,
    svelte: `<div class="${cssClasses} {dynamicClass}"></div>`,
    blade: `<div class="${cssClasses} {{ $dynamicClass }}"></div>`
  };

  const dialect = getDialectWithConfig('bootstrap5', '', undefined);
  const converter = new Converter(dialect, '', false, 'mixed');

  function convert(content: string, parser: any) {
    const tokens = parser(content);
    // Sort backwards to prevent offset corruption
    tokens.sort((a: any, b: any) => b.start - a.start);
    let transformedContent = content;

    for (const token of tokens) {
      if (token.type === 'dynamic') continue;
      const result = converter.convertClasses(token.value);
      transformedContent = transformedContent.substring(0, token.start) + result.converted + transformedContent.substring(token.end);
    }
    return transformedContent;
  }

  it('HTML matches expected output', () => {
    const res = convert(inputs.html, parseHtmlClasses);
    expect(res).toBe(`<div class="${expectedClasses}"></div>`);
  });

  it('JSX matches expected output', () => {
    const res = convert(inputs.jsx, parseJsxClasses);
    expect(res).toBe(`<div className="${expectedClasses}"></div>`);
  });

  it('Vue matches expected output', () => {
    const res = convert(inputs.vue, parseVueClasses);
    expect(res).toBe(`<template><div :class="['${expectedClasses}', dynamicClass]"></div></template>`);
  });

  it('Svelte matches expected output', () => {
    const res = convert(inputs.svelte, parseSvelteClasses);
    expect(res).toBe(`<div class="${expectedClasses} {dynamicClass}"></div>`);
  });

  it('Blade matches expected output', () => {
    const res = convert(inputs.blade, parseServerClasses);
    expect(res).toBe(`<div class="${expectedClasses} {{ $dynamicClass }}"></div>`);
  });
});
