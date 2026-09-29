# Qlerify QA

Testfall och resultat för Qlerifys webbplats och app.

## Dokumentation

- [Manuella tester, resultat och planerade testfall](qa/docs/MANUELLA_TESTER.md)
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
git status --short
git add -- README.md qa
git diff --cached --name-only
git commit -m "Uppdatera manuella QA-tester"
git push origin main
```
