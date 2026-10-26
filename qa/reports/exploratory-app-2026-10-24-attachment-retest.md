# Testresultat – omtest av filuppladdning

- Rapport-ID: QLERIFY-ATT-2026-10-24
- Datum: 2026-10-24
- Testare och QA-ansvarig: Ali Reza Hezareh
- Miljö: Qlerifys driftsatta webbapp i en redan inloggad webbläsarsession på Windows
- Testobjekt: Kortet **QA R1 – Skapa order ÅÄÖ 🧪**
- Testdata: `qa/fixtures/attachments/qa-åäö.txt`, 28 byte

## Sammanfattning

Testfilen qa-åäö.txt (28 byte) skulle laddas upp som bilaga på kortet **QA R1 – Skapa order ÅÄÖ 🧪**. Testaren rapporterade först att filnamnet syntes efter omladdning och att filen öppnades med rätt innehåll. Vid en senare direkt kontroll av samma kort syntes qa-åäö.txt inte; bilagelistan visade bara den äldre länken https://inte-en-länk.

Därför går det inte att bekräfta att filen sparades på kortet eller att den öppnade filen var den sparade bilagan. Resultatet är **Blocked**. Det är inte i sig bevis på ett produktfel. Sidans filväljare listar inte .txt i sitt accept-filter, men det visar inte om servern skulle acceptera filtypen.

## Detaljerade resultat

| Test-ID | Kontroll | Status | Förväntat resultat | Faktiskt resultat |
| --- | --- | --- | --- | --- |
| ATT-001 | Kontrollera lokal testfil | Pass | Filen finns och är 28 byte. | Filen var 28 byte. SHA-256: `675B4D02E709C8614F9758FD1FF2F4B71797812A6BB5191EFFFF46DE681E29A9`. |
| ATT-002 | Välj normal textfil | Blocked | Det går att välja qa-åäö.txt på kortet. | Testaren rapporterade att filen valdes. Vid senare kontroll syntes den inte på kortet. Filväljarens accept-filter listar inte .txt; serverns stöd för filtypen är inte fastställt. |
| ATT-003 | Ladda om sidan | Blocked | qa-åäö.txt syns kvar på kortet efter omladdning. | Först rapporterades filnamnet synligt efter omladdning. Vid senare direkt kontroll syntes filen inte. Uppgifterna motsäger varandra, så det är inte verifierat att bilagan sparades. |
| ATT-004 | Öppna bilagan | Blocked | Den sparade bilagan öppnas och innehåller testtexten. | Testaren rapporterade att filen öppnades med rätt innehåll. Eftersom filen senare inte syntes på kortet kunde kontrollen inte bekräftas mot en kvarvarande bilaga. |
| ATT-005 | Ladda upp tom fil | Blocked | Appen visar vad som händer när qa-empty.txt (0 byte) väljs. | Webbläsarverktyget stoppade filvalet innan filen skickades till appen. Appens hantering av en tom fil testades därför inte. |

## Resultatöversikt

| Mått | Antal |
| --- | ---: |
| Dokumenterade kontroller | 5 |
| Pass | 1 |
| Fail | 0 |
| Blocked | 4 |

Kort sagt: testfilen var korrekt lokalt, men det gick inte att bekräfta att qa-åäö.txt låg kvar på Qlerify-kortet efter omladdning. Därför är uppladdningen fortfarande **Blocked**. Ingen ny produktbugg är bekräftad. R2-041 från den 19 oktober avser det tidigare försöket och står kvar som Blocked.

