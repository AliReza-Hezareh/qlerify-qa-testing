import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultReportName = 'exploratory-app-2026-10-19';

function parseArguments(args) {
  let reportName = defaultReportName;
  let watch = false;
  let sourceFile = null;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--watch') {
      watch = true;
    } else if (args[index] === '--source') {
      const value = args[++index];
      if (!value) throw new Error('--source kräver en Markdown-sökväg relativt qa/.');
      const resolved = path.resolve(qaRoot, value);
      const relative = path.relative(qaRoot, resolved);
      if (relative.startsWith('..') || path.isAbsolute(relative) || path.extname(resolved).toLowerCase() !== '.md') {
        throw new Error('--source får endast ange en Markdown-fil inom qa/.');
      }
      sourceFile = resolved;
    } else if (args[index] === '--report') {
      const value = args[++index];
      if (!value || !/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(value)) {
        throw new Error('--report kräver ett basnamn med bara bokstäver A–Z, siffror och bindestreck. Ange ingen sökväg eller filändelse.');
      }
      reportName = value;
    } else {
      throw new Error(`Okänd flagga: ${args[index]}. Använd --report <basnamn> och/eller --watch.`);
    }
  }
  return { reportName, watch, sourceFile };
}

let options;
try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(`Fel i rapportkommandot: ${error.message}`);
  process.exit(1);
}
const { reportName, watch, sourceFile } = options;
const sourcePath = sourceFile || path.join(qaRoot, 'reports', `${reportName}.md`);
const outputPath = sourcePath.replace(/\.md$/i, '.html');
const relativeUrl = target => path.relative(path.dirname(outputPath), target).split(path.sep).join('/');
const stylesheetUrl = relativeUrl(path.join(qaRoot, 'styles', 'qlerify-qa.css'));
const overviewUrl = relativeUrl(path.join(qaRoot, 'index.html'));
const sourceUrl = path.basename(sourcePath);
const commandArgs = sourceFile
  ? '--source "' + path.relative(qaRoot, sourceFile).split(path.sep).join('/') + '"'
  : '--report ' + reportName;
const outputRelative = path.relative(qaRoot, outputPath).split(path.sep).join('\\');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function safeUrl(value, image = false) {
  const url = value.trim();
  if (!url || /[\u0000-\u0020\u007f<>"'\\]/.test(url) || url.startsWith('//')) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) {
    return (image ? /^https?:/i : /^(https?:|mailto:)/i).test(url) ? url : null;
  }
  return url;
}

function inline(text) {
  const tokens = /`([^`]+)`|!\[([^\]]*)\]\(([^\s)]+)\)|\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let result = '';
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    result += escapeHtml(text.slice(offset, match.index));
    if (match[1] !== undefined) {
      result += `<code>${escapeHtml(match[1])}</code>`;
    } else if (match[2] !== undefined) {
      const url = safeUrl(match[3], true);
      result += url
        ? `<a href="${escapeHtml(url)}"><img src="${escapeHtml(url)}" alt="${escapeHtml(match[2])}" loading="lazy"></a>`
        : escapeHtml(match[2]);
    } else if (match[4] !== undefined) {
      const url = safeUrl(match[5]);
      result += url
        ? `<a href="${escapeHtml(url)}">${escapeHtml(match[4])}</a>`
        : escapeHtml(match[4]);
    } else if (match[6] !== undefined) {
      result += `<strong>${escapeHtml(match[6])}</strong>`;
    } else {
      result += `<em>${escapeHtml(match[7])}</em>`;
    }
    offset = match.index + match[0].length;
  }
  return result + escapeHtml(text.slice(offset));
}

function cells(line) {
  const text = line.trim();
  const values = [];
  let value = '';
  let codeDelimiter = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '\\' && text[index + 1] === '|') {
      value += '|';
      index++;
    } else if (char === '`') {
      let count = 1;
      while (text[index + count] === '`') count++;
      if (!codeDelimiter) codeDelimiter = count;
      else if (codeDelimiter === count) codeDelimiter = 0;
      value += '`'.repeat(count);
      index += count - 1;
    } else if (char === '|' && !codeDelimiter) {
      values.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value.trim());
  if (text.startsWith('|') && values[0] === '') values.shift();
  if (text.endsWith('|') && values.at(-1) === '') values.pop();
  return values;
}

function isTableDivider(line) {
  const values = cells(line);
  return values.length > 0 && values.every((value) => /^:?-{3,}:?$/.test(value));
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }

    const fence = line.match(/^\s*(`{3,}|~{3,})\s*([\w-]*)\s*$/);
    if (fence) {
      const content = [];
      index++;
      while (index < lines.length && !new RegExp(`^\\s*${fence[1][0]}{${fence[1].length},}\\s*$`).test(lines[index])) {
        content.push(lines[index++]);
      }
      if (index < lines.length) index++;
      blocks.push(`<pre><code${fence[2] ? ` class="language-${escapeHtml(fence[2])}"` : ''}>${escapeHtml(content.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
      index++;
      continue;
    }

    if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = cells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        const values = cells(lines[index++]);
        rows.push(`<tr>${headers.map((_, column) => `<td>${inline(values[column] || '')}</td>`).join('')}</tr>`);
      }
      blocks.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="Tabell i testrapporten"><table><thead><tr>${headers.map((value) => `<th scope="col">${inline(value)}</th>`).join('')}</tr></thead><tbody>${rows.join('\n')}</tbody></table></div>`);
      continue;
    }

    const item = line.match(/^\s*(?:([-+*])|(\d+)[.)])\s+(.+)$/);
    if (item) {
      const ordered = Boolean(item[2]);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      const start = ordered && item[2] !== '1' ? ` start="${Number(item[2])}"` : '';
      while (index < lines.length) {
        const next = lines[index].match(/^\s*(?:([-+*])|(\d+)[.)])\s+(.+)$/);
        if (!next || Boolean(next[2]) !== ordered) break;
        items.push(`<li>${inline(next[3])}</li>`);
        index++;
      }
      blocks.push(`<${tag}${start}>${items.join('\n')}</${tag}>`);
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push('<hr>'); index++; continue;
    }

    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim()
      && !/^(?:#{1,6}\s|\s*(?:`{3,}|~{3,})|\s*(?:[-+*]|\d+[.)])\s)/.test(lines[index])
      && !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))) {
      paragraph.push(lines[index++]);
    }
    blocks.push(`<p>${paragraph.map(inline).join('<br>')}</p>`);
  }
  return blocks.join('\n');
}

function main() {
  if (fs.existsSync(outputPath) && fs.readFileSync(outputPath, 'utf8').includes('<!-- qa:custom-design')) {
    console.log('Fristående designprov bevaras: ' + outputPath);
    return;
  }
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Markdown-rapporten saknas: ${sourcePath}. Skapa rapporten innan HTML-versionen uppdateras.`);
  }
  const source = fs.readFileSync(sourcePath, 'utf8');
  const title = source.match(/^#\s+(.+)$/m)?.[1] || 'Qlerify – utforskande appgranskning';
  const html = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
${watch ? '  <meta http-equiv="refresh" content="8">' : ''}
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' https: http:; base-uri 'none'; form-action 'none'">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme:light; --ink:#182230; --muted:#475467; --line:#d0d5dd; --blue:#175cd3; }
    * { box-sizing:border-box; } body { margin:0; color:var(--ink); background:#f3f5f8; font:16px/1.6 "Segoe UI",Arial,sans-serif; }
    header { background:#101828; color:#fff; padding:28px max(24px,calc((100vw - 1180px)/2)); }
    header h1 { font-size:1.7rem; margin:0 0 8px; } header p { margin:0; color:#eaecf0; }
    main { max-width:1228px; padding:24px; margin:auto; } section,article { background:#fff; border:1px solid var(--line); border-radius:10px; padding:24px; margin-bottom:20px; }
    h1,h2,h3,h4 { line-height:1.3; } article h1 { font-size:1.9rem; margin-top:0; } h2 { margin-top:32px; border-bottom:1px solid var(--line); padding-bottom:10px; }
    section h2 { margin-top:0; } p,li { overflow-wrap:anywhere; } a { color:var(--blue); text-underline-offset:3px; } a:focus-visible,[tabindex]:focus-visible { outline:3px solid #1570ef; outline-offset:3px; }
    pre { background:#101828; color:#f9fafb; padding:16px; border-radius:6px; overflow:auto; font-size:.9rem; } code { font-family:Consolas,monospace; } :not(pre)>code { background:#eef2f6; padding:2px 5px; border-radius:4px; white-space:break-spaces; }
    .table-scroll { overflow-x:auto; margin:20px 0; border:1px solid var(--line); border-radius:6px; } table { border-collapse:collapse; width:100%; font-size:.94rem; min-width:580px; } th,td { padding:12px; border-bottom:1px solid #eaecf0; text-align:left; vertical-align:top; } th { background:#eef2f6; } tbody tr:nth-child(even) { background:#f9fafb; } tr:last-child td { border-bottom:0; }
    img { display:block; max-width:100%; height:auto; border:1px solid var(--line); margin:16px 0; } .links { display:flex; gap:20px; flex-wrap:wrap; } footer { color:var(--muted); font-size:.9rem; padding:0 0 24px; } hr { border:0; border-top:1px solid var(--line); margin:28px 0; }
    @media(max-width:640px) { main { padding:12px; } section,article { padding:16px; } header { padding:20px; } article h1 { font-size:1.5rem; } }
    @media print { body { background:#fff; font-size:10pt; } header { padding:12px; color:#000; background:#fff; } header p { color:#333; } main { padding:0; } section,article { padding:12px; border:0; } table { min-width:0; font-size:8pt; } .table-scroll { overflow:visible; } pre { white-space:pre-wrap; color:#000; background:#f4f4f4; } h2,h3 { break-after:avoid; } img { max-height:80vh; object-fit:contain; } }
  </style>
  <link rel="stylesheet" href="${escapeHtml(stylesheetUrl)}">
</head>
<body class="qa-document">
  <header><h1>${inline(title)}</h1><p>${escapeHtml(path.basename(sourcePath, '.md'))} · Testresultat, bekräftade fel och avgränsningar</p></header>
  <main>
    <section aria-labelledby="commands"><h2 id="commands">PowerShell-kommandon</h2><p>HTML-rapporten skapas från Markdown-filen. För löpande uppdatering används bevakningsläget i en egen terminalflik. Då byggs rapporten om när Markdown-filen ändras och webbsidan laddas om var åttonde sekund. Avsluta med Ctrl+C.</p><pre><code>Set-Location "D:\\LIA 2\\code"
node .\\qa\\tools\\render-exploratory-report.mjs ${escapeHtml(commandArgs)}
Start-Process ".\\qa\\${escapeHtml(outputRelative)}"

# Löpande uppdatering efter ändringar i Markdown-rapporten:
node .\\qa\\tools\\render-exploratory-report.mjs ${escapeHtml(commandArgs)} --watch</code></pre><div class="links"><a href="${escapeHtml(sourceUrl)}">Läs Markdown-källan</a><a href="${escapeHtml(overviewUrl)}">Öppna QA-översikten</a></div></section>
    <article>${renderMarkdown(source)}</article>
    <footer>Rapportens resultat och datum hämtas från Markdown-källan. Generering av HTML innebär ingen ny testkörning.</footer>
  </main>
</body>
</html>
`;
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Manuell QA-rapport uppdaterad: ${outputPath}`);
}

function renderSafely() {
  try {
    main();
    return true;
  } catch (error) {
    console.error(`Kunde inte skapa den manuella QA-rapporten: ${error.message}`);
    return false;
  }
}

function watchReport() {
  let watcher;
  let rebuildTimer;
  let reconnectTimer;
  let stopped = false;
  let lastWatchError = '';
  let waitingToReconnect = false;

  function reconnect() {
    waitingToReconnect = true;
    clearTimeout(reconnectTimer);
    if (!stopped) reconnectTimer = setTimeout(connect, 500);
  }

  function connect() {
    if (stopped) return;
    watcher?.close();
    try {
      watcher = fs.watch(sourcePath, (event) => {
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(renderSafely, 200);
        // En editor kan ersätta filen vid sparning. Anslut då till samma sökväg igen.
        if (event === 'rename') reconnect();
      });
      watcher.on('error', (error) => {
        console.error(`Bevakningen av rapporten avbröts: ${error.message}. Försöker ansluta igen.`);
        watcher.close();
        reconnect();
      });
      lastWatchError = '';
      if (waitingToReconnect) {
        waitingToReconnect = false;
        renderSafely();
      }
    } catch (error) {
      if (lastWatchError !== error.message) {
        console.error(`Kunde inte bevaka Markdown-rapporten: ${error.message}. Försöker igen.`);
        lastWatchError = error.message;
      }
      reconnect();
    }
  }

  function stop() {
    stopped = true;
    clearTimeout(rebuildTimer);
    clearTimeout(reconnectTimer);
    watcher?.close();
    console.log('Bevakningen är avslutad.');
  }

  connect();
  console.log(`Bevakar endast ${sourcePath}. Avsluta med Ctrl+C.`);
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

const rendered = renderSafely();
if (watch) {
  watchReport();
} else if (!rendered) {
  process.exitCode = 1;
}
