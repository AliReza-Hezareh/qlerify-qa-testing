Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$qaRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataDir = Join-Path $qaRoot "data"
$aa = [char]0x00E5
$ae = [char]0x00E4
$oe = [char]0x00F6
$libraryDirs = @(
    "library\01-original",
    "library\02-extracted-text",
    "library\03-summaries",
    "library\04-index",
    "library\05-test-scenarios",
    "library\06-reports"
)

New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
foreach ($dir in $libraryDirs) {
    New-Item -ItemType Directory -Force -Path (Join-Path $qaRoot $dir) | Out-Null
}

$registerPath = Join-Path $qaRoot "file-register.csv"
if (-not (Test-Path -LiteralPath $registerPath)) {
    "source_id_or_url,source_path,local_path,file_type,size_bytes,modified_at,copy_status,read_status,sha256,notes" |
        Set-Content -LiteralPath $registerPath -Encoding UTF8
}

$rows = @()
try {
    $rows = Import-Csv -LiteralPath $registerPath
} catch {
    Write-Warning "Kunde inte läsa file-register.csv: $($_.Exception.Message)"
}

$totalFiles = @($rows | Where-Object { $_.source_path -or $_.local_path }).Count
$copiedFiles = @($rows | Where-Object { $_.copy_status -eq "copied" }).Count
$analyzedFiles = @($rows | Where-Object { $_.read_status -eq "analyzed" }).Count
$blockedFiles = @($rows | Where-Object {
    $_.copy_status -eq "blocked" -or $_.read_status -eq "blocked"
}).Count

$drive = Get-PSDrive -Name ((Get-Item -LiteralPath $qaRoot).PSDrive.Name)
$freeGb = [math]::Round($drive.Free / 1GB, 2)

$status = [ordered]@{
    generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    qaRoot = (Resolve-Path -LiteralPath $qaRoot).Path
    totalFiles = $totalFiles
    copiedFiles = $copiedFiles
    analyzedFiles = $analyzedFiles
    blockedFiles = $blockedFiles
    freeDiskGb = $freeGb
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText(
    (Join-Path $dataDir "status.json"),
    ($status | ConvertTo-Json -Depth 3),
    $utf8NoBom
)

$statusJs = "window.QA_STATUS = " + ($status | ConvertTo-Json -Depth 3) + ";"
[System.IO.File]::WriteAllText((Join-Path $dataDir "status.js"), $statusJs, $utf8NoBom)

$statusPath = Join-Path $qaRoot "STATUS.md"
$statusText = @"
# STATUS - QA kunskapsbibliotek

## Senast uppdaterad

$($status.generatedAt)

## Nuvarande l${ae}ge

Startstruktur ${ae}r skapad i ``qa``.

## R${ae}knare

| M${aa}tt | Antal |
|---|---:|
| Inventerade filer | $totalFiles |
| Kopierade filer | $copiedFiles |
| Analyserade filer | $analyzedFiles |
| Blockerade filer | $blockedFiles |
| Ledigt diskutrymme | $freeGb GB |

## Inte klart

- Teams-omfattning saknas om ``BLOCKERS.md`` fortfarande har ${oe}ppna blockers.
- K${ae}llbaserade testscenarier kr${ae}ver analyserat material.

## N${ae}sta exakta steg

Fyll i team, kanaler och lokal m${aa}lmapp. K${oe}r sedan:

````powershell
.\qa\run-library-check.ps1
````
"@

[System.IO.File]::WriteAllText($statusPath, $statusText, $utf8NoBom)

Start-Process (Join-Path $qaRoot "index.html")
Write-Host "QA-kontroll klar. Sidan oppnas fran qa\index.html"
