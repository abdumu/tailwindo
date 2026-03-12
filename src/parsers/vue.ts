import { parse } from '@vue/compiler-sfc';
import { parseHtmlClasses, TokenRange } from './html.js';

export function parseVueClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  try {
    const { descriptor } = parse(content);

    // We only parse the `<template>` block for classes for now.
    // Wait, the template could contain class="..." or :class="...".
    // We can run the HTML parser on the content of the template, but we need to offset it.
    if (descriptor.template) {
      const templateContent = descriptor.template.content;
      const templateStart = descriptor.template.loc.start.offset;

      const htmlTokens = parseHtmlClasses(templateContent);

      for (const token of htmlTokens) {
        tokens.push({
          start: token.start + templateStart,
          end: token.end + templateStart,
          value: token.value
        });
      }
    }

    // Additional logic could be added here to parse <script setup> or <script>
    // if JSX is allowed, using the JSX parser on descriptor.script.content / scriptSetup.content
  } catch (err) {
    // silently fail and return empty tokens
  }

  return tokens;
}
