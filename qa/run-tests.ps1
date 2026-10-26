param(
    [switch]$NoOpen
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$QaRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $QaRoot
$ResultsDir = Join-Path $QaRoot "results"
$ReportsDir = Join-Path $QaRoot "reports"
$DocsDir = Join-Path $QaRoot "docs"
$BugsDir = Join-Path $QaRoot "bugs"
$IndexPath = Join-Path $QaRoot "index.html"

New-Item -ItemType Directory -Force -Path $ResultsDir, $ReportsDir | Out-Null

$RunDate = Get-Date
$RunDateIso = $RunDate.ToString("yyyy-MM-dd HH:mm:ss")
$EnvironmentName = "Publika Qlerify-sidor, Windows, PowerShell HTTP-kontroller"

function New-TestResult {
    param(
        [string]$Id,
        [string]$Title,
        [string]$Type,
        [string]$Priority,
        [string]$Url,
        [string]$Expected,
        [scriptblock]$Check
    )

    $started = Get-Date
    try {
        $actual = & $Check
        $status = "Pass"
        $errorText = ""
    }
    catch {
        $actual = $_.Exception.Message
        $status = "Fail"
        $errorText = $_.Exception.Message
    }

    [pscustomobject]@{
        id = $Id
        title = $Title
        type = $Type
        priority = $Priority
        url = $Url
        expected = $Expected
        actual = $actual
        status = $status
        error = $errorText
        durationMs = [int]((Get-Date) - $started).TotalMilliseconds
    }
}

function Invoke-QARequest {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30 -MaximumRedirection 5 -Headers @{
            "User-Agent" = "Qlerify-QA-Validation"
        }
    }
    catch {
        throw "Request misslyckades för $Url. Fel: $($_.Exception.Message)"
    }

    [pscustomobject]@{
        StatusCode = [int]$response.StatusCode
        Content = [string]$response.Content
        Headers = $response.Headers
    }
}

function Assert-Contains {
    param(
        [string]$Content,
        [string]$Needle,
        [string]$Message
    )

    if ($Content -notlike "*$Needle*") {
        throw $Message
    }
}

function ConvertTo-SafeMarkdown {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    return (($Text -replace "\r?\n", " ") -replace "\|", "\|").Trim()
}

$tests = @(
    @{
        Id = "SMK-HTTP-01"
        Title = "Startsidan svarar och visar Qlerify"
        Type = "Smoke"
        Priority = "High"
        Url = "https://www.qlerify.com/"
        Expected = "HTTP 200 och sidinnehåll för Qlerify visas."
        Check = {
            $r = Invoke-QARequest "https://www.qlerify.com/"
            if ($r.StatusCode -ne 200) { throw "Förväntade HTTP 200 men fick $($r.StatusCode)." }
            Assert-Contains $r.Content "Qlerify" "Startsidan saknar texten Qlerify."
            Assert-Contains $r.Content "Try for free" "Startsidan saknar CTA Try for free."
            "HTTP $($r.StatusCode). Qlerify och Try for free hittades."
        }
    },
    @{
        Id = "SMK-HTTP-02"
        Title = "Prissidan svarar och visar prisval"
        Type = "Smoke"
        Priority = "High"
        Url = "https://www.qlerify.com/pricing"
        Expected = "HTTP 200 och prisval för Monthly/Yearly visas."
        Check = {
            $r = Invoke-QARequest "https://www.qlerify.com/pricing"
            if ($r.StatusCode -ne 200) { throw "Förväntade HTTP 200 men fick $($r.StatusCode)." }
            Assert-Contains $r.Content "Monthly" "Prissidan saknar Monthly."
            Assert-Contains $r.Content "Yearly" "Prissidan saknar Yearly."
            "HTTP $($r.StatusCode). Monthly och Yearly hittades."
        }
    },
    @{
        Id = "SMK-HTTP-03"
        Title = "Inloggningssidan svarar"
        Type = "Smoke"
        Priority = "High"
        Url = "https://app.qlerify.com/login"
        Expected = "HTTP 200 och ingen serverkrasch."
        Check = {
            $r = Invoke-QARequest "https://app.qlerify.com/login"
            if ($r.StatusCode -ne 200) { throw "Förväntade HTTP 200 men fick $($r.StatusCode)." }
            "HTTP $($r.StatusCode). Inloggningssidan svarade utan serverfel."
        }
    },
    @{
        Id = "API-HTTP-01"
        Title = "Publikt arbetsflöde går att läsa utan krasch"
        Type = "API/UI Smoke"
        Priority = "High"
        Url = "https://app.qlerify.com/workflow/0cbc80c0-a79b-4920-90db-c6e7d9077e04/75d19947-1b0a-4e4b-a8dd-570862681788"
        Expected = "Sidan svarar utan serverfel."
        Check = {
            $url = "https://app.qlerify.com/workflow/0cbc80c0-a79b-4920-90db-c6e7d9077e04/75d19947-1b0a-4e4b-a8dd-570862681788"
            $r = Invoke-QARequest $url
            if ($r.StatusCode -ge 500) { throw "Serverfel på publikt arbetsflöde. HTTP $($r.StatusCode)." }
            "HTTP $($r.StatusCode). Inget serverfel från publikt arbetsflöde."
        }
    },
    @{
        Id = "REG-WEB-01"
        Title = "Bloggsidan visar inte generisk mallsektion efter sidfot"
        Type = "Regression/UI"
        Priority = "Medium"
        Url = "https://www.qlerify.com/blog"
        Expected = "Bloggsidan ska inte visa generisk malltext efter sidfoten."
        Check = {
            $r = Invoke-QARequest "https://www.qlerify.com/blog"
            if ($r.Content -like "*Grow your business*" -and $r.Content -like "*Start Now*") {
                throw "BUG-001 kvarstår: Generisk text 'Grow your business' och 'Start Now' hittades på bloggsidan."
            }
            "Ingen generisk mallsektion hittades i HTML-innehållet."
        }
    },
    @{
        Id = "REG-WEB-02"
        Title = "Bloggartikel visar inte intern markör"
        Type = "Regression/UI"
        Priority = "Medium"
        Url = "https://www.qlerify.com/post/ai-legacy-modernization-reverse-engineer-ecommerce-cart"
        Expected = "Intern markör ska inte visas på publika artiklar."
        Check = {
            $r = Invoke-QARequest "https://www.qlerify.com/post/ai-legacy-modernization-reverse-engineer-ecommerce-cart"
            if ($r.Content -like "*///SOCIAL SHARE*") {
                throw "BUG-002 kvarstår: Texten '///SOCIAL SHARE' hittades i artikeln."
            }
            "Ingen intern markör hittades i HTML-innehållet."
        }
    },
    @{
        Id = "REG-WEB-03"
        Title = "Telefonnumret på kontaktsidan har tel-länk"
        Type = "Regression/UI"
        Priority = "Medium"
        Url = "https://www.qlerify.com/contact"
        Expected = "Telefonnumret ska länka med tel: och inte #."
        Check = {
            $r = Invoke-QARequest "https://www.qlerify.com/contact"
            Assert-Contains $r.Content "+46 (0)8 503 556 55" "Telefonnumret hittades inte på kontaktsidan."
            if ($r.Content -match 'href=["'']#["''][^>]*>[\s\S]{0,80}\+46 \(0\)8 503 556 55') {
                throw "BUG-003 kvarstår: Telefonnumret använder href='#' i stället för tel-länk."
            }
            if ($r.Content -notmatch 'href=["'']tel:[^"'']+["''][^>]*>[\s\S]{0,80}\+46 \(0\)8 503 556 55') {
                throw "Telefonnumret hittades, men ingen tel-länk kunde verifieras."
            }
            "Telefonnumret har tel-länk."
        }
    }
)

$results = foreach ($test in $tests) {
    New-TestResult -Id $test.Id -Title $test.Title -Type $test.Type -Priority $test.Priority -Url $test.Url -Expected $test.Expected -Check $test.Check
}

$passed = @($results | Where-Object status -eq "Pass").Count
$failed = @($results | Where-Object status -eq "Fail").Count
$blocked = @($results | Where-Object status -eq "Blocked").Count
$total = @($results).Count
$passRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }
$failRate = if ($total -gt 0) { [math]::Round(($failed / $total) * 100, 1) } else { 0 }

$summary = [pscustomobject]@{
    runDate = $RunDateIso
    environment = $EnvironmentName
    total = $total
    passed = $passed
    failed = $failed
    blocked = $blocked
    passRate = $passRate
    failRate = $failRate
    results = $results
}

$jsonPath = Join-Path $ResultsDir "latest-results.json"
$mdPath = Join-Path $ResultsDir "latest-results.md"
$reportPath = Join-Path $ReportsDir "test-summary.md"

$summary | ConvertTo-Json -Depth 8 | Set-Content -Path $jsonPath -Encoding UTF8

$resultLines = @(
    "# Testresultat - Qlerify",
    "",
    "- Körningsdatum: $RunDateIso",
    "- Miljö: $EnvironmentName",
    "- Version/build: Publik webb, aktuell produktion vid körning",
    "",
    "## Test Execution Overview",
    "",
    "| Totalt | Pass | Fail | Blocked | Pass rate | Fail rate |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    "| $total | $passed | $failed | $blocked | $passRate% | $failRate% |",
    "",
    "## Detaljerade testresultat",
    "",
    "| Test Case ID | Titel | Status | Expected vs Actual | Bug ID | Kommentar |",
    "| --- | --- | --- | --- | --- | --- |"
)

foreach ($result in $results) {
    $bugId = ""
    if ($result.actual -like "*BUG-001*") { $bugId = "BUG-001" }
    elseif ($result.actual -like "*BUG-002*") { $bugId = "BUG-002" }
    elseif ($result.actual -like "*BUG-003*") { $bugId = "BUG-003" }

    $expectedActual = "Expected: $(ConvertTo-SafeMarkdown $result.expected) Actual: $(ConvertTo-SafeMarkdown $result.actual)"
    $comment = if ($result.status -eq "Pass") { "Kontrollen gick igenom." } else { "Kontrollen failade och behöver följas upp." }
    $resultLines += "| $($result.id) | $(ConvertTo-SafeMarkdown $result.title) | $($result.status) | $expectedActual | $bugId | $comment |"
}

$criticalProblems = @($results | Where-Object status -eq "Fail")
$resultLines += @(
    "",
    "## Sammanfattning",
    "",
    "- Totalt antal körda testfall: $total",
    "- Pass rate: $passRate%",
    "- Fail rate: $failRate%",
    "",
    "## Identifierade problem",
    ""
)

if ($criticalProblems.Count -eq 0) {
    $resultLines += "- Inga fail i denna körning."
}
else {
    foreach ($problem in $criticalProblems) {
        $resultLines += "- $($problem.id): $(ConvertTo-SafeMarkdown $problem.actual)"
    }
}

$resultLines | Set-Content -Path $mdPath -Encoding UTF8

$releaseDecision = if ($failed -eq 0) { "Go för de testade publika smoke- och regressionskontrollerna." } else { "No-Go för de kontroller som failar tills buggarna är rättade eller accepterade." }
$reportLines = @(
    "# Testrapport - Qlerify",
    "",
    "## 1. Sammanfattning",
    "",
    "- System/Projekt: Qlerify publika webb och app-ingångar",
    "- Testperiod: $RunDateIso",
    "- Vad testades: Startsida, prissida, inloggning, publikt arbetsflöde, blogg, artikel och kontaktsida.",
    "- Övergripande resultat: $passed pass, $failed fail, $blocked blocked av $total testfall.",
    "",
    "## 2. Test Scope",
    "",
    "| Ingick | Ingick inte |",
    "| --- | --- |",
    "| Publika HTTP-kontroller, smoke, regression och enkel UI-innehållskontroll. | Inloggade CRUD-flöden, betalning, databas, e-postleverans och riktiga konton. |",
    "",
    "## 3. Test Execution Summary",
    "",
    "| Totalt | Passed | Failed | Blocked | Ej körda |",
    "| ---: | ---: | ---: | ---: | ---: |",
    "| $total | $passed | $failed | $blocked | 0 |",
    "",
    "## 4. Defect Summary",
    "",
    "| Severity | Antal |",
    "| --- | ---: |",
    "| Critical | 0 |",
    "| High | 0 |",
    "| Medium | $failed |",
    "| Low | 0 |",
    "",
    "Kort analys: Fail betyder att en tidigare dokumenterad risk eller bugg fortfarande syns i publikt innehåll.",
    "",
    "## 5. Kvalitetsbedömning",
    "",
    "- Releasebeslut: $releaseDecision",
    "- Risker kvar: Publika UI-fel kan påverka förtroende, navigation och kontaktflöde.",
    "",
    "## 6. Avvikelser från testplan",
    "",
    "- Endast publika och säkra kontroller kördes.",
    "- Tester som kräver konto, databas eller interna behörigheter kördes inte.",
    "",
    "## 7. Rekommendationer",
    "",
    "- Rätta failade buggar och kör `qa/run-tests.ps1` igen.",
    "- Kör manuella tester i `qa/docs/MANUELLA_TESTER.md` när konto och testdata finns.",
    "",
    "## Godkännanden",
    "",
    "- QA ansvarig: Ali Reza Hezareh / tester är inte godkända om någon kontroll failar",
    "- Tech Lead: [Namn] / [Datum]",
    "- Produktansvarig: [Namn] / [Datum]"
)

$reportLines | Set-Content -Path $reportPath -Encoding UTF8

$html = @"
<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Qlerify QA-rapport</title>
  <style>
    :root { color-scheme: light; --bg: #f7f8fa; --text: #111827; --muted: #4b5563; --line: #d1d5db; --pass: #0f7b45; --fail: #b42318; --card: #ffffff; --accent: #1d4ed8; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    header { background: #111827; color: white; padding: 24px; }
    main { max-width: 1180px; margin: 0 auto; padding: 24px; }
    h1, h2 { margin: 0 0 12px; }
    h1 { font-size: 28px; }
    h2 { font-size: 20px; }
    a { color: var(--accent); }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 16px 0; }
    .card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 16px; }
    .metric { font-size: 30px; font-weight: 700; }
    .muted { color: var(--muted); }
    pre { white-space: pre-wrap; background: #0b1220; color: #e5e7eb; border-radius: 8px; padding: 14px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid var(--line); }
    th, td { border-bottom: 1px solid var(--line); padding: 10px; text-align: left; vertical-align: top; }
    th { background: #eef2f7; }
    .status-pass { color: var(--pass); font-weight: 700; }
    .status-fail { color: var(--fail); font-weight: 700; }
    .links { display: flex; gap: 10px; flex-wrap: wrap; }
    .links a { background: white; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; text-decoration: none; }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr 1fr; } main { padding: 14px; } table { font-size: 14px; } }
  </style>
</head>
<body>
  <header>
    <h1>Qlerify QA-rapport</h1>
    <div>Senaste körning: $RunDateIso</div>
  </header>
  <main>
    <section class="card">
      <h2>Kommandon</h2>
      <pre>cd "$RepoRoot"
git pull --ff-only origin main
.\qa\run-tests.ps1
git status --short
git add -- README.md qa
git commit -m "Uppdatera QA-tester och rapport"
git push origin main</pre>
    </section>

    <section class="grid">
      <div class="card"><div class="muted">Totalt</div><div class="metric">$total</div></div>
      <div class="card"><div class="muted">Pass</div><div class="metric status-pass">$passed</div></div>
      <div class="card"><div class="muted">Fail</div><div class="metric status-fail">$failed</div></div>
      <div class="card"><div class="muted">Pass rate</div><div class="metric">$passRate%</div></div>
    </section>

    <section class="card">
      <h2>Dokumentation</h2>
      <div class="links">
        <a href="results/latest-results.md">Testresultat</a>
        <a href="reports/test-summary.md">Testrapport</a>
        <a href="docs/MANUELLA_TESTER.md">Manuella tester</a>
        <a href="bugs/BUG-001.md">BUG-001</a>
        <a href="bugs/BUG-002.md">BUG-002</a>
        <a href="bugs/BUG-003.md">BUG-003</a>
      </div>
    </section>

    <section>
      <h2>Senaste automatiska kontroller</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Titel</th><th>Typ</th><th>Prio</th><th>Status</th><th>Faktiskt resultat</th></tr>
        </thead>
        <tbody>
"@

foreach ($result in $results) {
    $statusClass = if ($result.status -eq "Pass") { "status-pass" } else { "status-fail" }
    $actualHtml = [System.Net.WebUtility]::HtmlEncode($result.actual)
    $html += "          <tr><td>$($result.id)</td><td><a href=""$($result.url)"">$([System.Net.WebUtility]::HtmlEncode($result.title))</a></td><td>$($result.type)</td><td>$($result.priority)</td><td class=""$statusClass"">$($result.status)</td><td>$actualHtml</td></tr>`n"
}

$html += @"
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
"@

Set-Content -Path $IndexPath -Value $html -Encoding UTF8

Write-Host "QA-körning klar: $passed Pass, $failed Fail, $blocked Blocked av $total tester."
Write-Host "Resultat: $mdPath"
Write-Host "Testrapport: $reportPath"
Write-Host "Webbrapport: $IndexPath"

if (-not $NoOpen) {
    Start-Process $IndexPath
}

if ($failed -gt 0) {
    exit 1
}
