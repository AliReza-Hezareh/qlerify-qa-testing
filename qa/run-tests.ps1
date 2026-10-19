$ErrorActionPreference = 'Continue'

$repoRoot = Split-Path -Parent $PSScriptRoot
$results = [System.Collections.Generic.List[int]]::new()

Write-Host 'Qlerify QA: running public smoke tests and QA regression tests.' -ForegroundColor Cyan

Push-Location $repoRoot
try {
    npm test
    $results.Add($LASTEXITCODE)
}
finally {
    Pop-Location
}

Push-Location $PSScriptRoot
try {
    npm test
    $results.Add($LASTEXITCODE)

    $manualReportRenderer = Join-Path $PSScriptRoot 'tools\render-exploratory-report.mjs'
    try {
        if (-not (Test-Path -LiteralPath $manualReportRenderer)) {
            throw "Rapportverktyget saknas: $manualReportRenderer"
        }
        & node $manualReportRenderer
        if ($LASTEXITCODE -ne 0) {
            throw 'Den manuella HTML-rapporten kunde inte uppdateras. Kontrollera Markdown-rapporten och felmeddelandet ovan.'
        }
    }
    catch {
        Write-Warning $_.Exception.Message
        $results.Add(1)
    }

    $reportPath = Join-Path $PSScriptRoot 'playwright-report\index.html'
    if (Test-Path -LiteralPath $reportPath) {
        Start-Process -FilePath $reportPath
    }
}
finally {
    Pop-Location
}

Start-Process -FilePath (Join-Path $PSScriptRoot 'index.html')

if ($results | Where-Object { $_ -ne 0 }) {
    exit 1
}
exit 0
