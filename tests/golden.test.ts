import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { processFile } from '../src/commands/shared.js';

describe('Golden Tests', () => {
  const dirs = ['html', 'jsx', 'server'];

  for (const dir of dirs) {
    it(`should match golden output for ${dir}`, () => {
      const inputPath = path.join(__dirname, 'fixtures', dir, 'input.' + (dir === 'server' ? 'blade.php' : (dir === 'jsx' ? 'jsx' : 'html')));
      const expectedPath = path.join(__dirname, 'fixtures', dir, 'expected.' + (dir === 'server' ? 'blade.php' : (dir === 'jsx' ? 'jsx' : 'html')));

      const expectedContent = fs.readFileSync(expectedPath, 'utf8');
      const result = processFile(inputPath, 'auto');

      expect(result.transformedContent.trim()).toBe(expectedContent.trim());
    });
  }
});
