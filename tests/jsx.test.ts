import { describe, it, expect } from 'vitest';
import { parseJsxClasses } from '../src/parsers/jsx.js';

describe('JSX Parser', () => {
  it('should find className literals', () => {
    const code = `
      function App() {
        return (
          <div className="d-flex p-3">
            <span className={'text-danger'}>Alert</span>
          </div>
        );
      }
    `;
    const tokens = parseJsxClasses(code);
    expect(tokens.length).toBe(2);
    expect(tokens[0].value).toBe('d-flex p-3');
    expect(tokens[1].value).toBe('text-danger');
  });

  it('should handle template literals', () => {
    const code = `
      const App = ({ active }) => (
        <div className={\`container p-3 \${active ? 'd-block' : 'd-none'} text-center\`}></div>
      );
    `;
    const tokens = parseJsxClasses(code);
    // Quasis: "container p-3 " and " text-center"
    expect(tokens.length).toBe(2);
    expect(tokens[0].value).toBe('container p-3 ');
    expect(tokens[1].value).toBe(' text-center');
  });
});
