import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { processFile } from '../src/commands/shared.js';

describe('Golden Tests', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  const dirs = fs.readdirSync(fixturesDir).filter(f => fs.statSync(path.join(fixturesDir, f)).isDirectory());

  for (const dir of dirs) {
    it(`should match golden output for ${dir}`, () => {
      const dirPath = path.join(fixturesDir, dir);
      const files = fs.readdirSync(dirPath);
      const inputFile = files.find(f => f.startsWith('input.'));
      const expectedFile = files.find(f => f.startsWith('expected.'));

      if (!inputFile || !expectedFile) {
        throw new Error(`Missing input or expected file in ${dir}`);
      }

      const inputPath = path.join(dirPath, inputFile);
      const expectedPath = path.join(dirPath, expectedFile);

      const expectedContent = fs.readFileSync(expectedPath, 'utf8');
      const result = processFile(inputPath, 'auto');

      expect(result.transformedContent.trim()).toBe(expectedContent.trim());
    });
  }
});
