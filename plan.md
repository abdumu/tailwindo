# Plan to Upgrade Tailwindo for Tailwind CSS v4 and Improve Design Fidelity

## Objective
Upgrade the `tailwindo` converter to support Tailwind CSS v4+ and improve the Bootstrap-to-Tailwind conversion accuracy to at least 80%.

## Analysis
The current codebase relies on mappings compatible with Tailwind CSS v1.4. Tailwind CSS v4 introduces significant changes, and the current mappings result in a poor visual match (~50%).

### Key Issues Identified
1.  **Outdated Classes**:
    -   `whitespace-no-wrap` is now `whitespace-nowrap`.
    -   `flex-no-wrap` is now `flex-nowrap`.
    -   `flex-no-shrink` is now `flex-shrink-0`.
2.  **Design Mismatches**:
    -   **Buttons**: Colors and padding do not match Bootstrap's look. Hover states are missing or incorrect.
    -   **Grid**: `col` classes often map to `flex-1` but miss specific width handling for grid systems.
    -   **Cards**: Border width `border-1` is invalid (should be `border`). Spacing is inconsistent.
    -   **Forms**: Input fields lack appropriate styling (`form-input` styles or expanded utilities).
    -   **Colors**: Hardcoded colors (e.g., `blue-600`) may need adjustment for the v4 palette or to better match Bootstrap's theme.

## Execution Plan

### 1. Environment Setup
-   **Update `composer.json`**:
    -   Change `require.php` to `^7.2.0|^8.0` to support modern PHP versions.
    -   Run `composer install`.

### 2. Update Framework Mappings (`src/Framework/BootstrapFramework.php`)

#### General Utilities
-   Replace `whitespace-no-wrap` with `whitespace-nowrap`.
-   Replace `flex-no-wrap` with `flex-nowrap`.
-   Replace `flex-no-shrink` with `flex-shrink-0`.
-   Replace `sr-only-focusable` with `focus:not-sr-only`.
-   Update `border-1` to `border` (as 1px is default).

#### Component Specific Updates

**Buttons (`btn-`)**
-   Update padding to match Bootstrap 4/5 sizing (e.g., `py-2 px-4`).
-   Enhance colors:
    -   `btn-primary`: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`.
    -   `btn-secondary`: `bg-gray-600 text-white hover:bg-gray-700`.
-   Fix `btn-block`: Ensure it uses `w-full block`.

**Grid System**
-   Ensure `row` uses `flex flex-wrap -mx-4` (negative margin for gutters).
-   Ensure `col` uses `px-4` (padding for gutters).
-   Update column widths:
    -   `col-md-6` -> `md:w-1/2`.
    -   `col-lg-4` -> `lg:w-1/3`.

**Cards**
-   Update `card`: `relative flex flex-col min-w-0 break-words bg-white border border-gray-200 rounded-lg shadow-sm`.
-   Update `card-body`: `flex-auto p-5`.

**Forms**
-   Update `form-control`:
    -   `block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`.

**Alerts**
-   Update `alert` base: `relative px-4 py-3 mb-4 border rounded`.
-   Update colors to use valid Tailwind 4 colors (e.g., `bg-red-100 border-red-400 text-red-700`).

### 3. Verification & Testing
-   **Reproduction Script**: Create a script to convert standard Bootstrap components and inspect the output.
-   **Automated Tests**:
    -   Add new test cases in `tests/Bootstrap/ConverterTest.php` covering the updated mappings.
    -   Ensure existing tests pass.

### 4. Final Review
-   Verify that the generated HTML renders closely to the original Bootstrap design.
-   Ensure all generated classes are valid in Tailwind CSS v4.

## Expected Outcome
-   Full compatibility with Tailwind CSS v4.
-   Visual fidelity of converted code improved to >80%.
