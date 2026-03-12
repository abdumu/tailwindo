import { describe, it, expect } from 'vitest';
import { Converter } from '../src/engine/converter.js';
import { dialects, autoDetectDialect } from '../src/dialects/index.js';

describe('Dialects', () => {
  it('bootstrap4 mappings', () => {
    const converter = new Converter(dialects.bootstrap4);

    // Display
    expect(converter.convertClasses('d-none d-md-block').converted).toBe('hidden md:block');
    // Spacing
    expect(converter.convertClasses('mt-3 p-4 px-sm-5').converted).toBe('mt-4 p-6 sm:px-12');
    // Flex
    expect(converter.convertClasses('justify-content-center align-items-md-start').converted).toBe('justify-center md:items-start');
    // Text
    expect(converter.convertClasses('text-center font-weight-bold text-primary').converted).toBe('text-center font-bold text-blue-600');
    // Auto spacing
    expect(converter.convertClasses('ml-auto mx-md-auto').converted).toBe('ml-auto md:mx-auto');
  });

  it('bootstrap5 mappings', () => {
    const converter = new Converter(dialects.bootstrap5);

    // Display
    expect(converter.convertClasses('d-none d-xxl-block').converted).toBe('hidden xxl:block');
    // Spacing
    expect(converter.convertClasses('mt-3 p-4 px-sm-5').converted).toBe('mt-4 p-6 sm:px-12');
    // BS5 specific spacing (s/e for start/end mapping to l/r)
    expect(converter.convertClasses('ms-3 me-4 ps-sm-5').converted).toBe('ml-4 mr-6 sm:pl-12');
    // Gap
    expect(converter.convertClasses('g-3 gx-4 gy-sm-5').converted).toBe('gap-4 gap-x-6 sm:gap-y-12');
    // Flex
    expect(converter.convertClasses('justify-content-center align-items-md-start').converted).toBe('justify-center md:items-start');
    // Text
    expect(converter.convertClasses('text-center fw-bold text-start text-primary').converted).toBe('text-center font-bold text-left text-blue-600');
  });

  it('auto detection', () => {
    expect(autoDetectDialect('<div class="d-none mt-3"></div>')).toBe('bootstrap4');
    expect(autoDetectDialect('<div class="d-none ms-3"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="g-3"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="text-start"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="fw-bold"></div>')).toBe('bootstrap5');
  });
});
