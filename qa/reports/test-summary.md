# Testrapport - Qlerify

## 1. Sammanfattning

- System/Projekt: Qlerify publika webb och app-ingångar
- Testperiod: 2026-09-29 04:55:32
- Vad testades: Startsida, prissida, inloggning, publikt arbetsflöde, blogg, artikel och kontaktsida.
- Övergripande resultat: 4 pass, 3 fail, 0 blocked av 7 testfall.

## 2. Test Scope

| Ingick | Ingick inte |
| --- | --- |
| Publika HTTP-kontroller, smoke, regression och enkel UI-innehållskontroll. | Inloggade CRUD-flöden, betalning, databas, e-postleverans och riktiga konton. |

## 3. Test Execution Summary

| Totalt | Passed | Failed | Blocked | Ej körda |
| ---: | ---: | ---: | ---: | ---: |
| 7 | 4 | 3 | 0 | 0 |

## 4. Defect Summary

| Severity | Antal |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 0 |

Kort analys: Fail betyder att en tidigare dokumenterad risk eller bugg fortfarande syns i publikt innehåll.

## 5. Kvalitetsbedömning

- Releasebeslut: No-Go för de kontroller som failar tills buggarna är rättade eller accepterade.
- Risker kvar: Publika UI-fel kan påverka förtroende, navigation och kontaktflöde.

## 6. Avvikelser från testplan

- Endast publika och säkra kontroller kördes.
- Tester som kräver konto, databas eller interna behörigheter kördes inte.

## 7. Rekommendationer

- Rätta failade buggar och kör qa/run-tests.ps1 igen.
- Kör manuella tester i qa/docs/MANUELLA_TESTER.md när konto och testdata finns.

## Godkännanden

- QA ansvarig: Ali Reza Hezareh / tester är inte godkända om någon kontroll failar
- Tech Lead: [Namn] / [Datum]
- Produktansvarig: [Namn] / [Datum]
