import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.resolve(__dirname, '../fixtures');
const GENERATED_DIR = path.resolve(__dirname, '../.generated');
const TAILWIND_DIR = path.resolve(__dirname, '../tailwind');

export default async function globalSetup() {
  console.log('Generating test fixtures...');

  if (fs.existsSync(GENERATED_DIR)) {
    fs.rmSync(GENERATED_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  const fixtures = fs.readdirSync(FIXTURES_DIR).filter(f => fs.statSync(path.join(FIXTURES_DIR, f)).isDirectory());

  let combinedComponentsCSS = '';

  for (const fixture of fixtures) {
    const fixtureInput = path.join(FIXTURES_DIR, fixture, 'input.html');
    if (!fs.existsSync(fixtureInput)) continue;

    const fixtureOutDir = path.join(GENERATED_DIR, fixture);
    fs.mkdirSync(fixtureOutDir, { recursive: true });

    const fixtureOutFile = path.join(fixtureOutDir, 'tailwind.html');
    const tempComponentsFile = path.join(fixtureOutDir, 'components.css');

    try {
      fs.copyFileSync(fixtureInput, fixtureOutFile);
      execSync(`npx tsx src/cli.ts transform ${fixtureOutFile} --write --components ${tempComponentsFile}`, { stdio: 'inherit' });

      fs.copyFileSync(fixtureInput, path.join(fixtureOutDir, 'bootstrap.html'));

      const fixtureOutFile2 = path.join(fixtureOutDir, 'tailwind2.html');
      fs.copyFileSync(fixtureOutFile, fixtureOutFile2);
      execSync(`npx tsx src/cli.ts transform ${fixtureOutFile2} --write --components ${tempComponentsFile}`, { stdio: 'inherit' });

      const content1 = fs.readFileSync(fixtureOutFile, 'utf-8');
      const content2 = fs.readFileSync(fixtureOutFile2, 'utf-8');

      const KNOWN_FAILURES_FILE = path.resolve(__dirname, '../known-failures.json');
      let knownFailures: string[] = [];
      if (fs.existsSync(KNOWN_FAILURES_FILE)) {
        knownFailures = JSON.parse(fs.readFileSync(KNOWN_FAILURES_FILE, 'utf-8'));
      }

      if (content1 !== content2) {
        if (knownFailures.includes(fixture)) {
          console.warn(`Idempotency check failed for ${fixture}, but it is in known-failures.json. Tolerating drift.`);
        } else {
          throw new Error(`Idempotency check failed for ${fixture}! Repeated conversion altered the output.`);
        }
      }
      fs.unlinkSync(fixtureOutFile2);

      if (fs.existsSync(tempComponentsFile)) {
        combinedComponentsCSS += fs.readFileSync(tempComponentsFile, 'utf-8') + '\n';
        fs.unlinkSync(tempComponentsFile);
      }
    } catch (err) {
      console.error(`Error transforming fixture: ${fixture}`);
      console.error(err);
      process.exit(1);
    }
  }

  fs.writeFileSync(path.join(GENERATED_DIR, 'components.css'), combinedComponentsCSS);

  console.log('Running Tailwind build...');
  try {
    const tailwindInput = path.join(TAILWIND_DIR, 'input.css');
    const tailwindOutput = path.join(GENERATED_DIR, 'tailwind.css');
    execSync(`npx tailwindcss -i ${tailwindInput} -o ${tailwindOutput}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Tailwind build failed');
    console.error(err);
    process.exit(1);
  }
}
