import { parseFragment, DefaultTreeAdapterMap } from 'parse5';

export interface TokenRange {
  start: number;
  end: number;
  value: string;
}

export function parseHtmlClasses(content: string): TokenRange[] {
  const tokens: TokenRange[] = [];

  // parse5 needs to be configured with sourceCodeLocationInfo: true to get start/end offsets
  const document = parseFragment(content, { sourceCodeLocationInfo: true }) as DefaultTreeAdapterMap['documentFragment'];

  function walk(node: DefaultTreeAdapterMap['node']) {
    // only Element nodes have attributes
    if ('attrs' in node) {
      const elementNode = node as DefaultTreeAdapterMap['element'];
      const classAttr = elementNode.attrs.find(a => a.name === 'class');

      if (classAttr && elementNode.sourceCodeLocation && elementNode.sourceCodeLocation.attrs && elementNode.sourceCodeLocation.attrs['class']) {
        const attrLocation = elementNode.sourceCodeLocation.attrs['class'];

        // `attrLocation` contains the whole attribute `class="value"`. We only want the inside of the quotes.
        // We can find the start of the value by checking the original string.
        const attrString = content.substring(attrLocation.startOffset, attrLocation.endOffset);

        // Find the index of the quote (' or ") after class=
        const valueMatch = attrString.match(/class\s*=\s*(['"])([\s\S]*?)\1/i);

        if (valueMatch) {
          const quoteChar = valueMatch[1];
          // The start of the value is right after the quote
          const valueStartRelative = attrString.indexOf(quoteChar) + 1;
          const valueStart = attrLocation.startOffset + valueStartRelative;
          const valueLength = valueMatch[2].length;
          const valueEnd = valueStart + valueLength;

          tokens.push({
            start: valueStart,
            end: valueEnd,
            value: valueMatch[2]
          });
        }
      }
    }

    if ('childNodes' in node) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  }

  walk(document);

  return tokens;
}
