# Qlerify QA

Testfall och resultat för Qlerifys webbplats och app.

## Kör tester

Kör i PowerShell från repots rot:

```powershell
cd "C:\Users\Ali Reza\Documents\qlerify-qa-testing"
git pull --ff-only origin main
.\qa\run-tests.ps1
```

Efter körningen öppnas rapporten automatiskt:

- Visuell rapport: [qa/index.html](qa/index.html)
- Senaste testresultat: [qa/results/latest-results.md](qa/results/latest-results.md)
- Senaste testrapport: [qa/reports/test-summary.md](qa/reports/test-summary.md)

Om rapporten inte ska öppnas automatiskt:

```powershell
.\qa\run-tests.ps1 -NoOpen
```

## Dokumentation

- [Manuella tester, resultat och planerade testfall](qa/docs/MANUELLA_TESTER.md)
- [Automatiska testresultat](qa/results/latest-results.md)
- [Testrapport](qa/reports/test-summary.md)
- Buggrapporter och skärmbilder: [BUG-001](qa/bugs/BUG-001.md), [BUG-002](qa/bugs/BUG-002.md), [BUG-003](qa/bugs/BUG-003.md)

## Öppna testmiljön

Kör i PowerShell:

```powershell
cd "C:\Users\Ali Reza\Documents\qlerify-qa-testing"
Start-Process "https://www.qlerify.com/"
code ".\qa\docs\MANUELLA_TESTER.md"
```

Skriv endast testdata i formulären. Använd inte riktiga lösenord eller personuppgifter i testfallen.

## Uppdatera repot

Hämta gruppens senaste ändringar innan du börjar, och lägg bara till README och QA-filer när du är klar:

```powershell
git pull --ff-only origin main
.\qa\run-tests.ps1 -NoOpen
git status --short
git add -- README.md qa
git diff --cached --name-only
git commit -m "Uppdatera QA-tester och rapport"
git push origin main
```

Om `git status --short` visar ändringar utanför `README.md` och `qa`, lägg inte till dem. De ska inte gå upp i repot från QA-arbetet.
