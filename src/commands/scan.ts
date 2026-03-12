import chalk from 'chalk';
import { getFiles, processFile, FileResult } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface ScanOptions {
  from: string;
  extensions: string;
  format: string;
  ignore?: string;
}

export function scanCommand(path: string, options: ScanOptions) {
  const files = getFiles(path, options.extensions, options.ignore);

  const results: FileResult[] = files.map(file => processFile(file, options.from as DialectName));

  const totalFiles = results.length;
  let totalTokens = 0;
  let totalMapped = 0;
  let totalUnmapped = 0;

  for (const r of results) {
    totalTokens += r.tokensScanned;
    totalMapped += r.mappedCount;
    totalUnmapped += r.unmappedCount;
  }

  if (options.format === 'json') {
    console.log(JSON.stringify({
      summary: { totalFiles, totalTokens, totalMapped, totalUnmapped },
      files: results.map(r => ({
        file: r.file,
        dialect: r.dialectUsed,
        scanned: r.tokensScanned,
        mapped: r.mappedCount,
        unmapped: r.unmappedCount,
        unmappedTokens: r.unmappedTokens
      }))
    }, null, 2));
    return;
  }

  console.log(chalk.bold('--- Scan Summary ---'));
  console.log(`Files scanned: ${totalFiles}`);
  console.log(`Total class tokens: ${totalTokens}`);
  console.log(`Mapped tokens: ${chalk.green(totalMapped)}`);
  console.log(`Unmapped tokens: ${chalk.red(totalUnmapped)}`);
  console.log('');

  if (totalUnmapped > 0) {
    console.log(chalk.bold('Unmapped classes (sample):'));
    const allUnmapped = new Set<string>();
    results.forEach(r => r.unmappedTokens.forEach(t => allUnmapped.add(t)));
    console.log(Array.from(allUnmapped).slice(0, 50).join(', ') + (allUnmapped.size > 50 ? '...' : ''));
  }
}
