# Bevislogg – filuppladdning 2026-10-24

- Testare: Ali Reza Hezareh
- Kort: **QA R1 – Skapa order ÅÄÖ 🧪**
- Fil: `qa-åäö.txt`, 28 byte
- Innehåll: `Bara QA-testdata ÅÄÖ 🧪`

## Händelser

1. Testaren valde filen manuellt och rapporterade att filnamnet syntes.
2. Efter omladdning rapporterade testaren att filnamnet fortfarande syntes.
3. Testaren rapporterade att filen öppnades med korrekt innehåll.
4. En senare direkt kontroll av samma kort visade en bilaga: länken `https://inte-en-länk`.
5. `qa-åäö.txt` syntes inte i bilagelistan.
6. Filfältets `accept` var `image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx`. `.txt` saknades.
7. Försök med `qa-empty.txt` stoppades av webbläsarverktygets filväljare innan filen skickades.

Status: **Blocked**. Uppgifterna motsäger varandra och filtypen stöds inte av den synliga filväljaren. Ingen produktbugg är bekräftad.

