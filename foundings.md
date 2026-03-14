# Findings

This file tracks major sample-driven mismatches and promoted fixtures from our calibration workflow.

## F-2026-03-14-001
- **Framework**: Bootstrap
- **Issue**: Need a real-world card component test.
- **Fixture**: `playwright/fixtures/bootstrap/cards`
- **Artifacts**: `playwright/.artifacts/bootstrap/cards/...` / `templates/input/bootstrap/theme/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-002
- **Framework**: Bulma
- **Issue**: Need a real-world card component test.
- **Fixture**: `playwright/fixtures/bulma/cards`
- **Artifacts**: `playwright/.artifacts/bulma/cards/...` / `templates/input/bulma/theme/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-003
- **Framework**: Bulma
- **Issue**: Need a real-world button component test.
- **Fixture**: `playwright/fixtures/bulma/buttons`
- **Artifacts**: `playwright/.artifacts/bulma/buttons/...` / `templates/input/bulma/theme/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-004
- **Framework**: Foundation
- **Issue**: Need a real-world card component test.
- **Fixture**: `playwright/fixtures/foundation/cards`
- **Artifacts**: `playwright/.artifacts/foundation/cards/...` / `templates/input/foundation/theme/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-005
- **Framework**: Foundation
- **Issue**: Need a real-world button component test.
- **Fixture**: `playwright/fixtures/foundation/buttons`
- **Artifacts**: `playwright/.artifacts/foundation/buttons/...` / `templates/input/foundation/theme/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-006
- **Framework**: Bulma
- **Issue**: Missing `card-content` mapping.
- **Fixture**: `playwright/fixtures/bulma/new-card-content`
- **Artifacts**: `playwright/.artifacts/bulma/new-card-content/...` / `templates/input/bulma/new-sample/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-007
- **Framework**: Foundation
- **Issue**: Missing `card-section` mapping.
- **Fixture**: `playwright/fixtures/foundation/new-card-section`
- **Artifacts**: `playwright/.artifacts/foundation/new-card-section/...` / `templates/input/foundation/new-sample/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## F-2026-03-14-008
- **Framework**: All
- **Issue**: Mission 2 Finding Hunt
- **Fixture**: `playwright/fixtures/<framework>/mission2`
- **Artifacts**: `playwright/.artifacts/<framework>/mission2/...` / `templates/input/<framework>/mission2/...`
- **Reproducer**: `npm run test:ui -- --project=chromium`
- **Status**: Added as fixture.

## Quarantine Exit Criteria (2026-03-14)
- **forms (Bootstrap)**: Needs spacing mapping for forms. Fix in utility mapping or `components` CSS generation.
- **grid (Bootstrap)**: Container width mismatch is idiomatic to Tailwind. To unquarantine, either adjust global tolerances or provide explicit max-width utilities in dialect rules.
- **bulma/buttons**: Missing contextual mappings. Fix by adding rules in `src/engine/contextualRules.ts`.
- **bulma/forms**: Spacing needs pseudo-selectors (`:not(:last-child)`). Fix in `--components` CSS generation or write complex contextual rules.
- **bulma/columns**: Margin offsets. Fix by mapping to complex negative margin utilities or handling via `--components`.
- **foundation/grid**: Grid margins/padding. Fix by mapping to Tailwind flex layout utilities or handling via `--components`.
- **foundation/callout**: Missing foundation component rules. Needs utility map or components generation to match.
- **bulma/cards**: Bulma cards layout mismatch. Needs deeper component analysis.

## Testing & Fidelity

See [Calibration Plan](docs/calibration_plan.md) for a summary of known fidelity failures and an upcoming prioritized calibration plan.
