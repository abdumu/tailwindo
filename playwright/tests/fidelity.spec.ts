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
  const parsed = JSON.parse(fs.readFileSync(KNOWN_FAILURES_FILE, 'utf-8'));
  knownFailures = parsed.map((f: any) => f.fixture || f);
}

const fixtures = fs.readdirSync(FIXTURES_DIR).filter(f => fs.statSync(path.join(FIXTURES_DIR, f)).isDirectory());

test.describe('Fidelity Tests', () => {
  const summary = {
    passed: 0,
    failed: 0,
    quarantined: 0,
    propertyMismatches: {} as Record<string, number>
  };

  test.afterAll(() => {
    console.log('\n--- Fidelity Test Summary ---');
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Quarantined: ${summary.quarantined}`);

    console.log('\nTop 10 Mismatched Properties:');
    const sortedProps = Object.entries(summary.propertyMismatches)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    for (const [prop, count] of sortedProps) {
      console.log(`- ${prop}: ${count}`);
    }
    console.log('-----------------------------\n');
  });

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
      const allErrors: Record<string, ReturnType<typeof compareMetrics>> = {};

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
        const hasErrors = Object.values(diff).some(arr => arr.length > 0);

        if (hasErrors) {
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
        summary.quarantined++;
        expect(failed, `Fixture '${fixture}' is quarantined in known-failures.json but passed the fidelity test! Please remove it from known-failures.json.`).toBe(true);
      } else {
        if (failed) {
          summary.failed++;
          for (const id of Object.keys(allErrors)) {
            const diff = allErrors[id];
            for (const category of Object.values(diff)) {
              for (const errorStr of category) {
                 const match = errorStr.match(/^\[(.*?)\]/);
                 const prop = match ? match[1] : errorStr.split(':')[0];
                 summary.propertyMismatches[prop] = (summary.propertyMismatches[prop] || 0) + 1;
              }
            }
          }
        } else {
          summary.passed++;
        }
        expect(failed, `Visual or computed property mismatch detected. Check artifacts for more info.`).toBe(false);
      }
    });
  }
});
