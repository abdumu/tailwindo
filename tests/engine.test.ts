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

    // Components (shared)
    expect(converter.convertClasses('btn btn-primary btn-block').converted).toBe('inline-block font-normal text-center align-middle cursor-pointer select-none border border-transparent py-2 px-4 rounded leading-normal bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 w-full block');
    expect(converter.convertClasses('card card-body form-control alert alert-success').converted).toBe('relative flex flex-col min-w-0 break-words bg-white border border-gray-200 rounded-lg shadow-sm flex-auto p-5 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none relative px-4 py-3 mb-4 border rounded bg-green-100 border-green-400 text-green-700');
    expect(converter.convertClasses('row col col-md-6').converted).toBe('flex flex-wrap -mx-4 px-4 flex-1 md:w-6/12 px-4');
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

    // Components (shared)
    expect(converter.convertClasses('btn btn-secondary').converted).toBe('inline-block font-normal text-center align-middle cursor-pointer select-none border border-transparent py-2 px-4 rounded leading-normal bg-gray-600 text-white hover:bg-gray-700');
    expect(converter.convertClasses('col col-sm-12 col-xxl-4').converted).toBe('px-4 flex-1 sm:w-12/12 px-4 2xl:w-4/12 px-4');
  });

  it('auto detection', () => {
    expect(autoDetectDialect('<div class="d-none mt-3"></div>')).toBe('bootstrap4');
    expect(autoDetectDialect('<div class="d-none ms-3"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="g-3"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="text-start"></div>')).toBe('bootstrap5');
    expect(autoDetectDialect('<div class="fw-bold"></div>')).toBe('bootstrap5');
  });
});
