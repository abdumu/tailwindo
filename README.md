# Tailwindo

[![Actions Status](https://github.com/abdumu/tailwindo/workflows/Node%20CI/badge.svg)](https://github.com/abdumu/tailwindo/actions)

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
- **Smart Class Classification:** Distinguishes between custom/BEM/Tailwind classes and unmapped Bootstrap classes. Unrecognized custom classes are safely ignored, preventing false positive errors during `check` or CI workflows.
- **High-Fidelity Mappings:** Maps Bootstrap classes to Tailwind classes with a multi-token contextual rule engine (e.g. `btn btn-primary btn-lg` creates a tailored component style).
- **Utility and Components Modes:** Configure the output style to replace components directly with utilities, or generate CSS `@apply` rules for cleaner HTML (`--components`).
- **Dynamic Bindings Support:** Safely parses and partially replaces string literals inside Vue `:class` expressions without corrupting the file.

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
*   `--mode <mode>`: conversion mode (`utilities`, `fidelity`, `mixed`) (default: `mixed`).
*   `--components <file>`: output CSS file with `@apply` rules (incremental migration mode).

## Configuration and Modes

- **Modes (`--mode`):**
  - `mixed` (default): Combines utility transformations and high-fidelity component transforms.
  - `utilities`: Focuses on raw utility conversion, disabling some larger component recipes.
  - `fidelity`: Ensures that outputs look exactly like Bootstrap defaults when possible.

- **Components Mode (`--components path/to/file.css`):**
  When provided, Tailwindo will extract multi-token contextual mappings (like `btn btn-primary`) into a generated CSS file with `@apply` rules, leaving the original Bootstrap class names intact in the HTML. This helps in incrementally migrating without dramatically inflating the class attribute length.

- **Grid Mapping Approach:**
  Tailwindo translates Bootstrap's flex-based grid into comparable Tailwind flex properties and widths (e.g., `col-6` becomes `w-6/12`).

- **Vue `:class` Support:**
  Dynamic expressions inside Vue's `:class` attribute are partially supported. Standard string literals (like `:class="['d-flex', isActive ? 'text-primary' : '']"`) will be correctly evaluated and converted safely, without altering or corrupting the logic bounds.

### Scan files

Scan files to gather a summary of how many class tokens will map vs what will remain unmapped. "Unmapped" tokens strictly refer to classes that match Bootstrap utility patterns (like `d-`, `m-`, `col-`, etc.) but have no exact Tailwind equivalent rule yet. Custom application classes, Tailwind classes, and BEM blocks are recognized as "custom" and safely ignored.

```bash
tailwindo scan ./src
```
Outputs a summary directly to the terminal, including a conversion confidence score, or specify `--format json` for integration.

### Check files in CI

Enforce complete mapping locally or in your CI using `check`:

```bash
tailwindo check ./src
```
Exits `1` and prints the offending files if there are changes or unmapped tokens.

## Limitations

Dynamic bindings in React \`${expr}\` inside `className`, or `{{ ... }}` blocks in Blade are correctly skipped, preserving runtime behavior while converting the static literals surrounding them. For Vue, `:class` bindings support string literals specifically, skipping more complex expressions safely.

## Help Us
- If you find unexpected conversion results, please create an issue or pull request.
