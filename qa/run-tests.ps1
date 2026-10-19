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
