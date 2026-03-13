import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'es2022',
  clean: true,
  dts: false,
  sourcemap: true,
  minify: true,
  banner: {
    js: '#!/usr/bin/env node'
  }
});
