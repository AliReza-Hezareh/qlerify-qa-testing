# Testresultat - Qlerify

- Körningsdatum: 2026-09-29 04:55:32
- Miljö: Publika Qlerify-sidor, Windows, PowerShell HTTP-kontroller
- Version/build: Publik webb, aktuell produktion vid körning

## Test Execution Overview

| Totalt | Pass | Fail | Blocked | Pass rate | Fail rate |
| --- | ---: | ---: | ---: | ---: | ---: |
| 7 | 4 | 3 | 0 | 57.1% | 42.9% |

## Detaljerade testresultat

| Test Case ID | Titel | Status | Expected vs Actual | Bug ID | Kommentar |
| --- | --- | --- | --- | --- | --- |
| SMK-HTTP-01 | Startsidan svarar och visar Qlerify | Pass | Expected: HTTP 200 och sidinnehåll för Qlerify visas. Actual: HTTP 200. Qlerify och Try for free hittades. |  | Kontrollen gick igenom. |
| SMK-HTTP-02 | Prissidan svarar och visar prisval | Pass | Expected: HTTP 200 och prisval för Monthly/Yearly visas. Actual: HTTP 200. Monthly och Yearly hittades. |  | Kontrollen gick igenom. |
| SMK-HTTP-03 | Inloggningssidan svarar | Pass | Expected: HTTP 200 och ingen serverkrasch. Actual: HTTP 200. Inloggningssidan svarade utan serverfel. |  | Kontrollen gick igenom. |
| API-HTTP-01 | Publikt arbetsflöde går att läsa utan krasch | Pass | Expected: Sidan svarar utan serverfel. Actual: HTTP 200. Inget serverfel från publikt arbetsflöde. |  | Kontrollen gick igenom. |
| REG-WEB-01 | Bloggsidan visar inte generisk mallsektion efter sidfot | Fail | Expected: Bloggsidan ska inte visa generisk malltext efter sidfoten. Actual: BUG-001 kvarstår: Generisk text 'Grow your business' och 'Start Now' hittades på bloggsidan. | BUG-001 | Kontrollen failade och behöver följas upp. |
| REG-WEB-02 | Bloggartikel visar inte intern markör | Fail | Expected: Intern markör ska inte visas på publika artiklar. Actual: BUG-002 kvarstår: Texten '///SOCIAL SHARE' hittades i artikeln. | BUG-002 | Kontrollen failade och behöver följas upp. |
| REG-WEB-03 | Telefonnumret på kontaktsidan har tel-länk | Fail | Expected: Telefonnumret ska länka med tel: och inte #. Actual: BUG-003 kvarstår: Telefonnumret använder href='#' i stället för tel-länk. | BUG-003 | Kontrollen failade och behöver följas upp. |

## Sammanfattning

- Totalt antal körda testfall: 7
- Pass rate: 57.1%
- Fail rate: 42.9%

## Identifierade problem

- REG-WEB-01: BUG-001 kvarstår: Generisk text 'Grow your business' och 'Start Now' hittades på bloggsidan.
- REG-WEB-02: BUG-002 kvarstår: Texten '///SOCIAL SHARE' hittades i artikeln.
- REG-WEB-03: BUG-003 kvarstår: Telefonnumret använder href='#' i stället för tel-länk.
