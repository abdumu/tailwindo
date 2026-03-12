import { parse } from 'svelte/compiler';
import { TokenRange } from './html.js';

export function parseSvelteClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  try {
    const ast = parse(content);

    const walk = (node: any) => {
      if (!node) return;

      if (node.type === 'Attribute' && node.name === 'class') {
        // value is an array of chunks: Text or MustacheTag
        for (const chunk of node.value) {
          if (chunk.type === 'Text') {
            tokens.push({
              start: chunk.start,
              end: chunk.end,
              value: chunk.data
            });
          }
        }
      } else {
        // recursively walk keys
        for (const key in node) {
          if (Array.isArray(node[key])) {
            node[key].forEach(walk);
          } else if (typeof node[key] === 'object' && node[key] !== null) {
            walk(node[key]);
          }
        }
      }
    };

    walk(ast.html);

  } catch (err) {
    // console.warn("Failed to parse Svelte:", err);
  }

  return tokens;
}
