# Bevislogg – filuppladdning 2026-10-24

- Kort: **QA R1 – Skapa order ÅÄÖ 🧪**
- Avsedd fil: qa-åäö.txt, 28 byte
- Testdata i filen: Bara QA-testdata ÅÄÖ 🧪
- Tom testfil för separat kontroll: qa-empty.txt, 0 byte

## Vad som hände

1. Testaren valde qa-åäö.txt manuellt på kortet och rapporterade att filnamnet syntes.
2. Efter omladdning rapporterade testaren att filnamnet fortfarande syntes.
3. Testaren rapporterade att filen öppnades och att innehållet var korrekt.
4. Vid en senare direkt kontroll av samma kort syntes qa-åäö.txt inte. Bilagelistan visade bara den äldre länken https://inte-en-länk.
5. Filfältets accept-värde var image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx. Det synliga filtret listar alltså inte .txt. Detta fastställer inte serverns stöd för filtypen.
6. Försöket att välja qa-empty.txt stoppades av webbläsarverktyget innan filen skickades till appen.

## Slutsats

Det går inte att bekräfta att qa-åäö.txt sparades på kortet eller att den öppnade filen var den kvarvarande bilagan. Resultatet är **Blocked**, inte ett bekräftat produktfel. Den tomma filens hantering i appen är inte testad.

Nästa kontroll är att ladda upp qa-åäö.txt igen på samma kort, ladda om sidan och kontrollera om filnamnet finns kvar och om bilagan går att öppna.