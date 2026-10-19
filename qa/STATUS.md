# QA-status – Qlerify

Senast uppdaterad: 2026-10-19  
QA-ansvarig: Ali Reza Hezareh – testerna är inte godkända.

## Senaste utforskande appgranskning

- 49 dokumenterade kontrollpunkter: 42 körda, 3 Blocked och 4 Ej körda.
- 37 Pass och 5 Fail bland de körda kontrollerna.
- Fyra nya avvikelser: blanksteg som arbetsflödesnamn, överlappande verktygsfält på smal skärm, trasig villkorslänk från händelsedetalj och ikonknappar utan tillgängliga namn.
- QW-001, den publika inloggningsadressens felsida, reproducerades igen.
- QA-arbetsflödet finns kvar i In Progress med syntetiska testdata.
- [Testrapport och detaljerade resultat](reports/exploratory-app-2026-10-19.md).
- [Visuell appgranskning](reports/exploratory-app-2026-10-19.html).

## Automatiska tester

Det publika QA-testet kördes tidigare den 2026-10-19. QW-001 återkom som ett förväntat fel. Playwrights gröna körningsstatus innebär därför inte att den sidan fungerade.

Hela den automatiska testsviten kördes inte i den utforskande appgranskningen. Äldre automatiska sammanfattningar är separata underlag och får inte läsas som resultat från den senaste manuella sessionen.

- Publika smoke-tester: `tests/`.
- QA-regressionstester: `qa/tests/`.
- App-testet kräver att `QA_STORAGE_STATE` pekar på en session som testaren har skapat lokalt.
- Automatiska HTML-rapporter: `qa/evidence/playwright-report/` och `qa/playwright-report/`.
- Den visuella appgranskningen skapas från sin Markdown-fil när `qa/run-tests.ps1` körs. Det ändrar inte de manuella resultaten.

## Övriga underlag

- [Tidigare utforskande rapport 2026-10-19](reports/exploratory-qlerify-2026-10-19.md)
- [Tidigare automatisk testrapport](testrapport.md)
- [Tidigare automatiska testresultat](testresultat.md)
- [Testplan](testplan.md)
- [Testspecifikation](testspecifikation.md)
- [Spårbarhetsmatris](traceability-matrix.md)
- [Blockeringar](BLOCKERS.md)