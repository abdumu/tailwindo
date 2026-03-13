import fs from 'fs';
import chalk from 'chalk';
import * as diff from 'diff';
import { getFiles, processFile } from './shared.js';
import { DialectName } from '../dialects/index.js';

interface TransformOptions {
  from: string;
  extensions: string;
  ignore?: string;
  write: boolean;
  diff: boolean;
  backup: boolean;
  mode: 'utilities' | 'fidelity' | 'mixed';
  components?: string;
}

export function transformCommand(path: string, options: TransformOptions) {
  const ignorePaths = options.ignore ? options.ignore.split(',').map(s => s.trim()) : undefined;
  const files = getFiles(path, options.extensions, ignorePaths);

  const extractedComponents = new Map<string, string[]>();

  for (const file of files) {
    const r = processFile(file, options.from as DialectName, options.components ? true : false, extractedComponents, options.mode);

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

  if (options.components && extractedComponents.size > 0) {
    let cssOutput = '';
    const sortedKeys = Array.from(extractedComponents.keys()).sort();
    for (const key of sortedKeys) {
      const classes = extractedComponents.get(key)!.join(' ');
      cssOutput += `.${key} {\n  @apply ${classes};\n}\n\n`;
    }

    if (options.write) {
      fs.writeFileSync(options.components, cssOutput);
      console.log(chalk.green(`✓ Wrote components CSS to ${options.components}`));
    } else {
      console.log(chalk.bold(`\nGenerated CSS for ${options.components}:`));
      console.log(chalk.cyan(cssOutput));
    }
  }

  console.log(chalk.bold('\nTransformation complete.'));
}
