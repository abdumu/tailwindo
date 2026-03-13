import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { getDialect, getDialectWithConfig, DialectName } from '../dialects/index.js';
import { Converter, ConversionResult } from '../engine/converter.js';
import { parseHtmlClasses, TokenRange } from '../parsers/html.js';

export interface TailwindoConfig {
  from?: DialectName;
  prefix?: string;
  colors?: Record<string, string>;
}

export function loadConfig(): TailwindoConfig {
  const configPath = path.join(process.cwd(), 'tailwindo.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const configStr = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configStr) as TailwindoConfig;
    } catch (e) {
      console.warn('Failed to parse tailwindo.config.json', e);
    }
  }
  return {};
}

const loadedConfig = loadConfig();

import { parseJsxClasses } from '../parsers/jsx.js';
import { parseVueClasses } from '../parsers/vue.js';
import { parseSvelteClasses } from '../parsers/svelte.js';
import { parseServerClasses } from '../parsers/server.js';

export interface FileResult {
  file: string;
  dialectUsed: 'bootstrap4' | 'bootstrap5';
  tokensScanned: number;
  mappedCount: number;
  unmappedCount: number;
  unmappedTokens: string[];
  customTokens: string[];
  skippedDynamicCount: number;
  originalContent: string;
  transformedContent: string;
  confidenceScore: number;
}

export function getFiles(pathStr: string, extensions: string, ignorePaths?: string[]): string[] {
  const stat = fs.statSync(pathStr);
  if (stat.isFile()) {
    return [pathStr];
  }

  const exts = extensions.split(',').map(e => e.trim());

  // glob brace expansion works differently if there's only 1 item
  let pattern = '';
  if (exts.length === 1) {
    pattern = `${pathStr.replace(/\/$/, '')}/**/*.${exts[0]}`;
  } else {
    pattern = `${pathStr.replace(/\/$/, '')}/**/*.{${exts.join(',')}}`;
  }

  const ignorePattern: string[] = ['**/node_modules/**', '**/.git/**'];
  if (ignorePaths) {
    ignorePattern.push(...ignorePaths);
  }

  // Best effort loading of .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    try {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      const lines = gitignore.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      lines.forEach(line => {
        let pattern = line;
        if (pattern.startsWith('/')) pattern = pattern.substring(1);
        if (!pattern.includes('*')) {
          ignorePattern.push(`**/${pattern}/**`);
          ignorePattern.push(`**/${pattern}`);
        } else {
          ignorePattern.push(`**/${pattern}`);
        }
      });
    } catch (e) {
      // ignore
    }
  }

  return globSync(pattern, { ignore: ignorePattern, absolute: true });
}

export function processFile(file: string, fromOption: DialectName, componentsMode = false, extractedComponents?: Map<string, string[]>, mode: 'utilities' | 'fidelity' | 'mixed' = 'mixed'): FileResult {
  const content = fs.readFileSync(file, 'utf8');
  const ext = file.split('.').pop()?.toLowerCase();

  // Override fromOption if config defines 'from'
  const resolvedFromOption = loadedConfig.from || fromOption;

  const dialectName = getDialect(resolvedFromOption, content);

  const dialect = getDialectWithConfig(resolvedFromOption, content, loadedConfig.colors);
  const converter = new Converter(dialect, loadedConfig.prefix, componentsMode, mode);

  let tokens: TokenRange[] = [];

  // Choose parser based on file extension
  if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) {
    tokens = parseJsxClasses(content);
  } else if (ext === 'vue') {
    tokens = parseVueClasses(content);
  } else if (ext === 'svelte') {
    tokens = parseSvelteClasses(content);
  } else if (file.endsWith('.blade.php') || ['php', 'twig', 'erb'].includes(ext || '')) {
    tokens = parseServerClasses(content);
  } else {
    // Default to HTML parser (works nicely with pure html)
    tokens = parseHtmlClasses(content);
  }

  // Sort tokens backwards by start position to apply edits without invalidating offsets
  tokens.sort((a, b) => b.start - a.start);

  let transformedContent = content;
  let tokensScanned = 0;
  let mappedCount = 0;
  let unmappedCount = 0;
  let skippedDynamicCount = 0;
  let totalConfidence = 0;
  let totalConvertedTokens = 0;
  const unmappedTokensSet = new Set<string>();
  const customTokensSet = new Set<string>();

  for (const token of tokens) {
    if (token.type === 'dynamic') {
      skippedDynamicCount++;
      continue;
    }

    const classStr = token.value;
    const result = converter.convertClasses(classStr);

    if (componentsMode && extractedComponents) {
      for (const [key, value] of converter.extractedComponents.entries()) {
        extractedComponents.set(key, value);
      }
    }

    // count tokens ignoring spacing
    const splitTokens = classStr.split(/\s+/).filter(t => t.trim() !== '');
    tokensScanned += splitTokens.length;

    mappedCount += result.mappedTokens.length;
    unmappedCount += result.unmappedTokens.length;

    result.unmappedTokens.forEach(t => unmappedTokensSet.add(t));
    if (result.customTokens) {
      result.customTokens.forEach(t => customTokensSet.add(t));
    }

    if (result.mappedTokens.length > 0) {
      for (const mappedToken of result.mappedTokens) {
        totalConfidence += mappedToken.confidence;
        totalConvertedTokens++;
      }
    }

    // apply string replacement
    transformedContent = transformedContent.substring(0, token.start)
                       + result.converted
                       + transformedContent.substring(token.end);
  }

  const confidenceScore = totalConvertedTokens > 0 ? (totalConfidence / totalConvertedTokens) : 1.0;

  return {
    file,
    dialectUsed: dialectName,
    tokensScanned,
    mappedCount,
    unmappedCount,
    unmappedTokens: Array.from(unmappedTokensSet),
    customTokens: Array.from(customTokensSet),
    skippedDynamicCount,
    originalContent: content,
    transformedContent,
    confidenceScore
  };
}
