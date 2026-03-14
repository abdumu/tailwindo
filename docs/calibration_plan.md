## Commands Executed

```bash
npm install
npm run build
npm test
npm run calibrate:samples
npm run test:ui
```

## 5. Summary of Failures

### 5.1 Playwright Fidelity Failures

**1. bulma/cards**
- **Failing elements:** `card`
- **Top mismatched properties:**
  - height (expected ~170.5, got 158.5)
- **Artifacts:** `playwright/.artifacts/bulma/cards/card/diff.json`

**2. bulma/columns**
- **Failing elements:** `bulma-container`, `bulma-columns`, `bulma-col-half`, `bulma-col-auto-1`, `bulma-col-auto-2`
- **Top mismatched properties:**
  - x, width
  - marginRight, marginLeft (expected ~64px, got 0px)
  - position (expected relative, got static)
- **Artifacts:** `playwright/.artifacts/bulma/columns/bulma-container/diff.json`

**3. grid**
- **Failing elements:** `grid-container`, `grid-row-1`, `grid-col-1`, `grid-col-2`, `grid-col-3`, `grid-row-2`, `grid-col-4`, `grid-col-5`
- **Top mismatched properties:**
  - x, width
  - marginRight, marginLeft (expected ~50px, got 0px)
- **Artifacts:** `playwright/.artifacts/grid/grid-container/diff.json`

**4. bulma/forms**
- **Failing elements:** `bulma-form-box`, `bulma-field-name`, `bulma-label-name`, `bulma-control-name`, `bulma-input-name`, `bulma-field-email`, `bulma-label-email`, `bulma-control-email`, `bulma-input-email`, `bulma-help-email`
- **Top mismatched properties:**
  - x, y, width, height
  - padding (paddingTop, paddingRight, paddingBottom, paddingLeft expected ~20px, got 24px)
  - marginBottom (expected ~0px, got 12px)
  - boxShadow (expected rgba(10, 10, 10, 0.05) 0px 1px 2px 0px inset, got none)
  - display (expected inline-flex, got block)
  - position (expected relative, got static)
  - justifyContent (expected flex-start, got normal)
  - alignItems (expected center, got normal)
- **Artifacts:** `playwright/.artifacts/bulma/forms/bulma-form-box/diff.json`

**5. foundation/grid**
- **Failing elements:** `foundation-container`, `foundation-grid-x`, `foundation-cell-1`, `foundation-callout-1`, `foundation-cell-2`, `foundation-callout-2`
- **Top mismatched properties:**
  - height (expected ~74, got 26)
  - padding (paddingTop, paddingRight, paddingBottom, paddingLeft expected ~16px, got 0px)
  - marginBottom (expected ~16px, got 0px)
- **Artifacts:** `playwright/.artifacts/foundation/grid/foundation-container/diff.json`

**6. foundation/callout**
- **Failing elements:** `foundation-callout-base`, `foundation-badge`, `foundation-label`, `foundation-button`
- **Top mismatched properties:**
  - padding (expected ~16px, got 0px)
  - marginBottom (expected ~16px, got 0px)
  - fontSize (expected ~9.6px, got 12px)
  - fontWeight (expected ~400, got 700)
  - borderRadius (expected ~50%, got 3.35544e+07px)
- **Artifacts:** `playwright/.artifacts/foundation/callout/foundation-callout-base/diff.json`

**7. forms** (Bootstrap spacing issues)
- **Failing elements:** `form-group-3`, `form-container`, `form-submit`
- **Top mismatched properties:**
  - marginBottom (expected ~16px, got 2px)
  - height, y
- **Artifacts:** `playwright/.artifacts/forms/form-group-3/diff.json`


### 5.2 Sample Calibration Failures
Idempotency drift files: None. `Idempotency OK.` reported across all samples.

**Bootstrap: bootstrap/theme**
- **Top 10 unmapped tokens:** `btn`, `btn-outline-primary`, `card-text`, `text-muted`, `card-title`, `card-body`, `card`, `col-md-6`, `btn-light`, `btn-lg`
- **Report path:** `templates/reports/bootstrap/theme/scan.json`

**Bulma: bulma/theme**
- **Top 10 unmapped tokens:** `mt-3`, `has-text-grey`, `card-content`, `mt-4`, `has-text-light`, `mt-2`, `has-text-white`, `has-background-primary`, `p-5`, `is-vcentered`
- **Report path:** `templates/reports/bulma/theme/scan.json`

**Foundation: foundation/theme**
- **Top unmapped tokens:** `card-section`, `card`, `text-white`, `bg-primary`
- **Report path:** `templates/reports/foundation/theme/scan.json`

## 6. Prioritized Calibration Plan

## 7. Promoted Fixtures (2026-03-14)
- **bulma/new-card-content**: Missing `card-content` mapping.
- **foundation/new-card-section**: Missing `card-section` mapping.

1. **Columns/Grid (Bulma / Foundation / Bootstrap)**
   - **Failing fixtures/samples:** `bulma/columns`, `foundation/grid`, `grid`, `bootstrap/theme`
   - **Key mismatched properties:** `width`, `marginLeft`, `marginRight`, `padding` (for containers), `height`
   - **Likely rule area to change:** Contextual rules for grid systems. For Bulma, `bulma-columns` margin offsets and `bulma-container` sizing. For Foundation, `grid-x` margins and `cell` sizing. Bootstrap `row` / `col-md-6` also unmapped.
2. **Forms Sizing/Padding (Bulma / Bootstrap)**
   - **Failing fixtures/samples:** `bulma/forms`, `forms`
   - **Key mismatched properties:** `padding` (expected ~20px, got 24px), `boxShadow` (inset), `display` (inline-flex), `position`, `marginBottom` (for fields).
   - **Likely rule area to change:** `bulma-form-box` component rules, `control` / `input` contextual mapping for proper flex and box-shadow translation. Bootstrap `form-group` missing bottom margins.
3. **Cards and Components (Foundation / Bulma / Bootstrap)**
   - **Failing fixtures/samples:** `foundation/callout`, `bulma/cards`, `foundation/theme`, `bulma/theme`, `bootstrap/theme`
   - **Key mismatched properties:** `padding` (~16px vs 0px on callouts), `borderRadius` (badge 50% vs raw px, label 0px vs 4px), `height` (card layout).
   - **Likely rule area to change:** Components mode. `card`, `card-body`, `card-text` (Bootstrap), `card-content` (Bulma), `card-section` (Foundation) require specific utility mapping. `foundation-callout-base` needs `p-4` or equivalent padding utilities.
4. **Typography & Utilities (Bulma / Foundation)**
   - **Failing fixtures/samples:** `foundation/callout`, `bulma/theme`
   - **Key mismatched properties:** `fontSize`, `fontWeight`, `lineHeight`.
   - **Likely rule area to change:** Dialect rules for text utilities like `has-text-grey`, `text-white`, or label/badge typography mapping.
