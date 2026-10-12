# Qlerify QA Testrepo

Det här repot innehåller black-box tester, manuella tester, testresultat och buggrapporter för Qlerify.

## Viktiga kommandon

Öppna repot i VS Code:

```powershell
cd "D:\LIA 2"
code .
```

Kör alla smoke tests och öppna rapporten automatiskt:

```powershell
cd "D:\LIA 2"
.\qa\run-tests.ps1
```

Kör bara Playwright smoke tests:

```powershell
cd "D:\LIA 2"
npm run test:smoke
```

Uppdatera rapporten från senaste testkörning:

```powershell
cd "D:\LIA 2"
npm run report
```

Öppna visuell rapport:

```powershell
Start-Process "D:\LIA 2\qa\index.html"
```

Öppna Qlerify för manuell testning:

```powershell
Start-Process "https://app.qlerify.com/login"
```

## Dokumentation

- Visuell rapport: `qa/index.html`
- Testresultat: `qa/testresultat.md`
- Testrapport: `qa/testrapport.md`
- Testplan: `qa/testplan.md`
- Testspecifikation: `qa/testspecifikation.md`
- Buggrapporter: `qa/buggrapporter.md`
- Manuell organisationstestning: `qa/manual-exploratory-organisation.md`
- Manuella tester från tidigare repo: `qa/docs/MANUELLA_TESTER.md`
- Buggrapporter och skärmbilder från tidigare repo: `qa/bugs/BUG-001.md`, `qa/bugs/BUG-002.md`, `qa/bugs/BUG-003.md`
- Screenshots och Playwright-data: `test-results/` och `qa/evidence/`

## Nuvarande status

Senaste automatiska körning:

- 36 tester körda
- 21 Pass
- 15 Fail
- Pass rate: 58%

Viktigaste fynd:

- Kontaktformuläret på publika kontaktsidan är inte interaktivt i browser-test.
- Telefonnummer saknar verifierad `tel:`-länk.
- Bloggsidan saknar verifierad footer/contentinfo-landmark.
- Signup med ogiltig e-post failar på mobile Chrome och behöver manuell verifiering.

## Vad testas först?

Publika smoke tests:

- `WEB-001` Startsida laddar
- `WEB-002` Pricing laddar och monthly/yearly kontrolleras
- `WEB-003` Contact laddar och formulär kontrolleras
- `WEB-004` Blog laddar och footer kontrolleras
- `AUTH-001` Login med tomma fält
- `AUTH-002` Signup med ogiltig e-post
- `AUTH-003` Reset password med tom e-post

Nästa manuella test:

- skapa egen organisation i Qlerify
- dokumentera var flödet är otydligt
- dokumentera var användaren fastnar

## Viktig regel för testdata

Skriv endast testdata i formulären. Använd inte riktiga lösenord eller personuppgifter i testfallen.

## Uppdatera repot

Hämta senaste ändringar innan du börjar:

```powershell
cd "D:\LIA 2"
git pull --ff-only origin main
```

Kontrollera ändringar:

```powershell
git status --short
```

Lägg bara till QA/test-filer:

```powershell
git add -- README.md qa tests package.json package-lock.json playwright.config.js .gitignore Qlerify-Testagent-Plan.md
```

Kontrollera vad som ska committas:

```powershell
git diff --cached --name-only
```

Commit och push:

```powershell
git commit -m "Uppdatera Qlerify QA-tester och rapporter"
git push origin main
```
