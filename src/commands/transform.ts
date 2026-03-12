import fs from 'fs';
import chalk from 'chalk';
import * as diff from 'diff';
import { getFiles, processFile } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface TransformOptions {
  from: string;
  extensions: string;
  write: boolean;
  diff: boolean;
  backup: boolean;
  components?: string;
}

export function transformCommand(path: string, options: TransformOptions) {
  const files = getFiles(path, options.extensions);

  if (options.components) {
    console.log(chalk.yellow('Components mode is not fully implemented yet. Please use standard migration.'));
  }

  for (const file of files) {
    const r = processFile(file, options.from as DialectName);

    if (r.originalContent !== r.transformedContent) {
      if (!options.write || options.diff) {
        console.log(chalk.bold(`\nDiff for ${file} [${r.dialectUsed}]`));
        const patch = diff.createPatch(file, r.originalContent, r.transformedContent);
        patch.split('\n').slice(4).forEach(line => {
          if (line.startsWith('+')) console.log(chalk.green(line));
          else if (line.startsWith('-')) console.log(chalk.red(line));
          else console.log(line);
        });
      }

      if (options.write) {
        if (options.backup) {
          fs.writeFileSync(`${file}.bak`, r.originalContent);
        }
        fs.writeFileSync(file, r.transformedContent);
        console.log(chalk.green(`✓ Wrote ${file}`));
      }
    }
  }

  console.log(chalk.bold('\nTransformation complete.'));
}
