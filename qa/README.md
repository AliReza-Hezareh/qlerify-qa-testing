# QA kunskapsbibliotek

Det här är arbetsmappen för QA-material, testplanering, filregister, testscenarier och rapporter.

## Snabbstart i PowerShell

Kör kontrollen och öppna QA-sidan:

```powershell
Set-Location "D:\LIA 2\code"
.\qa\run-library-check.ps1
```

Öppna bara QA-sidan:

```powershell
Set-Location "D:\LIA 2\code"
Start-Process .\qa\index.html
```

Se status:

```powershell
Set-Location "D:\LIA 2\code"
Get-Content .\qa\STATUS.md
```

Se blockers:

```powershell
Set-Location "D:\LIA 2\code"
Get-Content .\qa\BLOCKERS.md
```

Se filregistret:

```powershell
Set-Location "D:\LIA 2\code"
Import-Csv .\qa\file-register.csv | Format-Table
```

## Viktiga filer

- `qa/veckologg/README.md` - Google-dokument, kalkylark, veckologg och startprompt för en ny arbetsdag.
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
Set-Location "D:\LIA 2\code\qa"
npm install
npx playwright install chromium
```

Kör alla tester från repots rot. Efter körningen öppnas Playwright-rapporten och QA-översikten `qa/index.html`. Där finns länken till andra omgångens manuella rapport:

```powershell
Set-Location "D:\LIA 2\code"
.\qa\run-tests.ps1
```

Kör bara testet för den publika inloggningsadressen:

```powershell
Set-Location "D:\LIA 2\code\qa"
npm run test:public
```

Testet QW-001 är markerat som ett känt fel eftersom `qlerify.com/login` visade 404 den 2026-10-19. Det ska fortsätta upptäcka felet och larma om sidan oväntat börjar fungera; ta bort markeringen när buggen är rättad.

App-testet kräver en inloggningssession som testaren själv skapar. Lösenordet ska aldrig läggas i testkod eller skickas till någon. Skapa sessionen i ett separat Playwright-fönster och logga in själv:

```powershell
Set-Location "D:\LIA 2\code\qa"
New-Item -ItemType Directory -Force .\.auth | Out-Null
npx playwright codegen --save-storage=.\.auth\user.json https://app.qlerify.com/login
```

Stäng Playwright-fönstret efter inloggningen. Sessionen sparas lokalt i `.auth` och mappen är ignorerad av Git. Kör därefter:

```powershell
Set-Location "D:\LIA 2\code\qa"
$env:QA_STORAGE_STATE = (Resolve-Path .\.auth\user.json).Path
npm run test:app
```

Öppna QA-svitens befintliga Playwright-rapport från repots rot:

```powershell
Set-Location "D:\LIA 2\code"
npm --prefix .\qa run report
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

Kontrollera först vilka filer som har ändrats:

```powershell
Set-Location "D:\LIA 2\code"
git status --short
git diff --stat
```

Lägg till de QA-filer som ska ingå och kontrollera urvalet:

```powershell
git add qa
git diff --cached --stat
```

Committa med en kommentar som beskriver teständringen:

```powershell
git commit -m "qa: update test results and bug reports"
```

Ta in gruppens senaste ändringar efter att de lokala QA-ändringarna har committats:

```powershell
git pull --rebase
```

Pusha och kontrollera att grenen är uppdaterad:

```powershell
git push
git status --short --branch
```

Vid en konflikt ska konflikten lösas och granskas innan push. Kommandona använder ingen force-push.

## Utforskande appgranskning 2026-10-19 – två omgångar

Aktuell rapport är [andra testomgången](reports/exploratory-app-2026-10-19-round2.md). Den visuella versionen finns i [andra omgångens HTML-rapport](reports/exploratory-app-2026-10-19-round2.html). Den [första omgångens Markdown-rapport](reports/exploratory-app-2026-10-19.md) och [HTML-rapport](reports/exploratory-app-2026-10-19.html) finns kvar. Båda omgångarna länkas från `qa/index.html`.

`qa/run-tests.ps1` bygger HTML från samtliga befintliga `qa/reports/exploratory-app-*.md`. Därefter öppnas Playwright-rapporten och QA-översikten, där länken till andra omgången finns. Den manuella rapporten öppnas med länken eller kommandot nedan. Äldre automatiska testresultat visas som separata rapporter. Rapportgenerering innebär ingen ny testkörning.

Uppdatera den visuella rapporten efter en dokumentändring och öppna den, utan att köra testerna igen:

```powershell
Set-Location "D:\LIA 2\code"
node .\qa\tools\render-exploratory-report.mjs --report exploratory-app-2026-10-19-round2
Start-Process .\qa\reports\exploratory-app-2026-10-19-round2.html
```

`--report` tar rapportens basnamn, utan mapp eller `.md`. Bara bokstäver A–Z, siffror och bindestreck tillåts. Utan `--report` används `exploratory-app-2026-10-19`, den första omgången. Filen måste finnas i `qa/reports/`.

Första omgångens bevis finns i `qa/evidence/exploratory-2026-10-19/`. Varje rapport länkar till sina egna bevis. Den första omgångens exportfil ligger lokalt i Downloads; dess rapportpaket innehåller bara format och kontrollsumma. Ingen videoinspelning gjordes under den första omgången.

För att bygga om rapporten automatiskt medan Markdown-filen redigeras, kör bevakningen från repots rot:

```powershell
Set-Location "D:\LIA 2\code"
node .\qa\tools\render-exploratory-report.mjs --report exploratory-app-2026-10-19-round2 --watch
```

I bevakningsläget bevakas bara den valda Markdown-filen. HTML-filen uppdateras vid ändring och den öppna rapporten laddas om var åttonde sekund. Stoppa bevakningen med Ctrl+C. Kör samma kommando utan `--watch` om automatisk omladdning ska tas bort.
