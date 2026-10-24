# Testresultat – omtest av filuppladdning

- Rapport-ID: QLERIFY-ATT-2026-10-24
- Datum: 2026-10-24
- Testare och QA-ansvarig: Ali Reza Hezareh
- Miljö: Qlerifys driftsatta webbapp i en redan inloggad webbläsarsession på Windows
- Testobjekt: Kortet **QA R1 – Skapa order ÅÄÖ 🧪**
- Testdata: `qa/fixtures/attachments/qa-åäö.txt`, 28 byte

## Sammanfattning

Den lokala testfilen är korrekt. Det går däremot inte att godkänna uppladdningen. Testaren rapporterade först att filnamnet syntes efter omladdning och att innehållet var korrekt. En senare direkt kontroll av samma kort visade bara den gamla länken `https://inte-en-länk`. Filen `qa-åäö.txt` syntes inte.

Filväljaren accepterar inte `.txt` enligt sidans `accept`-attribut. Därför är resultatet Blocked och räknas inte som ett bekräftat produktfel.

## Detaljerade resultat

| Test-ID | Kontroll | Status | Förväntat resultat | Faktiskt resultat |
| --- | --- | --- | --- | --- |
| ATT-001 | Kontrollera lokal testfil | Pass | Filen finns och är 28 byte. | Filen var 28 byte. SHA-256: `675B4D02E709C8614F9758FD1FF2F4B71797812A6BB5191EFFFF46DE681E29A9`. |
| ATT-002 | Välj normal textfil | Blocked | En tillåten fil kan väljas. | Testaren rapporterade att filen valdes. `.txt` finns inte i filväljarens lista över tillåtna typer. |
| ATT-003 | Ladda om sidan | Blocked | Bilagan finns kvar. | Testaren rapporterade först att namnet syntes. Senare direkt kontroll visade inte filen på kortet. |
| ATT-004 | Öppna bilagan | Blocked | Den sparade bilagan öppnas med oförändrat innehåll. | Innehållet rapporterades som korrekt, men det gick inte att koppla bekräftelsen till en kvarvarande bilaga i appen. |
| ATT-005 | Ladda upp tom fil | Blocked | Appen visar ett tydligt resultat för 0 byte. | Webbläsarverktygets filväljare stoppade försöket innan filen skickades. |

## Resultatöversikt

| Mått | Antal |
| --- | ---: |
| Dokumenterade kontroller | 5 |
| Pass | 1 |
| Fail | 0 |
| Blocked | 4 |

Ingen ny produktbugg är bekräftad i bilagetestet. R2-041 från den 19 oktober är fortfarande Blocked.

