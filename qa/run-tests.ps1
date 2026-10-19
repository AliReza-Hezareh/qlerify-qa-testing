$ErrorActionPreference = 'Stop'

Push-Location $PSScriptRoot
try {
    npm test
    $testExitCode = $LASTEXITCODE

    $reportPath = Join-Path $PSScriptRoot 'playwright-report\index.html'
    if (Test-Path -LiteralPath $reportPath) {
        Start-Process -FilePath $reportPath
    }
    else {
        Start-Process -FilePath (Join-Path $PSScriptRoot 'index.html')
    }

}
finally {
    Pop-Location
}

exit $testExitCode
