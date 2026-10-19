# PLAN - QA kunskapsbibliotek

## Syfte

Bygga ett lokalt kunskapsbibliotek för QA-arbete. Material ska kopieras säkert, indexeras och användas för källbaserade testscenarier.

## Viktiga regler

- Ändra inte applikationskod.
- Spara bara QA-filer, testdata, dokumentation, rapporter och QA-verktyg.
- Behandla originalfiler som läskopia.
- Skriv tydliga testfall med källa, risk, prioritet och status.
- Markera öppna frågor när förväntat beteende saknar stöd.

## Kontroll innan nedladdning

1. Bekräfta Teams-team, kanaler och filer som ingår.
2. Bekräfta lokal målmapp.
3. Kontrollera att kontot har rätt behörighet.
4. Kontrollera ledigt diskutrymme.
5. Inventera filantal, filtyper och total storlek.
6. Dokumentera privata och delade kanaler separat.

## Delmål

| Delmål | Klart när | Status |
|---|---|---|
| Förutsättningar | Konto, team, kanaler och målmapp är bekräftade | Blockerad |
| Inventering | Alla tillgängliga filer finns i `file-register.csv` | Inte startad |
| Lokal kopia | Filer är kopierade till `qa/library/01-original/` | Inte startad |
| Verifiering | Kopierade filer är läsbara och inte molnplatshållare | Inte startad |
| Textutdrag | Läsbara dokument är extraherade till text | Inte startad |
| Index | Lokalt index och begreppslista finns | Inte startad |
| Testscenarier | Testfall är skapade med källa eller märkta som förslag | Inte startad |
| Rapport | Slutrapport visar täckning, blockerade filer och nästa steg | Inte startad |

## Källregler för Teams och NotebookLM

- Teams-kanalfiler ligger normalt i SharePoint. Microsoft beskriver att filer som delas i en kanal lagras i SharePoint.
- Privata och delade kanaler kan ha egna SharePoint-platser. Därför ska de kontrolleras separat.
- Filer som delas i privat chatt eller möteschatt kan ligga i uppladdarens OneDrive.
- NotebookLM/Gemini Notebook har stöd för flera filtyper som PDF, DOCX, TXT, MD, CSV och PPTX. Kontrollera alltid aktuell gräns innan import.

Källor:

- Microsoft Support: https://support.microsoft.com/en-us/teams/teams-channels/standard-private-or-shared-channels-in-microsoft-teams
- Microsoft Learn: https://learn.microsoft.com/en-au/sharepoint/teams-connected-sites
- Microsoft Service Assurance: https://learn.microsoft.com/en-us/compliance/assurance/assurance-isolation-in-microsoft-365
- Google Notebook hjälp: https://support.google.com/gemininotebook/answer/16215270

## Nästa steg

Fyll i:

- Teams-konto:
- Team:
- Kanaler:
- Ska privata/delade kanaler ingå:
- Lokal målmapp:
- System eller webbplats som ska testas:
- Befintligt testrepo:
- NotebookLM-konto eller notebook:

