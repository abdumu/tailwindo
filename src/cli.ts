#!/usr/bin/env node

import { Command } from 'commander';
import { scanCommand } from './commands/scan.js';
import { transformCommand } from './commands/transform.js';
import { checkCommand } from './commands/check.js';

const program = new Command();

program
  .name('tailwindo')
  .description('Convert Bootstrap CSS to Tailwind CSS')
  .version('1.0.0');

program
  .command('scan')
  .description('Recursively scan a file or directory for convertible class tokens')
  .argument('<path>', 'path to scan')
  .option('--from <dialect>', 'framework dialect (bootstrap4|bootstrap5|bulma|foundation|auto)', 'auto')
  .option('--extensions <csv>', 'comma separated extensions to scan', 'html,js,jsx,ts,tsx,vue,svelte,php,blade.php,twig,erb')
  .option('--format <format>', 'output format (pretty|json)', 'pretty')
  .option('--ignore <paths>', 'comma separated paths to ignore')
  .option('--prefix <prefix>', 'Tailwind prefix (e.g., tw-)')
  .action(scanCommand);

program
  .command('transform')
  .description('Perform edits to convert classes')
  .argument('<path>', 'path to transform')
  .option('--from <dialect>', 'framework dialect (bootstrap4|bootstrap5|bulma|foundation|auto)', 'auto')
  .option('--extensions <csv>', 'comma separated extensions to scan', 'html,js,jsx,ts,tsx,vue,svelte,php,blade.php,twig,erb')
  .option('--ignore <paths>', 'comma separated paths to ignore')
  .option('--prefix <prefix>', 'Tailwind prefix (e.g., tw-)')
  .option('--write', 'write changes to files', false)
  .option('--diff', 'force diff output even when --write', false)
  .option('--backup', 'create .bak files when writing', false)
  .option('--mode <utilities|fidelity|mixed>', 'conversion mode (utilities|fidelity|mixed)', 'mixed')
  .option('--components <file>', 'output CSS file with @apply rules (incremental migration mode)')
  .action(transformCommand);

program
  .command('check')
  .description('Check if files are converted and mapped completely')
  .argument('<path>', 'path to check')
  .option('--from <dialect>', 'framework dialect (bootstrap4|bootstrap5|bulma|foundation|auto)', 'auto')
  .option('--extensions <csv>', 'comma separated extensions to scan', 'html,js,jsx,ts,tsx,vue,svelte,php,blade.php,twig,erb')
  .option('--ignore <paths>', 'comma separated paths to ignore')
  .option('--prefix <prefix>', 'Tailwind prefix (e.g., tw-)')
  .action(checkCommand);

program.parse(process.argv);
