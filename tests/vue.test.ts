import { describe, it, expect } from 'vitest';
import { parseVueClasses } from '../src/parsers/vue.js';

describe('Vue Parser', () => {
  it('should find classes inside template blocks', () => {
    const code = `
<template>
  <div class="d-flex p-3">
    <span class="text-danger">Alert</span>
  </div>
</template>
<script setup>
  const msg = 'hello'
</script>
    `;
    const tokens = parseVueClasses(code);
    expect(tokens.length).toBe(2);
    expect(tokens[0].value).toBe('d-flex p-3');
    expect(tokens[1].value).toBe('text-danger');

    expect(code.substring(tokens[0].start, tokens[0].end)).toBe('d-flex p-3');
  });
});
