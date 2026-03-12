import chalk from 'chalk';
import { getFiles, processFile } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface CheckOptions {
  from: string;
  extensions: string;
  ignore?: string;
}

export function checkCommand(path: string, options: CheckOptions) {
  const files = getFiles(path, options.extensions, options.ignore);

  let hasChanges = false;
  let hasUnmapped = false;

  for (const file of files) {
    const r = processFile(file, options.from as DialectName);
    if (r.originalContent !== r.transformedContent) {
      hasChanges = true;
      console.error(chalk.red(`File would be changed: ${file}`));
    }
    if (r.unmappedCount > 0) {
      hasUnmapped = true;
      console.error(chalk.yellow(`File has unmapped classes: ${file} (${r.unmappedTokens.slice(0, 5).join(', ')}...)`));
    }
  }

  if (hasChanges || hasUnmapped) {
    console.error(chalk.red.bold('\nCheck failed! Files are either not fully mapped or have pending changes.'));
    process.exit(1);
  }

  console.log(chalk.green.bold('Check passed! All files look good.'));
}
