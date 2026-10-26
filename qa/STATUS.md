# QA-status – Qlerify

Senast uppdaterad: 2026-10-26

QA-ansvarig: Ali Reza Hezareh – testerna är inte godkända.

## Dokumentation och APP-005-omtest 2026-10-26

- [APP-005-omtestrapport](reports/exploratory-app-2026-10-26-app-005-retest.md), [visuell rapport](reports/exploratory-app-2026-10-26-app-005-retest.html), [daglogg](veckologg/daglogg-2026-10-26.md) och [veckologg](veckologg/veckologg-2026-V44.md).

- Bilagerapport, bevislogg och QA-sammanfattningar förtydligades: vilken fil som skulle bifogas, på vilket kort, vad som först rapporterades och vad den senare kontrollen visade.
- Bilagetestet från 24 oktober är fortfarande Blocked och kördes inte om i dag. Inget nytt produktfel bekräftades.
- APP-005 omtestades i ett separat QA-arbetsflöde. Två snabba namnändringar följda direkt av Add lane skapade Lane 2 och Lane 3; båda fanns kvar efter omladdning. Felet reproducerades inte i dessa två försök men står kvar som historiskt öppet.

## QA-arbete 2026-10-24

- Slutlig publik helkörning efter korrigerad iframe-selektor och nytt layouttest: 38 tester, 32 Pass och 6 Fail.
- BUG-WEB-004 och BUG-CONTACT-002 reproducerades på desktop och mobil.
- Nytt layouttest bekräftade BUG-WEB-005: Pricing var 1383 px bred vid 1366 px och 897 px bred vid 393 px.
- Kontaktformulärets tidigare 12 Fail var testfel. Det synliga formuläret ligger i en HubSpot-iframe och testerna fick Pass efter selektorfix.
- APP-004 och APP-006 observerades igen i den inloggade appen. Backlog-sökning, omladdning samt bakåt/framåt fick Pass.
- Bilagetest: qa-åäö.txt (28 byte) skulle bifogas på **QA R1 – Skapa order ÅÄÖ 🧪**. Testaren rapporterade först att filnamnet syntes efter omladdning och att filen öppnades korrekt. Senare syntes filen inte på kortet; bara den äldre länken visades. Resultatet är Blocked: sparandet och öppningen är inte verifierade. Filväljarens filter listar inte .txt, men serverstödet är okänt.
- CSV-förhandsvisningen reproducerade APP-006. Faktisk CSV-nedladdning är fortfarande Blocked/oklar i sidowebbläsaren.
- [Dagens logg](veckologg/daglogg-2026-10-24.md), [bilagerapport](reports/exploratory-app-2026-10-24-attachment-retest.md) och [visuell bilagerapport](reports/exploratory-app-2026-10-24-attachment-retest.html).

## Dokumentationsarbete 2026-10-22

- Tidigare testresultat sammanställdes för veckologg och senare rapportarbete. Inga nya produkttester eller omtester genomfördes i denna sammanställning.
- Google-dokument, kalkylark, lokal arkivkopia och startprompt finns länkade i [veckologgens läsanvisning](veckologg/README.md).
- Testdatumen 2026-10-19 och de två omgångarnas resultat är bevarade. Bilagetestet fortsatte separat den 24 oktober men blev inte godkänt.
- Aktivt QA-repo är `D:\LIA 2\code`. En äldre Gitrot finns kvar i `D:\LIA 2`; ingen rensning av den ingick i dokumentationsarbetet.

## Senaste utforskande appgranskning – andra omgången

- Nytt arbetsflöde: QA 2026-10-19 – flöden och edge cases 2.
- 48 dokumenterade kontrollpunkter: 39 körda, 5 Blocked och 4 Ej körda.
- 37 Pass och 2 Fail bland de körda kontrollerna.
- APP-005, Medium: namnändring direkt följd av Add lane ger konflikt och tappar den nya banan. Reproducerat två gånger.
- APP-006, Low: CSV-förhandsvisningen slår ihop två textrader utan mellanrum. Den nedladdade filen kunde inte verifieras.
- Releaser, filter, duplicering, Done/Reopen, sökning, fältmetadata, relationer, läsmodell, domänhändelse och Ångra/Gör om kontrollerades.
- Filuppladdning, tom fil, rollbehörigheter, negativa API-anrop och last har inget godkänt resultat.
- Testfilerna godkändes för test den 2026-10-19, men webbläsarverktygets säkerhetskontroll stoppade då filåtkomsten. Detta historiska resultat för R2-041 är fortfarande Blocked och ändras inte i den äldre rapporten.
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

Den publika huvudsviten kördes den 2026-10-24. Efter korrigerad iframe-selektor och nytt layouttest fick 32 av 38 kontroller Pass. Sex Fail motsvarar tre bekräftade fel i både desktop- och mobilprojektet.

Det publika QA-regressionstestet kördes samma dag. QW-001 återkom som ett förväntat fel. Playwrights gröna körningsstatus innebär därför inte att den sidan fungerade.

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
