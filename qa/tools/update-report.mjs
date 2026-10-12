import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const evidenceDir = path.join(repo, 'qa', 'evidence');
const jsonPath = path.join(evidenceDir, 'playwright-results.json');
const resultMd = path.join(repo, 'qa', 'testresultat.md');
const indexPath = path.join(repo, 'qa', 'index.html');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function extractId(title) {
  return title.match(/(WEB|AUTH|CONTACT)-[A-Z0-9]+/)?.[0] || 'N/A';
}

function collect(specs, rows = []) {
  for (const spec of specs || []) {
    for (const test of spec.tests || []) {
      const result = test.results?.[test.results.length - 1];
      const title = spec.title || test.title || 'Okänt testfall';
      rows.push({
        id: extractId(`${spec.title || ''} ${test.title || ''}`),
        title,
        file: spec.file || '',
        status: test.outcome || result?.status || 'unknown',
        duration: result?.duration || 0,
        error: result?.error?.message || result?.errors?.[0]?.message || ''
      });
    }
  }
  return rows;
}

let rows = [];
if (fs.existsSync(jsonPath)) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const walk = (suite) => {
    rows = collect(suite.specs, rows);
    for (const child of suite.suites || []) walk(child);
  };
  for (const suite of data.suites || []) walk(suite);
}

const now = new Date().toISOString();
const passed = rows.filter((r) => r.status === 'expected' || r.status === 'passed').length;
const failed = rows.filter((r) => r.status === 'unexpected' || r.status === 'failed' || r.status === 'timedOut').length;
const skipped = rows.filter((r) => r.status === 'skipped').length;
const total = rows.length;
const passRate = total ? Math.round((passed / total) * 100) : 0;
const failRate = total ? Math.round((failed / total) * 100) : 0;

const bugMap = new Map([
  ['WEB-004', 'BUG-WEB-004'],
  ['WEB-003', 'BUG-CONTACT-001'],
  ['CONTACT-001', 'BUG-CONTACT-001'],
  ['CONTACT-002', 'BUG-CONTACT-001'],
  ['CONTACT-003', 'BUG-CONTACT-001'],
  ['CONTACT-004', 'BUG-CONTACT-001'],
  ['CONTACT-005', 'BUG-CONTACT-002'],
  ['AUTH-002', 'BUG-AUTH-002']
]);

const md = [];
md.push('# Testresultat - Qlerify black-box smoke');
md.push('');
md.push(`Körningsdatum: ${now}`);
md.push('Miljö: Windows, Playwright, Chromium desktop och mobile, publik webb');
md.push('Version/build: Publik webb, live-miljö');
md.push('');
md.push('## Test Execution Overview');
md.push('');
md.push(`- Totalt antal körda testfall: ${total}`);
md.push(`- Pass: ${passed}`);
md.push(`- Fail: ${failed}`);
md.push(`- Blocked/Ej körda: ${skipped}`);
md.push(`- Pass rate: ${passRate}%`);
md.push(`- Fail rate: ${failRate}%`);
md.push('');
md.push('## Detaljerade testresultat');
md.push('');
md.push('| Test Case ID | Titel | Status | Faktiskt resultat | Expected vs Actual | Bug ID | Kommentar |');
md.push('| --- | --- | --- | --- | --- | --- | --- |');
for (const row of rows) {
  const status = row.status === 'expected' || row.status === 'passed' ? 'Pass' : row.status === 'skipped' ? 'Blocked' : 'Fail';
  const actual = status === 'Pass' ? 'Testet gick igenom.' : (row.error || 'Testet failade. Se Playwright-rapport.');
  const bug = status === 'Fail' ? (bugMap.get(row.id) || 'BUG-TBD') : '-';
  md.push(`| ${row.id} | ${row.title.replaceAll('|', '/')} | ${status} | ${actual.replaceAll('\n', ' ').replaceAll('|', '/')} | Expected jämfördes med faktisk sida i browser. | ${bug} | ${row.file} |`);
}
if (!rows.length) {
  md.push('| N/A | Inga resultat hittades | Blocked | Playwright-resultat saknas | Testkörning behöver köras | - | Kör `qa\\run-tests.ps1` |');
}
md.push('');
md.push('## Sammanfattning');
md.push('');
md.push(`- Totalt antal körda testfall: ${total}`);
md.push(`- Pass rate: ${passRate}%`);
md.push(`- Fail rate: ${failRate}%`);
md.push('');
md.push('## Identifierade problem');
md.push('');
const failedRows = rows.filter((r) => !(r.status === 'expected' || r.status === 'passed' || r.status === 'skipped'));
if (failedRows.length) {
  for (const row of failedRows) {
    md.push(`- ${row.id}: ${row.title} - ${row.error ? row.error.split('\n')[0] : 'Se rapport.'}`);
  }
} else {
  md.push('- Inga kritiska fel dokumenterade i senaste körningen.');
}
fs.writeFileSync(resultMd, md.join('\n'), 'utf8');

const cards = rows.map((row) => {
  const status = row.status === 'expected' || row.status === 'passed' ? 'pass' : row.status === 'skipped' ? 'blocked' : 'fail';
  return `<tr><td>${esc(row.id)}</td><td>${esc(row.title)}</td><td><span class="badge ${status}">${esc(status.toUpperCase())}</span></td><td>${esc(row.duration)} ms</td><td>${esc(row.error ? row.error.split('\n')[0] : '-')}</td></tr>`;
}).join('\n');

const html = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Qlerify QA Rapport</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f7f8fa; color: #111827; }
    header { background: #101828; color: white; padding: 24px; }
    main { max-width: 1180px; margin: 0 auto; padding: 24px; }
    h1, h2 { margin-top: 0; }
    .commands, .panel { background: white; border: 1px solid #d0d5dd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    pre { background: #111827; color: white; padding: 12px; border-radius: 6px; overflow: auto; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .metric { background: white; border: 1px solid #d0d5dd; border-radius: 8px; padding: 16px; }
    .metric strong { display: block; font-size: 28px; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border-bottom: 1px solid #eaecf0; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #f2f4f7; }
    .badge { padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: bold; }
    .pass { background: #dcfae6; color: #067647; }
    .fail { background: #fee4e2; color: #b42318; }
    .blocked { background: #fef0c7; color: #b54708; }
  </style>
</head>
<body>
  <header>
    <h1>Qlerify QA Rapport</h1>
    <p>Black-box smoke tests för publika sidor. Senast uppdaterad: ${esc(now)}</p>
  </header>
  <main>
    <section class="commands">
      <h2>Kommandon</h2>
      <pre>cd "D:\\LIA 2"
.\qa\run-tests.ps1
npm run test:smoke
npm run report
Start-Process "D:\\LIA 2\\qa\\index.html"</pre>
    </section>
    <section class="summary">
      <div class="metric"><span>Totalt</span><strong>${total}</strong></div>
      <div class="metric"><span>Pass</span><strong>${passed}</strong></div>
      <div class="metric"><span>Fail</span><strong>${failed}</strong></div>
      <div class="metric"><span>Pass rate</span><strong>${passRate}%</strong></div>
    </section>
    <section class="panel">
      <h2>Testresultat</h2>
      <table>
        <thead><tr><th>ID</th><th>Test</th><th>Status</th><th>Tid</th><th>Kommentar</th></tr></thead>
        <tbody>${cards || '<tr><td>N/A</td><td>Inga resultat ännu</td><td><span class="badge blocked">BLOCKED</span></td><td>-</td><td>Kör qa\\run-tests.ps1</td></tr>'}</tbody>
      </table>
    </section>
    <section class="panel">
      <h2>Rapporter</h2>
      <p><a href="testresultat.md">testresultat.md</a> | <a href="testplan.md">testplan.md</a> | <a href="testspecifikation.md">testspecifikation.md</a> | <a href="buggrapporter.md">buggrapporter.md</a> | <a href="manual-exploratory-organisation.md">manual-exploratory-organisation.md</a></p>
    </section>
  </main>
</body>
</html>`;
fs.writeFileSync(indexPath, html, 'utf8');
console.log(`Rapport uppdaterad: ${resultMd}`);
console.log(`Dashboard uppdaterad: ${indexPath}`);
