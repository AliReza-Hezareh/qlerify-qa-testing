# Qlerify QA Testrepo

Det här repot innehåller black-box tester och QA-dokumentation för Qlerify.

## Viktiga kommandon

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

## Var finns rapporterna?

- Visuell rapport: `qa/index.html`
- Testresultat: `qa/testresultat.md`
- Testrapport: `qa/testrapport.md`
- Testplan: `qa/testplan.md`
- Testspecifikation: `qa/testspecifikation.md`
- Buggrapporter: `qa/buggrapporter.md`
- Manuell organisationstestning: `qa/manual-exploratory-organisation.md`
- Screenshots och Playwright-data: `test-results/` och `qa/evidence/`

## Nuvarande status

Senaste körning:

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

## Git-flöde

Kontrollera status:

```powershell
git status
```

Ta bara med QA/test-filer:

```powershell
git add .gitignore README.md package.json package-lock.json playwright.config.js tests qa Qlerify-Testagent-Plan.md
git commit -m "Lägg till black-box QA testrepo för Qlerify"
```

Hämta senaste kod innan ny ändring när remote finns:

```powershell
git pull --rebase origin master
```

Pusha när remote finns:

```powershell
git push origin master
```
