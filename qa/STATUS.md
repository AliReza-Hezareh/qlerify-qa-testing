# QA-status - Qlerify

Senast uppdaterad: 2026-10-19  
QA-ansvarig: Ali Reza Hezareh

## Testkörning

Automatiska tester ska köras efter att grenarna har sammanfogats. Resultatet ska dokumenteras här efter körningen.

## Känd observation

- QW-001: Den publika adressen `https://qlerify.com/login` visade en felsida vid manuell kontroll den 2026-10-19. Inloggningssidan fanns på `https://app.qlerify.com/login`.
- Reproduktion, förväntat resultat och faktiskt resultat finns i [den utforskande rapporten](reports/exploratory-qlerify-2026-10-19.md).

## Automatiska kontroller

- Publika smoke-tester finns i repots `tests`-mapp.
- QA-regressionstester finns i `qa/tests`.
- Det inloggade workflow-testet kräver att `QA_STORAGE_STATE` pekar på en lokal Playwright-session. Ingen session eller inloggningsuppgift sparas i repot.
- HTML-rapporterna skapas i `qa/evidence/playwright-report` och `qa/playwright-report`.

## Dokument

- [Testrapport](testrapport.md)
- [Testresultat](testresultat.md)
- [Testplan](testplan.md)
- [Testspecifikation](testspecifikation.md)
- [Spårbarhetsmatris](traceability-matrix.md)
- [Blockeringar](BLOCKERS.md)
- [Äldre QA-biblioteksstatus](STATUS-library.md)
