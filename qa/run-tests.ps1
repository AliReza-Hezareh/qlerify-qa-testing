param(
    [ValidateSet('All', 'Workflow', 'Overview')]
    [string]$Suite = 'All',
    [string]$Workspace,
    [switch]$NoOpen
)

if ($Suite -ne 'All') {
    $ErrorActionPreference = 'Stop'
    if (-not $Workspace -or -not (Test-Path -LiteralPath $Workspace -PathType Container)) {
        throw 'Ange -Workspace med sökvägen till det lokala arbetsunderlaget.'
    }
    $workflowWorkspace = (Resolve-Path -LiteralPath $Workspace).Path
    $workflowReports = [IO.Directory]::CreateDirectory((Join-Path $workflowWorkspace 'reports'))
    $workflowLock = [IO.File]::Open(
        (Join-Path $workflowReports.FullName '.workflow-run.lock'),
        [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None
    )
    try {
        $workflowRenderer = Join-Path $PSScriptRoot 'tools\workflow-report.mjs'
        $workflowTestExit = 0
        if ($Suite -eq 'Workflow') {
            $workflowTimestamp = [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ')
            $workflowSuffix = [guid]::NewGuid().ToString('N').Substring(0, 8)
            $workflowRunId = "RUN-$workflowTimestamp-PW-$workflowSuffix"
            Write-Host "Körnings-ID $workflowRunId"
            $workflowPreviousId = $env:QA_RUN_ID
            Push-Location $PSScriptRoot
            try {
                $env:QA_RUN_ID = $workflowRunId
                npm run test:workflow
                $workflowTestExit = $LASTEXITCODE
            }
            finally {
                $env:QA_RUN_ID = $workflowPreviousId
                Pop-Location
            }
            node $workflowRenderer $workflowWorkspace $workflowRunId
        }
        else {
            node $workflowRenderer $workflowWorkspace
        }
        $workflowReportExit = $LASTEXITCODE
        if ($workflowReportExit -in 0, 2 -and -not $NoOpen) {
            Start-Process -FilePath (Join-Path $workflowWorkspace 'qa\index.html')
        }
        if ($workflowReportExit -ne 0) { exit $workflowReportExit }
        exit $workflowTestExit
    }
    finally {
        $workflowLock.Dispose()
    }
}

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
