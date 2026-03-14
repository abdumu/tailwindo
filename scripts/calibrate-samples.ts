import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, '../templates/input');
const OUTPUT_DIR = path.resolve(__dirname, '../templates/output');
const REPORTS_DIR = path.resolve(__dirname, '../templates/reports');
const CLI_PATH = path.resolve(__dirname, '../src/cli.ts');

const args = process.argv.slice(2);
let filterFramework = '';
if (args[0] === '--framework' && args[1]) {
  filterFramework = args[1];
}

console.log('Starting sample calibration...');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const frameworks = fs.readdirSync(INPUT_DIR).filter(f => fs.statSync(path.join(INPUT_DIR, f)).isDirectory());

let failed = false;

for (const framework of frameworks) {
  if (filterFramework && framework !== filterFramework) continue;

  const samples = fs.readdirSync(path.join(INPUT_DIR, framework)).filter(f => fs.statSync(path.join(INPUT_DIR, framework, f)).isDirectory());

  for (const sample of samples) {
    console.log(`\nProcessing ${framework}/${sample}...`);

    const sampleInputDir = path.join(INPUT_DIR, framework, sample);
    const sampleOutputDir = path.join(OUTPUT_DIR, framework, sample);
    const sampleReportsDir = path.join(REPORTS_DIR, framework, sample);

    fs.mkdirSync(sampleOutputDir, { recursive: true });
    fs.mkdirSync(sampleReportsDir, { recursive: true });

    // Copy files to output
    execSync(`cp -r ${sampleInputDir}/* ${sampleOutputDir}/`);

    let dialectFlag = framework;
    if (framework === 'bootstrap' || framework === 'clean-blog') dialectFlag = 'bootstrap5';

    // 1. Scan
    console.log('  Running scan...');
    try {
      execSync(`npx tsx ${CLI_PATH} scan ${sampleInputDir} --from ${dialectFlag} > ${sampleReportsDir}/scan.log 2>&1`);
      // For now, save plain logs as JSON report placeholder
      const scanLog = fs.readFileSync(path.join(sampleReportsDir, 'scan.log'), 'utf8');
      fs.writeFileSync(path.join(sampleReportsDir, 'scan.json'), JSON.stringify({ log: scanLog }));
    } catch (e) {
      console.warn('  Scan had some errors or warnings, see logs.');
    }

    // 2. Transform (Pass 1)
    console.log('  Running transform (Pass 1)...');
    try {
      execSync(`npx tsx ${CLI_PATH} transform ${sampleOutputDir} --from ${dialectFlag} --prefix tw- --write > ${sampleReportsDir}/transform.log 2>&1`);
      const transformLog = fs.readFileSync(path.join(sampleReportsDir, 'transform.log'), 'utf8');
      fs.writeFileSync(path.join(sampleReportsDir, 'transform.json'), JSON.stringify({ log: transformLog }));
    } catch (e: any) {
      console.error(`  Transform (Pass 1) failed: ${e.message}`);
      failed = true;
    }

    // Snapshot pass 1 files
    const snapshotDir = path.join(sampleReportsDir, 'snapshot');
    fs.mkdirSync(snapshotDir, { recursive: true });
    execSync(`cp -r ${sampleOutputDir}/* ${snapshotDir}/`);

    // 3. Transform (Pass 2) for Idempotency
    console.log('  Running transform (Pass 2) for idempotency...');
    try {
      execSync(`npx tsx ${CLI_PATH} transform ${sampleOutputDir} --from ${dialectFlag} --prefix tw- --write > ${sampleReportsDir}/transform2.log 2>&1`);
    } catch (e: any) {
      console.error(`  Transform (Pass 2) failed: ${e.message}`);
      failed = true;
    }

    // Compare
    console.log('  Checking idempotency drift...');
    try {
      execSync(`diff -r ${snapshotDir} ${sampleOutputDir} > ${sampleReportsDir}/diff.log 2>&1`);
      console.log('  Idempotency OK.');
      fs.writeFileSync(path.join(sampleReportsDir, 'idempotency.json'), JSON.stringify({ ok: true, diff: "" }));
    } catch (e: any) {
      console.error(`  Idempotency failed! Diff found.`);
      const diffLog = fs.readFileSync(path.join(sampleReportsDir, 'diff.log'), 'utf8');
      fs.writeFileSync(path.join(sampleReportsDir, 'idempotency.json'), JSON.stringify({ ok: false, diff: diffLog }));
      failed = true;
    }
  }
}

if (failed) {
  console.error('\nCalibration failed!');
  process.exit(1);
} else {
  console.log('\nCalibration completed successfully.');
}
