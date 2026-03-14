import chalk from 'chalk';
import { getFiles, processFile } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface CheckOptions {
  from: string;
  extensions: string;
  ignore?: string;
  prefix?: string;
}

export function checkCommand(path: string, options: CheckOptions) {
  const ignorePaths = options.ignore ? options.ignore.split(',').map(s => s.trim()) : undefined;
  const files = getFiles(path, options.extensions, ignorePaths);

  let hasChanges = false;
  let hasUnmapped = false;

  for (const file of files) {
    const overrides = { prefix: options.prefix };
    const r = processFile(file, options.from as DialectName, false, undefined, 'mixed', overrides);
    if (r.originalContent !== r.transformedContent) {
      hasChanges = true;
      console.error(chalk.red(`File would be changed: ${file}`));
    }
    // We only fail check if there are strictly unmapped framework-like tokens.
    // Custom non-framework tokens (e.g., custom BEM classes) do not trigger failures.
    if (r.unmappedTokens.length > 0) {
      hasUnmapped = true;
      console.error(chalk.yellow(`File has unmapped framework classes: ${file} (${r.unmappedTokens.slice(0, 5).join(', ')}...)`));
    }
  }

  if (hasChanges || hasUnmapped) {
    console.error(chalk.red.bold('\nCheck failed! Files are either not fully mapped or have unmapped framework tokens.'));
    process.exit(1);
  }

  console.log(chalk.green.bold('Check passed! All files look good.'));
}
