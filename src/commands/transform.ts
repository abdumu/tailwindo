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
  prefix?: string;
}

export function transformCommand(path: string, options: TransformOptions) {
  const ignorePaths = options.ignore ? options.ignore.split(',').map(s => s.trim()) : undefined;
  const files = getFiles(path, options.extensions, ignorePaths);

  const extractedComponents = new Map<string, string[]>();

  for (const file of files) {
    const overrides = { prefix: options.prefix };
    const r = processFile(file, options.from as DialectName, options.components ? true : false, extractedComponents, options.mode, overrides);

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

  if (options.components) {
    let cssOutput = '';
    if (extractedComponents.size === 0) {
      console.log(`WARNING: extractedComponents is empty for ${files.join(', ')}`);
    }
    const sortedKeys = Array.from(extractedComponents.keys()).sort();
    for (const key of sortedKeys) {
      const classes = extractedComponents.get(key)!;
      const regularClasses: string[] = [];
      const rawStyles: string[] = [];
      for (const cls of classes) {
        if (cls.includes('[') && cls.includes(']')) {
           // Basic unboxing for arbitrary values - fallback for missing components
           const prop = cls.split('-')[0].replace('tw:', '');
           const valMatch = cls.match(/\[(.*?)\]/);
           if (valMatch) {
               if (prop === 'p') rawStyles.push(`padding: ${valMatch[1]}`);
               else if (prop === 'px') rawStyles.push(`padding-left: ${valMatch[1]}; padding-right: ${valMatch[1]}`);
               else if (prop === 'py') rawStyles.push(`padding-top: ${valMatch[1]}; padding-bottom: ${valMatch[1]}`);
               else if (prop === 'pt') rawStyles.push(`padding-top: ${valMatch[1]}`);
               else if (prop === 'pr') rawStyles.push(`padding-right: ${valMatch[1]}`);
               else if (prop === 'pb') rawStyles.push(`padding-bottom: ${valMatch[1]}`);
               else if (prop === 'pl') rawStyles.push(`padding-left: ${valMatch[1]}`);
               else if (prop === 'm') rawStyles.push(`margin: ${valMatch[1]}`);
               else if (prop === 'mx') rawStyles.push(`margin-left: ${valMatch[1]}; margin-right: ${valMatch[1]}`);
               else if (prop === 'my') rawStyles.push(`margin-top: ${valMatch[1]}; margin-bottom: ${valMatch[1]}`);
               else if (prop === 'mt') rawStyles.push(`margin-top: ${valMatch[1]}`);
               else if (prop === 'mr') rawStyles.push(`margin-right: ${valMatch[1]}`);
               else if (prop === 'mb') rawStyles.push(`margin-bottom: ${valMatch[1]}`);
               else if (prop === 'ml') rawStyles.push(`margin-left: ${valMatch[1]}`);
               else if (prop === 'border') rawStyles.push(`border-width: ${valMatch[1]}`);
               else if (prop === 'rounded') rawStyles.push(`border-radius: ${valMatch[1]}`);
               else if (prop === 'text') rawStyles.push(`font-size: ${valMatch[1]}`);
               else if (prop === 'leading') rawStyles.push(`line-height: ${valMatch[1]}`);
               else if (prop === 'h') rawStyles.push(`height: ${valMatch[1]}`);
               else if (prop === 'w') rawStyles.push(`width: ${valMatch[1]}`);
               else if (prop === 'shadow') rawStyles.push(`box-shadow: ${valMatch[1].replace(/_/g, ' ')}`);
               else regularClasses.push(cls);
           } else {
               regularClasses.push(cls);
           }
        } else {
            regularClasses.push(cls);
        }
      }

      cssOutput += `.${key} {\n`;
      if (regularClasses.length > 0) {
        cssOutput += `  @apply ${regularClasses.join(' ')};\n`;
      }
      if (rawStyles.length > 0) {
        cssOutput += `  ${rawStyles.join(';\n  ')};\n`;
      }
      cssOutput += `}\n\n`;
    }

    fs.writeFileSync(options.components, cssOutput);
    console.log(chalk.green(`✓ Wrote components CSS to ${options.components}`));
    if (!options.write) {
      console.log(chalk.bold(`\nGenerated CSS for ${options.components}:`));
      console.log(chalk.cyan(cssOutput));
    }
  }

  console.log(chalk.bold('\nTransformation complete.'));
}
