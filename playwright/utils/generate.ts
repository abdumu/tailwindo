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

  const frameworks = fs.readdirSync(FIXTURES_DIR).filter(f => fs.statSync(path.join(FIXTURES_DIR, f)).isDirectory());
  const fixtures: { framework: string, name: string }[] = [];

  for (const framework of frameworks) {
    const subFixtures = fs.readdirSync(path.join(FIXTURES_DIR, framework)).filter(f => fs.statSync(path.join(FIXTURES_DIR, framework, f)).isDirectory());
    subFixtures.forEach(f => fixtures.push({ framework, name: f }));
  }

  let combinedComponentsCSS = '';

  for (const fixture of fixtures) {
    const fixtureDir = path.join(FIXTURES_DIR, fixture.framework, fixture.name);
    const fixtureInput = path.join(fixtureDir, 'input.html');
    if (!fs.existsSync(fixtureInput)) continue;

    const fixtureOutDir = path.join(GENERATED_DIR, fixture.framework, fixture.name);
    fs.mkdirSync(fixtureOutDir, { recursive: true });

    const fixtureOutFile = path.join(fixtureOutDir, 'tailwind.html');
    const tempComponentsFile = path.join(fixtureOutDir, 'components.css');

    try {
      // 1. Copy input to working output file
      fs.copyFileSync(fixtureInput, fixtureOutFile);

      // 2. Generate components.css BEFORE mutating the HTML
      let fromArg = fixture.framework;
      if (fixture.framework === 'bootstrap') {
          fromArg = 'bootstrap5';
      }
      execSync(`npx tsx src/cli.ts transform ${fixtureOutFile} --from ${fromArg} --prefix tw: --components ${tempComponentsFile}`, { stdio: 'inherit' });

      if (fs.existsSync(tempComponentsFile)) {
         const componentsContent = fs.readFileSync(tempComponentsFile, 'utf-8');
         if (componentsContent.trim() !== '') {
            combinedComponentsCSS += componentsContent + '\n';
         }
         fs.unlinkSync(tempComponentsFile);
      }

      // 3. Mutate the HTML
      execSync(`npx tsx src/cli.ts transform ${fixtureOutFile} --from ${fromArg} --prefix tw: --write`, { stdio: 'inherit' });

      // 4. Save framework HTML
      fs.copyFileSync(fixtureInput, path.join(fixtureOutDir, 'framework.html'));

      // 5. Idempotency check
      const fixtureOutFile2 = path.join(fixtureOutDir, 'tailwind2.html');
      fs.copyFileSync(fixtureOutFile, fixtureOutFile2);
      execSync(`npx tsx src/cli.ts transform ${fixtureOutFile2} --from ${fromArg} --prefix tw: --write`, { stdio: 'inherit' });

      const content1 = fs.readFileSync(fixtureOutFile, 'utf-8');
      const content2 = fs.readFileSync(fixtureOutFile2, 'utf-8');

      const KNOWN_FAILURES_FILE = path.resolve(__dirname, '../known-failures.json');
      let knownFailures: string[] = [];
      if (fs.existsSync(KNOWN_FAILURES_FILE)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(KNOWN_FAILURES_FILE, 'utf-8'));
          knownFailures = parsed.map((f: any) => f.id);
        } catch (e) {
          console.error("Error reading known failures", e);
        }
      }

      const id = `${fixture.framework}/${fixture.name}`;

      if (content1 !== content2) {
        if (knownFailures.includes(id)) {
          console.warn(`Idempotency check failed for ${id}, but it is in known-failures.json. Tolerating drift.`);
        } else {
          throw new Error(`Idempotency check failed for ${id}! Repeated conversion altered the output.`);
        }
      }
      fs.unlinkSync(fixtureOutFile2);

    } catch (err) {
      console.error(`Error transforming fixture: ${fixture.framework}/${fixture.name}`);
      console.error(err);
      process.exit(1);
    }
  }

  // 6. Write combined components CSS to the globally accessible location
  fs.writeFileSync(path.join(GENERATED_DIR, 'components.css'), combinedComponentsCSS);

  console.log('Running Tailwind build...');
  try {
    const tailwindInput = path.join(TAILWIND_DIR, 'input.css');
    const tailwindOutput = path.join(GENERATED_DIR, 'tailwind.css');

    // Explicitly set working directory context for source scanning to work correctly with v4
    execSync(`cd playwright && npx tailwindcss -i tailwind/input.css -o .generated/tailwind.css`, { stdio: 'inherit' });

    // Sanity check for Tailwind v4 prefix pipeline
    const generatedCSS = fs.readFileSync(tailwindOutput, 'utf-8');
    if (!generatedCSS.includes('.tw\\:mb-')) {
      throw new Error("Tailwind v4 prefix pipeline failed: missing prefix utilities classes in output.");
    }
  } catch (err) {
    console.error('Tailwind build failed');
    console.error(err);
    process.exit(1);
  }
}