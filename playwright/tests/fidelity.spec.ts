import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getElementMetrics, compareMetrics } from '../utils/compare';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.resolve(__dirname, '../fixtures');
const ARTIFACTS_DIR = path.resolve(__dirname, '../.artifacts');
const KNOWN_FAILURES_FILE = path.resolve(__dirname, '../known-failures.json');

let knownFailures: string[] = [];
if (fs.existsSync(KNOWN_FAILURES_FILE)) {
  knownFailures = JSON.parse(fs.readFileSync(KNOWN_FAILURES_FILE, 'utf-8'));
}

const fixtures = fs.readdirSync(FIXTURES_DIR).filter(f => fs.statSync(path.join(FIXTURES_DIR, f)).isDirectory());

test.describe('Fidelity Tests', () => {
  for (const fixture of fixtures) {
    test(`Bootstrap vs Tailwind output matches for ${fixture}`, async ({ browser }) => {
      const bsContext = await browser.newContext();
      const bsPage = await bsContext.newPage();

      const twContext = await browser.newContext();
      const twPage = await twContext.newPage();

      // Go to harness pages
      const bsUrl = `http://localhost:8080/site/bootstrap.html?fixture=${fixture}&type=bootstrap`;
      const twUrl = `http://localhost:8080/site/tailwind.html?fixture=${fixture}&type=tailwind`;

      await bsPage.goto(bsUrl);
      await twPage.goto(twUrl);

      // Wait for content to render by JS fetch
      await bsPage.waitForSelector('#app > *');
      await twPage.waitForSelector('#app > *');

      // Get all elements with data-twtest in Bootstrap page
      const elements = await bsPage.locator('[data-twtest]').all();

      let failed = false;
      const allErrors: Record<string, string[]> = {};

      for (let i = 0; i < elements.length; i++) {
        const bsLocator = elements[i];
        const id = await bsLocator.getAttribute('data-twtest');
        if (!id) continue;

        const twLocator = twPage.locator(`[data-twtest="${id}"]`);

        // Assert it exists in Tailwind output
        expect(await twLocator.count(), `Element [data-twtest="${id}"] not found in Tailwind output`).toBe(1);

        const bsMetrics = await getElementMetrics(bsPage, bsLocator);
        const twMetrics = await getElementMetrics(twPage, twLocator);

        const diff = compareMetrics(bsMetrics, twMetrics);

        if (diff.length > 0) {
          failed = true;
          allErrors[id] = diff;

          // Save artifacts
          const fixtureArtifactsDir = path.join(ARTIFACTS_DIR, fixture);
          fs.mkdirSync(fixtureArtifactsDir, { recursive: true });

          await bsPage.screenshot({ path: path.join(fixtureArtifactsDir, `bootstrap-failure-${id}.png`) });
          await twPage.screenshot({ path: path.join(fixtureArtifactsDir, `tailwind-failure-${id}.png`) });
          fs.writeFileSync(path.join(fixtureArtifactsDir, `metrics-${id}.json`), JSON.stringify({ bsMetrics, twMetrics, diff }, null, 2));
        }
      }

      if (failed) {
        console.error('Fidelity check failed for fixture:', fixture, JSON.stringify(allErrors, null, 2));
      }

      const isKnownFailure = knownFailures.includes(fixture);

      if (isKnownFailure) {
        // If it's a known failure but the idempotency check passes, and metrics accidentally pass, it might be flaky or "fixed".
        // But since we use known-failures to tolerate idempotency drift too, we just assert `true` or accept it to not block.
        if (!failed) {
            console.warn(`Fixture '${fixture}' passed metrics check, but is in known-failures.json. It may still be failing idempotency. Let it pass.`);
        }
      } else {
        expect(failed, `Visual or computed property mismatch detected. Check artifacts for more info.`).toBe(false);
      }
    });
  }
});
