# Fix Inventory

## 2.1 Unit test failures
- **None**. `npm test` ran successfully (12 test files, 41 tests passed).

## 2.2 Calibration failures
- **None**. `npm run calibrate:samples` completed successfully with "Idempotency OK" for all samples.

## 2.3 Playwright failures

### 1. `bulma/columns`
- **Failing Element IDs**: `bulma-container`, `bulma-columns`, `bulma-col-half`, `bulma-col-auto-1`, `bulma-col-auto-2`
- **Top Mismatched Properties**:
  - `bulma-container`: Bounding Box [x], Bounding Box [width], Style [marginRight], Style [marginLeft], Style [position]
  - `bulma-columns`: Bounding Box [x], Bounding Box [width]
  - `bulma-col-half`: Bounding Box [x], Bounding Box [width]
  - `bulma-col-auto-1`, `bulma-col-auto-2`: Bounding Box [width], Bounding Box [x]
- **Artifact Paths**: `playwright/.artifacts/bulma/columns/...`
- **Quarantined**: Yes (`bulma/columns` in `known-failures.json`)

### 2. `foundation/callout`
- **Failing Element IDs**: `foundation-callout-base`, `foundation-button`, `foundation-badge`, `foundation-label`
- **Top Mismatched Properties**:
  - `foundation-callout-base`: Bounding Box [height], Style [marginBottom, paddingTop, paddingRight, paddingBottom, paddingLeft]
  - `foundation-button`: Bounding Box [x, y, width, height], Style [marginBottom, lineHeight]
  - `foundation-badge`: Bounding Box [x, y, width, height], Style [paddingRight, paddingLeft, fontSize, fontWeight, lineHeight, borderRadius]
  - `foundation-label`: Bounding Box [x, y, height], Style [fontWeight, borderRadius]
- **Artifact Paths**: `playwright/.artifacts/foundation/callout/...`
- **Quarantined**: Yes (`foundation/callout` in `known-failures.json`)

### 3. `bulma/forms`
- **Failing Element IDs**: `bulma-form-box`, `bulma-field-email`, `bulma-help-email`
- **Top Mismatched Properties**:
  - `bulma-form-box`: Bounding Box [height]
  - `bulma-field-email`: Bounding Box [height], Style [marginBottom]
  - `bulma-help-email`: Style [marginTop]
- **Artifact Paths**: `playwright/.artifacts/bulma/forms/...`
- **Quarantined**: Yes (`bulma/forms` in `known-failures.json`)

### 4. `foundation/grid`
- **Failing Element IDs**: `foundation-container`, `foundation-grid-x`, `foundation-cell-1`, `foundation-callout-1`, `foundation-cell-2`, `foundation-callout-2`
- **Top Mismatched Properties**:
  - `foundation-container`, `foundation-grid-x`, `foundation-cell-1`, `foundation-cell-2`: Bounding Box [height]
  - `foundation-callout-1`, `foundation-callout-2`: Bounding Box [height], Style [marginBottom, paddingTop, paddingRight, paddingBottom, paddingLeft]
- **Artifact Paths**: `playwright/.artifacts/foundation/grid/...`
- **Quarantined**: Yes (`foundation/grid` in `known-failures.json`)

### 5. `grid`
- **Failing Element IDs**: `grid-container`, `grid-row-1`, `grid-col-1`, `grid-col-2`, `grid-col-3`, `grid-row-2`, `grid-col-4`, `grid-col-5`
- **Top Mismatched Properties**:
  - `grid-container`: Bounding Box [x, width], Style [marginRight, marginLeft]
  - `grid-row-1`, `grid-row-2`: Bounding Box [x, width]
  - `grid-col-1`, `grid-col-2`, `grid-col-3`, `grid-col-4`, `grid-col-5`: Bounding Box [x, width]
- **Artifact Paths**: `playwright/.artifacts/grid/...`
- **Quarantined**: Yes (`grid` in `known-failures.json`)