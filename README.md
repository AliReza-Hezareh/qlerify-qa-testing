# Qlerify QA Testrepo

Det här repot innehåller black-box tester, manuella tester, testresultat och buggrapporter för Qlerify. Repot innehåller ingen produktkod.

Aktiv arbetsmapp: `D:\LIA 2\code`.

## Förutsättningar

| Svit | Mapp | Krävs |
|---|---|---|
| Publika smoke-tester | `tests/` | Node.js, `npm install` i roten och Chromium (`npx playwright install chromium`) |
| Publikt QA-regressionstest | `qa/tests/qlerify-public.spec.ts` | `npm install` i `qa/` |
| Inloggat apptest | `qa/tests/qlerify-authenticated.spec.ts` | `QA_STORAGE_STATE` som pekar på en lokal inloggad session. Utan den hoppas testet över. |

Installera första gången:

```powershell
cd "D:\LIA 2\code"
npm install
npx playwright install chromium
cd .\qa
npm install
```

## Köra tester

Kör alla sviter, bygg om de manuella HTML-rapporterna och öppna rapportöversikten:

```powershell
cd "D:\LIA 2\code"
.\qa\run-tests.ps1
```

`qa/run-tests.ps1` kör först de publika smoke-testerna i roten och sedan `qa/tests/`. Därefter bygger skriptet om `qa/reports/exploratory-app-*.html` från Markdown-filerna och öppnar Playwright-rapporten och `qa/index.html`.

Kör bara de publika smoke-testerna:

```powershell
cd "D:\LIA 2\code"
npx playwright test
```

Kör bara det inloggade apptestet:

```powershell
cd "D:\LIA 2\code\qa"
$env:QA_STORAGE_STATE = "D:\LIA 2\code\qa\.auth\state.json"
npm run test:app
```

`qa/.auth/` är ignorerad i Git. Sessionsfilen ska aldrig committas.

Öppna rapportöversikten:

```powershell
Start-Process "D:\LIA 2\code\qa\index.html"
```

## Nuvarande status

Senaste publika helkörning: 2026-10-24 (`qa/evidence/playwright-results.json`).

| Totalt | Pass | Fail | Blocked | Ej körda | Pass rate |
|---|---|---|---|---|---|
| 38 | 32 | 6 | 0 | 0 | 84 % |

Pass rate = 32 / (32 + 6) × 100 = 84,2 %.

De sex Fail motsvarar tre unika produktfel. Varje fel syns i både desktop- och mobilprojektet:

| Bugg-ID | Fel | Severity | Status |
|---|---|---|---|
| BUG-WEB-005 | Pricing har horisontell sidscroll (1383 px innehåll vid 1366 px, 897 px vid 393 px) | Medium | Öppen |
| BUG-CONTACT-002 | Telefonnumret på kontaktsidan länkar till `#` i stället för `tel:` | Medium | Öppen |
| BUG-WEB-004 | Bloggen saknar `<footer>` eller `role="contentinfo"` | Low | Öppen |

Fel från utforskande testning i appen: APP-004, APP-005, APP-006 och QW-001. Se `qa/STATUS.md`.

Övrigt:

- BUG-CONTACT-001 är stängd som testfel. Formuläret ligger i en HubSpot-iframe och testerna fick Pass efter selektorfix 2026-10-24.
- BUG-AUTH-002 fick Pass i körningen 2026-10-24 men står kvar som öppen tills manuell verifiering är gjord.
- QW-001 är markerat med `test.fail` i `qa/tests/qlerify-public.spec.ts`. Grön status där betyder att felet fortfarande finns.
- Bilagetestet och CSV-nedladdningen är Blocked.

Testerna är inte godkända.

## Dokumentation

| Underlag | Fil |
|---|---|
| Rapportöversikt | `qa/index.html` |
| Senaste status | `qa/STATUS.md` |
| Testplan | `qa/testplan.md` |
| Testspecifikation | `qa/testspecifikation.md` |
| Testresultat | `qa/testresultat.md` |
| Testrapport | `qa/testrapport.md` |
| Buggrapporter | `qa/buggrapporter.md`, `qa/bugs/` |
| Utforskande appgranskningar | `qa/reports/exploratory-app-*.md` och `.html` |
| Dag- och veckologg | `qa/veckologg/` |
| Bevis (skärmbilder, loggar, Playwright-data) | `qa/evidence/` |
| Kunskapsbiblioteket och dess blockers | `qa/README.md`, `qa/BLOCKERS.md` |

Rapporterna uppdateras efter varje fullständig testkörning. De manuella HTML-rapporterna byggs om från Markdown när `qa/run-tests.ps1` körs.

Öppna buggrapporter och bevis:

```powershell
cd "D:\LIA 2\code"
code .\qa\buggrapporter.md
Invoke-Item .\qa\evidence
```

## Viktig regel för testdata

Skriv endast syntetiska testdata i formulären. Använd inte riktiga lösenord eller personuppgifter.

## Git

Hämta senaste ändringar och kontrollera branch:

```powershell
cd "D:\LIA 2\code"
git fetch origin
git status -sb
```

Granska och lägg bara till QA-filer:

```powershell
git diff
git add -- README.md qa tests
git diff --cached --name-only
```

Commit och push till den branch du arbetar på:

```powershell
git commit -m "qa: <kort beskrivning>"
git push -u origin <branch>
```
