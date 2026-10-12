# Testplan - Qlerify black-box smoke

## 1. Testplan-ID
QFY-BB-SMOKE-001

## 2. Introduktion
Syftet är att kontrollera att viktiga publika Qlerify-sidor laddar och att enkla formulärvalideringar fungerar.

Målet är att hitta tydliga fel snabbt innan djupare tester körs.

## 3. Testobjekt
- Publik webb: `https://www.qlerify.com/`
- Pricing: `https://www.qlerify.com/pricing`
- Contact: `https://www.qlerify.com/contact`
- Blog: `https://www.qlerify.com/blog`
- Login: `https://app.qlerify.com/login`
- Signup: `https://app.qlerify.com/signup`
- Reset password: `https://app.qlerify.com/reset-password`

## 4. Funktioner som ska testas
- Sidors laddning
- Synligt innehåll
- Pricing monthly/yearly
- Kontaktformulär
- Login-validering
- Signup-validering
- Reset password-validering

## 5. Funktioner som inte ska testas
- Inloggat läge
- Betalning
- Adminflöden
- Backend-databas
- Kodnivåtester

## 6. Teststrategi
- Smoke tests körs först.
- Negativa formulärtester körs på login, signup, reset password och contact.
- Kontaktformuläret testas med tomma fält, fel e-post, lång text och specialtecken.
- Playwright används för browser-baserade tester.

## 7. Testmiljö
- OS: Windows
- Browser: Chromium via Playwright
- Miljö: Publik live-webb
- Körning: PowerShell

## 8. Testdatahantering
Testdata är syntetisk och innehåller ingen riktig persondata.

## 9. Entry Criteria
- Internet fungerar.
- Node.js och npm finns installerat.
- Qlerify publika sidor är nåbara.

## 10. Exit Criteria
- Alla smoke tests är körda.
- Resultat finns i `qa/testresultat.md`.
- Visuell rapport finns i `qa/index.html`.
- Failures är dokumenterade som buggar.

## 11. Pass/Fail kriterier
Pass betyder att sidan laddar, rätt innehåll syns och validering fungerar.
Fail betyder att sidan kraschar, saknar kritiskt innehåll eller inte stoppar fel input.

## 12. Testleverabler
- `tests/public-smoke.spec.js`
- `qa/testresultat.md`
- `qa/testspecifikation.md`
- `qa/buggrapporter.md`
- `qa/index.html`

## 13. Testaktiviteter
1. Kör smoke tests.
2. Kontrollera resultat.
3. Dokumentera buggar.
4. Uppdatera QA-dashboard.

## 14. Tidsplan
- Steg 1: Publika smoke tests
- Steg 2: Kontaktformulär edge cases
- Steg 3: Auth negativa tester
- Steg 4: Rapportering

## 15. Roller och ansvar
- QA ansvarig: Ali Reza Hezareh / tester är inte godkända
- Tech Lead: Ej satt
- Produktansvarig: Ej satt

## 16. Defekthantering
Severity:
- Critical: blockerar viktig funktion eller säkerhetsrisk
- High: viktig funktion fungerar inte
- Medium: delvis fel eller tydlig UX-risk
- Low: mindre visuellt eller textmässigt fel

Workflow:
1. Dokumentera buggen i `qa/buggrapporter.md`.
2. Lägg till steg, expected, actual och bevis.
3. Koppla buggen till test-ID.

## 17. Riskanalys
- Publika sidor kan ändras utan att testerna uppdateras.
- Tredjeparts-script kan göra tester instabila.
- Live-miljö kan ge nätverksfel som inte är produktfel.

## 18. Antaganden och begränsningar
- Testerna körs black-box utan kodåtkomst.
- Bara publika sidor testas i första steget.
- Ingen riktig användardata används.

## 19. Godkännanden
Tester är inte godkända förrän smoke tests har körts och alla kritiska tester är Pass.
