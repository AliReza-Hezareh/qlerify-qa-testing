# Omtest APP-005 – snabb namnändring följd av Add lane

- **Testdatum:** 2026-10-26
- **QA-ansvarig:** Ali Reza Hezareh
- **Status för omtestet:** Pass – APP-005 reproducerades inte i de två försöken
- **Historisk buggstatus:** APP-005 är fortsatt öppen; dagens omtest bevisar inte att felet är åtgärdat.

## Sammanfattning

Jag testade två gånger om en snabb namnändring följd direkt av **Add lane** skapar och sparar en bana. Båda försöken lyckades utan synligt konfliktmeddelande. Efter omladdning fanns Lane 2 och Lane 3 kvar. APP-005 reproducerades alltså inte i detta omtest.

## Miljö och omfattning

- Applikation: Qlerify, live webbapp.
- Miljö: Windows, Chrome på skrivbord.
- Session: befintlig inloggad session. Inga inloggningsuppgifter hanterades.
- Testdata: det separata QA-arbetsflödet `QA APP-005 omtest 2026-10-26`, med två kopplade händelser.
- Appversion/build: inte fastställd.
- Omfattning: två snabba namnändringar följda direkt av **Add lane**, därefter omladdning.
- Bevis: gränssnittet kontrollerades direkt efter varje åtgärd och efter omladdning. Ingen skärmbild sparades i repot.

## Testresultat

| Test-ID | Steg | Förväntat resultat | Faktiskt resultat | Status |
| --- | --- | --- | --- | --- |
| APP-005-RETEST-01 | Byt den andra händelsen till `QA Order godkänd`, tryck Enter och klicka direkt på **Add lane**. | Namnet sparas och Lane 2 skapas utan konflikt. | Lane 2 visades direkt. Inget konfliktmeddelande syntes. | Pass – felet reproducerades inte |
| APP-005-RETEST-02 | Byt namnet till `QA Order betalad`, tryck Enter och klicka direkt på **Add lane**. Ladda sedan om arbetsflödet. | Lane 3 skapas och finns kvar efter omladdning. | Lane 3 visades direkt och fanns kvar efter omladdning tillsammans med Lane 2 och namnet `QA Order betalad`. Inget konfliktmeddelande syntes. | Pass – felet reproducerades inte |

## Visuell sammanfattning

Antal snabba försök i detta omtest, 2026-10-26:

```text
Bana skapad och kvar efter omladdning   2  ██
Bana saknades efter omladdning          0
Konfliktmeddelande observerat           0
```

Staplarna visar bara de två försöken i detta omtest. Historiska resultat från 19 oktober är inte inräknade.

## Bedömning och begränsningar

APP-005 rapporterades som reproducerad två gånger den 2026-10-19 och står kvar som ett öppet historiskt fynd med severity Medium. I omtestet den 2026-10-26 skapades båda banorna och överlevde omladdning. Det finns därför ingen reproduktion i dagens två försök, men det räcker inte för att fastställa att felet är åtgärdat.

Testet omfattade ett separat QA-arbetsflöde, en Chrome-session och två försök. Appversion, serverloggar och backend observerades inte. Ingen automatiserad regression kördes och inga skärmbilder sparades.

## PowerShell

```powershell
Set-Location "D:\LIA 2\code"
node .\qa\tools\render-exploratory-report.mjs --source "reports/exploratory-app-2026-10-26-app-005-retest.md"
Start-Process .\qa\reports\exploratory-app-2026-10-26-app-005-retest.html
```

- [Öppna QA-översikten](../index.html)
- [Dagens arbetslogg](../veckologg/daglogg-2026-10-26.md)
