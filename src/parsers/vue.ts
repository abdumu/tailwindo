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
                // To avoid offset corruption and fragile parsing of bound classes,
                // we mark the entire :class expression as a dynamic token.
                // This means it will be skipped during conversion, keeping the file safe.
                tokens.push({
                  start: prop.exp.loc.start.offset,
                  end: prop.exp.loc.end.offset,
                  value: prop.exp.content,
                  type: 'dynamic'
                });
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
