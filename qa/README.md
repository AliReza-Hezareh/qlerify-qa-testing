# QA kunskapsbibliotek

Det här är arbetsmappen för QA-material, testplanering, filregister, testscenarier och rapporter.

## Snabbstart i PowerShell

Kör kontrollen och öppna QA-sidan:

```powershell
.\qa\run-library-check.ps1
```

Öppna bara QA-sidan:

```powershell
Start-Process .\qa\index.html
```

Se status:

```powershell
Get-Content .\qa\STATUS.md
```

Se blockers:

```powershell
Get-Content .\qa\BLOCKERS.md
```

Se filregistret:

```powershell
Import-Csv .\qa\file-register.csv | Format-Table
```

## Viktiga filer

- `qa/PLAN.md` - plan och delmål.
- `qa/STATUS.md` - senaste status.
- `qa/BLOCKERS.md` - saker som stoppar arbetet.
- `qa/file-register.csv` - register över filer, status och checksumma.
- `qa/test-scenarios.md` - testscenarier från källmaterial.
- `qa/traceability-matrix.md` - koppling mellan krav, risk och testfall.
- `qa/index.html` - visuell QA-sida.
- `qa/reports/` - manuella testrapporter och buggrapporter.
- `qa/tests/` - automatiska Playwright-tester.
- `qa/playwright-report/` - HTML-rapport från senaste automatiska körningen.

## Automatiska Qlerify-tester

Testerna öppnar Qlerifys webb och gör bara kontroller. De skapar, ändrar eller tar inte bort data.

Första gången, installera testpaket och Chromium:

```powershell
Set-Location .\qa
npm install
npx playwright install chromium
```

Kör alla tester från repots rot. HTML-rapporten öppnas när körningen är klar:

```powershell
.\qa\run-tests.ps1
```

Kör bara testet för den publika inloggningsadressen:

```powershell
Set-Location .\qa
npm run test:public
```

Testet QW-001 är markerat som ett känt fel eftersom `qlerify.com/login` visade 404 den 2026-10-19. Det ska fortsätta upptäcka felet och larma om sidan oväntat börjar fungera; ta bort markeringen när buggen är rättad.

App-testet kräver en inloggningssession som testaren själv skapar. Lösenordet ska aldrig läggas i testkod eller skickas till någon. Skapa sessionen i ett separat Playwright-fönster och logga in själv:

```powershell
Set-Location .\qa
New-Item -ItemType Directory -Force .\.auth | Out-Null
npx playwright codegen --save-storage=.\.auth\user.json https://app.qlerify.com/login
```

Stäng Playwright-fönstret efter inloggningen. Sessionen sparas lokalt i `.auth` och mappen är ignorerad av Git. Kör därefter:

```powershell
$env:QA_STORAGE_STATE = (Resolve-Path .\.auth\user.json).Path
npm run test:app
```

Uppdatera HTML-rapporten separat:

```powershell
npm run report
```

App-testet läser det första synliga arbetsflödet från dashboarden. Det öppnar `Read Models`, laddar om sidan och kontrollerar att fliken är kvar och att ändringsknappen är inaktiverad.

## Mappstruktur

- `qa/library/01-original/` - lokal kopia av originalfiler. Ändra inte innehållet.
- `qa/library/02-extracted-text/` - extraherad text och OCR-resultat.
- `qa/library/03-summaries/` - sammanfattningar per ämne.
- `qa/library/04-index/` - sökindex, begrepp och källöversikt.
- `qa/library/05-test-scenarios/` - detaljerade testfall.
- `qa/library/06-reports/` - rapporter från QA-kunskapsbiblioteket.
- `qa/reports/` - rapporter från produkttester.

Playwright-dokumentation: [testkonfiguration](https://playwright.dev/docs/test-configuration), [inloggningssessioner](https://playwright.dev/docs/auth), [förväntade buggar](https://playwright.dev/docs/test-annotations).

## Git-flöde efter QA-ändring

Ta hem senaste kod från gruppen:

```powershell
git pull --rebase
```

Kontrollera att bara QA-filer är ändrade:

```powershell
git status --short
```

Lägg till QA-filer:

```powershell
git add qa
```

Committa med tydlig kommentar:

```powershell
git commit -m "docs: add QA knowledge library setup"
```

Pusha:

```powershell
git push
```

