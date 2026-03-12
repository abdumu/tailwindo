import { parse } from '@vue/compiler-sfc';
import { parseHtmlClasses, TokenRange } from './html.js';
import { parse as babelParse } from '@babel/parser';
import traverse_ from '@babel/traverse';

const traverse = typeof traverse_ === 'function' ? traverse_ : (traverse_ as any).default;

export function parseVueClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  try {
    const { descriptor } = parse(content);

    if (descriptor.template) {
      const templateContent = descriptor.template.content;
      const templateStart = descriptor.template.loc.start.offset;

      const htmlTokens = parseHtmlClasses(templateContent);

      for (const token of htmlTokens) {
        tokens.push({
          start: token.start + templateStart,
          end: token.end + templateStart,
          value: token.value
        });
      }

      // Also parse bound classes :class="{ 'd-none': true }"
      const extractBoundClasses = (node: any) => {
        if (!node) return;

        if (node.type === 1) { // Element
          for (const prop of node.props || []) {
            if (prop.type === 7 && prop.name === 'bind' && prop.arg && prop.arg.content === 'class') {
              if (prop.exp && prop.exp.content) {
                try {
                  const ast = babelParse(`(${prop.exp.content})`, {
                     sourceType: 'module'
                  });
                  traverse(ast, {
                    StringLiteral(path: any) {
                      tokens.push({
                        // `prop.exp.loc.start.offset` is relative to the ENTIRE FILE
                        // So we don't add `templateStart` to it!
                        start: prop.exp.loc.start.offset + path.node.start,
                        end: prop.exp.loc.start.offset + path.node.end - 2, // remove quotes, since babelParse wraps in parens
                        value: path.node.value
                      });
                    }
                  });
                } catch(e) {
                   // regex fallback if no AST
                   const regex = /(['"])(.*?)\1/g;
                   let match;
                   while ((match = regex.exec(prop.exp.content)) !== null) {
                     tokens.push({
                       start: prop.exp.loc.start.offset + match.index + 1,
                       end: prop.exp.loc.start.offset + match.index + 1 + match[2].length,
                       value: match[2]
                     });
                   }
                }
              }
            }
          }
        }

        for (const child of node.children || []) {
           extractBoundClasses(child);
        }
      };

      if (descriptor.template.ast) {
        extractBoundClasses(descriptor.template.ast);
      }
    }

  } catch (err) {
    // console.log(err);
  }

  return tokens;
}
