# Teststatus - Qlerify QA

Datum: 2026-10-12
QA ansvarig: Ali Reza Hezareh

## Verifierade resultat
- Publika smoke tests har körts med Playwright.
- 36 tester kördes.
- 21 tester passade.
- 15 tester failade.
- Rapport finns i `qa/index.html` och `qa/testresultat.md`.

## Viktiga fynd
- Kontaktformuläret på `https://www.qlerify.com/contact` är inte interaktivt i browser-test. Fälten finns i DOM men är dolda.
- Telefonnummer på kontaktsidan saknar verifierad `tel:`-länk.
- Bloggsidan saknar verifierad footer/contentinfo-landmark.
- Signup med ogiltig e-post failade på mobile Chrome i senaste körningen.

## Planerade tester
- Manuell utforskande testning efter login.
- Skapa egen organisation i Qlerify.
- Dokumentera var flödet är svårt att förstå.
- Gå igenom Google Drive-mappen `Introduction` när tid finns.

## Ej bekräftat
- GitHub-åtkomst.
- Lokal testmiljö.
- Separat testmiljö.
- API-dokumentation.
- Kravlista.
