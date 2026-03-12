import { parse } from '@babel/parser';
import traverse_ from '@babel/traverse';
import { TokenRange } from './html.js'; // Reusing TokenRange interface

// babel/traverse is a CJS module without a good default export in some environments
const traverse = typeof traverse_ === 'function' ? traverse_ : (traverse_ as any).default;

export function parseJsxClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    traverse(ast, {
      JSXAttribute(path: any) {
        if (path.node.name.name === 'className') {
          const valueNode = path.node.value;

          if (!valueNode) return;

          // className="literal string"
          if (valueNode.type === 'StringLiteral') {
            tokens.push({
              start: valueNode.start + 1, // ignore starting quote
              end: valueNode.end - 1, // ignore ending quote
              value: valueNode.value
            });
          }
          // className={"literal string"} or className={`literal string`}
          else if (valueNode.type === 'JSXExpressionContainer') {
            const expression = valueNode.expression;

            if (expression.type === 'StringLiteral') {
              tokens.push({
                start: expression.start + 1,
                end: expression.end - 1,
                value: expression.value
              });
            } else if (expression.type === 'TemplateLiteral') {
              // we process only the quasi parts (literals between ${expressions})
              for (const quasi of expression.quasis) {
                if (quasi.value.raw.trim().length > 0) {
                  // The start position of quasi is the backtick or } closing an expression
                  // quasi.start and quasi.end include these markers in AST.
                  // We can just rely on AST start and end.
                  // Wait, babel provides quasi.start and quasi.end without the `${` ? No, quasi spans exactly the raw string.
                  // Actually babel 7 quasis include the backtick if it's first/last, wait, no, they don't include it in raw value but AST node location might.

                  // Safer way: search within the quasi bounds for the exact raw string
                  const originalChunk = content.substring(quasi.start, quasi.end);
                  // The raw value might be missing backticks, so let's adjust start/end if they are included
                  // Actually, just find the raw string in that small chunk to be safe.
                  let rawStr = quasi.value.raw;

                  // if there's no word token, skip (e.g., just whitespace between expressions)
                  if (!rawStr.trim()) continue;

                  // Let's simply replace classes inside `quasi.value.raw`
                  // To be precise about start/end:
                  const startOffset = originalChunk.indexOf(rawStr);
                  if (startOffset !== -1) {
                    tokens.push({
                      start: quasi.start + startOffset,
                      end: quasi.start + startOffset + rawStr.length,
                      value: rawStr
                    });
                  }
                }
              }
            }
          }
        }
      }
    });

  } catch (err) {
    // console.warn("Failed to parse JSX:", err);
  }

  return tokens;
}
