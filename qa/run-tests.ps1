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
        $manualReports = @(Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'reports') -Filter 'exploratory-app-*.md' -File -ErrorAction Stop | Sort-Object Name)
        if ($manualReports.Count -eq 0) {
            throw 'Ingen manuell apprapport hittades i qa/reports med namnet exploratory-app-*.md.'
        }
        foreach ($manualReport in $manualReports) {
            try {
                & node $manualReportRenderer --report $manualReport.BaseName
                if ($LASTEXITCODE -ne 0) {
                    throw "HTML-rapporten för $($manualReport.Name) kunde inte uppdateras. Kontrollera Markdown-filen och felmeddelandet ovan."
                }
            }
            catch {
                Write-Warning $_.Exception.Message
                $results.Add(1)
            }
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
