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
                const expContent = prop.exp.content;
                const startOffset = prop.exp.loc.start.offset;
                const endOffset = prop.exp.loc.end.offset;

                // Try to find string literals inside the expression using regex.
                // We only support simple object { 'd-none': true } or array ['d-flex', ...] forms for safety.
                // Anything too complex is skipped.
                // A safe regex to find string literals (single or double quotes) inside the expression.
                const stringLiteralRegex = /(['"])(.*?)\1/g;
                let match;
                let foundAny = false;

                while ((match = stringLiteralRegex.exec(expContent)) !== null) {
                  const quote = match[1];
                  const innerString = match[2];
                  if (innerString.trim() !== '') {
                    foundAny = true;
                    const matchStart = match.index + 1; // skip the quote
                    const matchEnd = matchStart + innerString.length;

                    tokens.push({
                      start: startOffset + matchStart,
                      end: startOffset + matchEnd,
                      value: innerString
                    });
                  }
                }

                if (!foundAny) {
                   tokens.push({
                     start: startOffset,
                     end: endOffset,
                     value: expContent,
                     type: 'dynamic'
                   });
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
