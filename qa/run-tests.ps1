param(
  [string]$Test = "smoke"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "Qlerify QA - black-box tester" -ForegroundColor Cyan
Write-Host "Repo: $RepoRoot"
Write-Host "Testtyp: $Test"

if (-not (Test-Path "node_modules")) {
  Write-Host "Installerar testberoenden..." -ForegroundColor Yellow
  npm install
}

Write-Host "Installerar/uppdaterar Playwright browser om den saknas..." -ForegroundColor Yellow
npx playwright install chromium

New-Item -ItemType Directory -Force -Path "qa\evidence" | Out-Null

if ($Test -eq "smoke") {
  npx playwright test tests/public-smoke.spec.js
} else {
  npx playwright test
}

$ExitCode = $LASTEXITCODE
node "qa\tools\update-report.mjs"
Start-Process "qa\index.html"
exit $ExitCode
