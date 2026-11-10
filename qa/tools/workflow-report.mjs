import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const [workspaceArg, runId] = process.argv.slice(2);
const idPattern = /^[A-Za-z0-9][A-Za-z0-9-]{0,79}$/;
if (!workspaceArg || (runId && !idPattern.test(runId))) {
  throw new Error('Använd node workflow-report.mjs <arbetsmapp> [körnings-id].');
}

const workspace = path.resolve(workspaceArg);
const qaRoot = fileURLToPath(new URL('../', import.meta.url));
const overview = path.join(workspace, 'qa', 'index.html');
const manifestPath = path.join(workspace, 'reports', 'runs-manifest.json');
const statuses = ['Pass', 'Fail', 'Blocked', 'Ej körd'];
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : [];
if (!Array.isArray(manifest)) throw new Error('Körningsmanifestet ska vara en lista.');
const definitions = [
  ['PW-WF-01', 'Skapa och återöppna ett workflow', 'Samma workflow går att öppna från projektlistan.'],
  ['PW-WF-02', 'Ändra workflowets namn', 'Samma workflow visar det nya namnet efter återöppning och omladdning.'],
  ['PW-WF-03', 'Spara en diagramändring', 'Samma event och eventtext finns i Lane 1 efter återöppning och omladdning.'],
];

function workspacePath(relative) {
  const resolved = path.resolve(workspace, relative);
  const result = path.relative(workspace, resolved);
  if (path.isAbsolute(result) || result === '..' || result.startsWith('..' + path.sep)) {
    throw new Error('Rapportens filreferens måste ligga i arbetsmappen.');
  }
  return resolved;
}

function atomicWrite(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = file + '.' + randomUUID() + '.tmp';
  fs.writeFileSync(temporary, content, { encoding: 'utf8', flag: 'wx' });
  fs.renameSync(temporary, file);
}

function readSpecs(suites) {
  return suites.flatMap(suite => [...(suite.specs ?? []), ...readSpecs(suite.suites ?? [])]);
}

function recordPlaywright(id) {
  const folder = path.join(qaRoot, 'test-results', 'workflow', id);
  const resultPath = path.join(folder, 'result.json');
  const raw = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  const start = new Date(raw.stats?.startTime);
  if (!Number.isFinite(start.getTime())) throw new Error('Körningen saknar verifierad starttid.');
  const specs = readSpecs(raw.suites ?? []);
  if (specs.length !== definitions.length) throw new Error('JSON-filen motsvarar inte hela workflow-sviten.');
  const cases = definitions.map(([id, title, expected]) => {
    const candidates = specs.filter(spec => spec.title.startsWith(id + ' '));
    if (candidates.length !== 1 || candidates[0].tests?.length !== 1) {
      throw new Error('Ett unikt körningsresultat saknas för ' + id + '.');
    }
    const test = candidates[0].tests[0];
    const last = test.results?.at(-1);
    const blocker = [...(test.annotations ?? []), ...(last?.annotations ?? [])]
      .find(annotation => annotation.type === 'blocked');
    if (blocker) return { id, title, expected, status: 'Blocked', actual: blocker.description };
    if (!last || ['skipped', 'interrupted'].includes(last.status)) {
      return { id, title, expected, status: 'Ej körd', actual: 'Testet har inget slutfört resultat.' };
    }
    if (last.status === 'passed') return { id, title, expected, status: 'Pass', actual: expected };
    return { id, title, expected, status: 'Fail', actual: 'Playwright rapporterade ' + last.status + '. Se körningens HTML-rapport.' };
  });
  const relative = file => path.relative(workspace, file);
  const evidence = [
    { label: 'Playwright HTML och bifogade bevis', path: relative(path.join(folder, 'html', 'index.html')) },
    { label: 'Playwright JSON', path: relative(resultPath) },
  ];
  evidence.forEach(item => workspacePath(item.path));
  return {
    id,
    date: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit' }).format(start),
    kind: 'Playwright',
    environment: 'Lokal Chromium på Qlerify. Appens build okänd.',
    scope: 'Skapa, byta namn och spara diagram i ett godkänt QA-projekt med syntetiska workflows.',
    evidence,
    cases,
  };
}

function counts(run) {
  return Object.fromEntries(statuses.map(status => [status, run.cases.filter(item => item.status === status).length]));
}

function rate(value, total) {
  return total ? (value / total * 100).toLocaleString('sv-SE', { maximumFractionDigits: 1 }) + ' %' : 'Ej beräkningsbar';
}

function fileLink(from, file) {
  const target = workspacePath(file);
  if (!fs.existsSync(target)) return null;
  return path.relative(path.dirname(from), target).split(path.sep).map(encodeURIComponent).join('/');
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function md(value) {
  return String(value ?? '–').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
}

function reportPath(run) {
  return run.report ?? 'reports/' + run.id + '.md';
}

function markdownLink(from, item) {
  const href = fileLink(from, item.path);
  return href ? '[' + md(item.label) + '](' + href + ')' : md(item.label) + ' (fil saknas)';
}

function renderProtocol(run, file) {
  const count = counts(run);
  const total = count.Pass + count.Fail;
  const rows = run.cases.map(item => {
    const evidence = (item.evidence ?? []).map(e => markdownLink(file, e)).join(', ');
    const bug = item.bug ? markdownLink(file, { path: item.bug.path, label: item.bug.id }) : '–';
    return '| ' + [item.id, item.title, item.status, item.expected, item.actual, bug, evidence || '–'].map(md).join(' | ') + ' |';
  });
  return [
    '# ' + run.id + ' – ' + run.kind + ' körning', '',
    '| Uppgift | Värde |', '| --- | --- |', '| Datum | ' + md(run.date) + ' |',
    '| QA-ansvarig | Ali Reza Hezareh |', '| Miljö och build | ' + md(run.environment) + ' |',
    '| Omfattning | ' + md(run.scope) + ' |', '',
    '## Utfall', '',
    '| Test-ID | Kontroll | Status | Förväntat | Faktiskt | Bugg | Bevis |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows, '', '## Sammanfattning', '',
    '- Körda med Pass eller Fail ' + total,
    ...statuses.map(status => '- ' + status + ' ' + count[status]),
    '- Pass rate ' + rate(count.Pass, total),
    '- Fail rate ' + rate(count.Fail, total),
    '', 'Procentsatserna beräknas på Pass + Fail för den här körningen.',
    ...(run.evidence?.length ? ['', '## Körningens bevis', '', ...run.evidence.map(e => '- ' + markdownLink(file, e))] : []),
    ...(run.note ? ['', run.note] : []), '',
  ].join('\n');
}

function htmlLink(from, item) {
  const href = fileLink(from, item.path);
  return href ? '<a href="' + esc(href) + '">' + esc(item.label) + '</a>' : esc(item.label) + ' (fil saknas)';
}

function renderRun(run) {
  const tally = counts(run);
  const bars = statuses.map(status => '<li>' + esc(status) + ' ' + tally[status] +
    '<meter min="0" max="' + run.cases.length + '" value="' + tally[status] + '" aria-label="' + esc(status) + '"></meter></li>').join('');
  const rows = run.cases.map(item => '<tr><td>' + esc(item.id) + '</td><td>' + esc(item.title) +
    '</td><td><strong>' + esc(item.status) + '</strong></td><td>' + esc(item.actual) + '</td><td>' +
    [...(item.evidence ?? []), ...(item.bug ? [{ label: item.bug.id, path: item.bug.path }] : [])]
      .map(e => htmlLink(overview, e)).join('<br>') + '</td></tr>').join('');
  const evidence = [{ label: 'Körningsprotokoll', path: reportPath(run) }, ...(run.evidence ?? [])]
    .map(e => htmlLink(overview, e)).join(' · ');
  return '<article><h3>' + esc(run.date) + ' · ' + esc(run.id) + '</h3><p>' + esc(run.environment) +
    '</p><p>' + esc(run.scope) + '</p><figure><figcaption>Antal per status i denna körning</figcaption><ul class="counts">' +
    bars + '</ul></figure><div class="table-wrap"><table><thead><tr><th>ID</th><th>Kontroll</th><th>Status</th><th>Faktiskt</th><th>Bevis och bugg</th></tr></thead><tbody>' +
    rows + '</tbody></table></div><p>' + evidence + '</p></article>';
}

function renderOverview(runs) {
  const newestFirst = [...runs].reverse().sort((left, right) => right.date.localeCompare(left.date));
  const grouped = ['Manuell', 'Playwright'].map(kind => {
    const matching = newestFirst.filter(run => run.kind === kind);
    return '<section><h2>' + esc(kind === 'Manuell' ? 'Manuella körningar' : 'Lokala Playwright-körningar') + '</h2>' +
      (matching.length ? matching.map(renderRun).join('') : '<p>Inga sparade körningsresultat.</p>') + '</section>';
  }).join('');
  const bugs = new Map();
  for (const run of newestFirst) {
    for (const item of run.cases) {
      if (item.bug && !bugs.has(item.bug.id)) bugs.set(item.bug.id, item.bug);
    }
  }
  const bugLinks = [...bugs.values()].map(bug => '<li>' +
    htmlLink(overview, { label: bug.id + ' – ' + bug.title, path: bug.path }) + '</li>').join('');
  const resources = [
    { label: 'Testplan för punkt 1 och 2', path: 'docs/04-testplan-punkt-1-2.md' },
    { label: 'Testfall', path: 'docs/testfall-punkt-1-2.md' },
    { label: 'Examensunderlag och metod', path: 'thesis-examensarbete/metod-och-testunderlag.md' },
    { label: 'Protokoll för pilotmätningen', path: 'thesis-examensarbete/pilot-matning-protokoll.md' },
    { label: 'Historisk QA-översikt i repot', path: 'repo/qa/index.html' },
  ].filter(item => fileLink(overview, item.path)).map(item => htmlLink(overview, item)).join(' · ');
  const quote = value => "'" + value.replaceAll("'", "''") + "'";
  const commands = [
    'Set-Location -LiteralPath ' + quote(path.resolve(qaRoot, '..')),
    '.\\qa\\run-tests.ps1 -Suite Workflow -Workspace ' + quote(workspace),
    '.\\qa\\run-tests.ps1 -Suite Overview -Workspace ' + quote(workspace),
  ].join('\n');
  return '<!doctype html>\n<html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Qlerify QA · punkt 1 och 2</title><style>' +
    'body{margin:0;background:#eff4f8;color:#17263a;font:16px/1.5 system-ui,sans-serif}main{max-width:72rem;margin:auto;padding:clamp(.75rem,3vw,2.5rem)}' +
    'h1,h2,h3{line-height:1.2}a{color:#104e80}article,section.commands{background:white;border:1px solid #cbd7e4;border-radius:.6rem;padding:1rem;margin:1rem 0}' +
    'pre,.table-wrap{overflow-x:auto}pre{background:#edf2f7;padding:.75rem}table{border-collapse:collapse;width:100%;min-width:34rem}th,td{padding:.5rem;text-align:left;vertical-align:top;border-bottom:1px solid #d9e2ec}' +
    'figure{margin:1rem 0}.counts{display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));list-style:none;padding:0;gap:.6rem}meter{display:block;width:100%}p,td{overflow-wrap:anywhere}</style>' +
    '<main><h1>Qlerify QA · punkt 1 och 2</h1><p>Senaste dokumenterade körning ' + esc(newestFirst[0]?.date ?? 'saknas') +
    '</p><section class="commands"><h2>Körkommandon i PowerShell</h2><pre>' + esc(commands) + '</pre></section><p>' + resources + '</p>' +
    grouped + '<section><h2>Bekräftade produktfel i underlaget</h2>' + (bugLinks ? '<ul>' + bugLinks + '</ul>' : '<p>Inga registrerade i dessa körningar.</p>') +
    '</section></main></html>\n';
}

let newRun;
if (runId) {
  if (manifest.some(run => run.id === runId)) throw new Error('Körnings-id finns redan i historiken.');
  newRun = recordPlaywright(runId);
  manifest.push(newRun);
}
const runIds = new Set();
for (const run of manifest) {
  if (!idPattern.test(run.id) || runIds.has(run.id) || !Array.isArray(run.cases) || !run.cases.length
    || run.cases.some(item => !statuses.includes(item.status))) {
    throw new Error('Körningsmanifestet har ett ogiltigt id eller testresultat.');
  }
  runIds.add(run.id);
  if (!run.report) {
    const file = workspacePath(reportPath(run));
    atomicWrite(file, renderProtocol(run, file));
  }
}
if (newRun) atomicWrite(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
atomicWrite(overview, renderOverview(manifest));
console.log(overview);
if (newRun?.cases.some(item => item.status === 'Blocked' || item.status === 'Ej körd')) process.exitCode = 2;
