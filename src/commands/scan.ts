import chalk from 'chalk';
import { getFiles, processFile, FileResult } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface ScanOptions {
  from: string;
  extensions: string;
  format: string;
  ignore?: string;
  prefix?: string;
}

export function scanCommand(path: string, options: ScanOptions) {
  const ignorePaths = options.ignore ? options.ignore.split(',').map(s => s.trim()) : undefined;
  const files = getFiles(path, options.extensions, ignorePaths);

  const overrides = { prefix: options.prefix };
  const results: FileResult[] = files.map(file => processFile(file, options.from as DialectName, false, undefined, 'mixed', overrides));

  const totalFiles = results.length;
  let totalTokens = 0;
  let totalMapped = 0;
  let totalUnmapped = 0;
  let totalSkippedDynamic = 0;
  let totalConfidenceSum = 0;

  for (const r of results) {
    totalTokens += r.tokensScanned;
    totalMapped += r.mappedCount;
    totalUnmapped += r.unmappedCount;
    totalSkippedDynamic += r.skippedDynamicCount;
    totalConfidenceSum += r.confidenceScore;
  }

  const averageConfidence = totalFiles > 0 ? (totalConfidenceSum / totalFiles) : 1.0;

  if (options.format === 'json') {
    console.log(JSON.stringify({
      summary: { totalFiles, totalTokens, totalMapped, totalUnmapped, totalSkippedDynamic, averageConfidence },
      files: results.map(r => ({
        file: r.file,
        dialect: r.dialectUsed,
        scanned: r.tokensScanned,
        mapped: r.mappedCount,
        unmapped: r.unmappedCount,
        skippedDynamic: r.skippedDynamicCount,
        unmappedTokens: r.unmappedTokens,
        customTokens: r.customTokens,
        confidenceScore: r.confidenceScore
      }))
    }, null, 2));
    return;
  }

  console.log(chalk.bold('--- Scan Summary ---'));
  console.log(`Files scanned: ${totalFiles}`);
  console.log(`Total class tokens: ${totalTokens}`);
  console.log(`Mapped tokens: ${chalk.green(totalMapped)}`);
  console.log(`Unmapped bootstrap tokens: ${chalk.red(totalUnmapped)}`);
  if (totalSkippedDynamic > 0) {
    console.log(`Skipped dynamic regions: ${chalk.yellow(totalSkippedDynamic)}`);
  }
  console.log(`Average confidence: ${chalk.blue((averageConfidence * 100).toFixed(1) + '%')}`);
  console.log('');

  if (totalUnmapped > 0) {
    console.log(chalk.bold('Unmapped bootstrap classes (sample):'));
    const allUnmapped = new Set<string>();
    results.forEach(r => r.unmappedTokens.forEach(t => allUnmapped.add(t)));
    console.log(Array.from(allUnmapped).slice(0, 50).join(', ') + (allUnmapped.size > 50 ? '...' : ''));
  }
}
