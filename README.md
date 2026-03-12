# Tailwindo

[![Actions Status](https://github.com/awssat/tailwindo/workflows/Node%20CI/badge.svg)](https://github.com/awssat/tailwindo/actions)

<p align="center">
  <img src="https://pbs.twimg.com/media/DQ-mDgSX0AUpCPL.png">
</p>

This tool can **convert your CSS framework (currently Bootstrap 4 & 5) classes** in HTML, JS/TS (React/JSX), Vue, Svelte, or server templates (PHP, Blade, Twig, ERB) to equivalent **Tailwind CSS** classes.

It has been rewritten from PHP to a modern TypeScript CLI capable of handling template strings, JSX nodes, and dynamic bindings securely without regex-matching the entire file payload.

## Features
- Preserves your framework layout styling and colors dynamically.
- Understands Vue, JSX, Svelte and will not mistakenly replace JS variables named similarly to bootstrap classes.
- Ignores template dynamic injections (e.g. `{{ var }}`).
- Auto-detects Bootstrap 4 vs Bootstrap 5 rules out of the box.

## Installation

You can install Tailwindo globally:

```bash
npm i -g tailwindo
```

Or run it directly using `npx`:

```bash
npx tailwindo transform path/to/project --write
```

## Usage

### Transform files

To perform replacements in your source code, you can use the `transform` command:

```bash
tailwindo transform ./src --write
```
*If `--write` is omitted, Tailwindo will print the diffs to standard output without altering your files.*

### Options
*   `--from <bootstrap4|bootstrap5|auto>`: Explicitly define the origin dialect, otherwise automatically inferred per file based on Bootstrap 5 specific classes (like `g-`, `ms-`).
*   `--extensions <csv>`: Define the exact extensions to watch. Defaults to `html,js,jsx,ts,tsx,vue,svelte,php,blade.php,twig,erb`.
*   `--backup`: Create `.bak` files during `--write`.

### Scan files

Scan files to gather a summary of how many class tokens will map vs what will remain unmapped.

```bash
tailwindo scan ./src
```
Outputs a summary directly to the terminal, or specify `--format json` for integration.

### Check files in CI

Enforce complete mapping locally or in your CI using `check`:

```bash
tailwindo check ./src
```
Exits `1` and prints the offending files if there are changes or unmapped tokens.

## Limitations

Currently, Tailwindo's auto component extraction mode is marked as future development. It handles baseline flexbox, display, text layouts, borders, alignments, and simple colors out of the box across BS4 & 5.

Dynamic bindings in React \``${expr}`\` inside `className`, or `{{ ... }}` blocks in Blade are correctly skipped, preserving runtime behavior while converting the static literals surrounding them.

## Help Us
- If you find unexpected conversion results, please create an issue or pull request.
