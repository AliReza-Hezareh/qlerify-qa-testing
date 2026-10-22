# QA-status – Qlerify

Senast uppdaterad: 2026-10-22

QA-ansvarig: Ali Reza Hezareh – testerna är inte godkända.

## Dokumentationsarbete 2026-10-22

- Tidigare testresultat sammanställdes för veckologg och senare rapportarbete. Inga nya produkttester eller omtester genomfördes i denna sammanställning.
- Google-dokument, kalkylark, lokal arkivkopia och startprompt finns länkade i [veckologgens läsanvisning](veckologg/README.md).
- Testdatumen 2026-10-19 och de två omgångarnas resultat är bevarade. Uppladdningen R2-041 är fortfarande Blocked; inget manuellt resultat har rapporterats.
- Aktivt QA-repo är `D:\LIA 2\code`. En äldre Gitrot finns kvar i `D:\LIA 2`; ingen rensning av den ingick i dokumentationsarbetet.

## Senaste utforskande appgranskning – andra omgången

- Nytt arbetsflöde: QA 2026-10-19 – flöden och edge cases 2.
- 48 dokumenterade kontrollpunkter: 39 körda, 5 Blocked och 4 Ej körda.
- 37 Pass och 2 Fail bland de körda kontrollerna.
- APP-005, Medium: namnändring direkt följd av Add lane ger konflikt och tappar den nya banan. Reproducerat två gånger.
- APP-006, Low: CSV-förhandsvisningen slår ihop två textrader utan mellanrum. Den nedladdade filen kunde inte verifieras.
- Releaser, filter, duplicering, Done/Reopen, sökning, fältmetadata, relationer, läsmodell, domänhändelse och Ångra/Gör om kontrollerades.
- Filuppladdning, rollbehörigheter, negativa API-anrop och last har inget godkänt resultat.
- Bilagetestet godkändes den 2026-10-19, men webbläsarverktygets säkerhetskontroll stoppade filåtkomsten. Testfilerna finns i `qa/fixtures/attachments/`. Ingen fil laddades upp och R2-041 är fortfarande Blocked.
- [Andra omgångens rapport och detaljerade resultat](reports/exploratory-app-2026-10-19-round2.md).
- [Andra omgångens visuella rapport](reports/exploratory-app-2026-10-19-round2.html).

## Första utforskande appgranskningen

- 49 dokumenterade kontrollpunkter: 42 körda, 3 Blocked och 4 Ej körda.
- 37 Pass och 5 Fail bland de körda kontrollerna.
- Fyra nya avvikelser vid första omgången: blanksteg som arbetsflödesnamn, överlappande verktygsfält på smal skärm, trasig villkorslänk från händelsedetalj och ikonknappar utan tillgängliga namn.
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
- De visuella appgranskningarna skapas från sina Markdown-filer när `qa/run-tests.ps1` körs. Det ändrar inte de manuella resultaten. `--report` väljer omgång och `--watch` bygger om den valda rapporten när Markdown-filen sparas. Kommandon finns i `qa/README.md` och överst på `qa/index.html`.

## Övriga underlag

- [Tidigare utforskande rapport 2026-10-19](reports/exploratory-qlerify-2026-10-19.md)
- [Tidigare automatisk testrapport](testrapport.md)
- [Tidigare automatiska testresultat](testresultat.md)
- [Testplan](testplan.md)
- [Testspecifikation](testspecifikation.md)
- [Spårbarhetsmatris](traceability-matrix.md)
- [Blockeringar](BLOCKERS.md)
