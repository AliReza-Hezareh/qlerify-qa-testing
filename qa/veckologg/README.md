# Veckologg, rapporter och separata arbetsdagar

QA-ansvarig: Ali Reza Hezareh. Upprättad: 2026-10-22.

## Löpande underlag

- [Google-dokument: veckologg och rapporter](https://docs.google.com/document/d/1ojP28dH5XNDj-oowxUhK-xZ6c1tG0reOvhkMchx-Rls/edit?usp=drivesdk)
- [Google-kalkylark: logg och testresultat](https://docs.google.com/spreadsheets/d/1rWCCTZidf9dyKAlyuix1E1FJ8s9j6plluSayuItQJGU/edit?usp=drivesdk)
- [Lokal arkivkopia av veckologgen, vecka 43](veckologg-2026-V43.md)
- [Startprompt för en ny arbetsdag](startprompt.md)

Google-dokumentet används för den löpande veckobeskrivningen. Kalkylarket används för daglogg, veckologg, separata testomgångar, buggar och källor. Detaljerade testresultat och bevis ligger kvar i `qa/reports/` och `qa/evidence/`.

Länkarna i Google-underlagen pekar på sparade Git-versioner. Nya ändringar i repot eller i Google-filerna synkroniseras inte automatiskt mellan systemen. Den lokala arkivkopian gäller innehållet vid skapandet den 22 oktober 2026.

## Arbetsdagar

Ge varje dags chatt namnet `ÅÅÅÅ-MM-DD – Qlerify QA`. Använd samma Google-dokument och kalkylark även när en ny chatt startas. Lägg till en dagloggrad för faktiskt arbete och uppdatera rätt veckosektion. Bevara tidigare datum och resultat.

Kopiera startprompten med PowerShell:

```powershell
Get-Content -LiteralPath "D:\LIA 2\code\qa\veckologg\startprompt.md" -Raw -Encoding UTF8
```

Aktivt QA-repo är `D:\LIA 2\code`. En äldre Gitrot finns i `D:\LIA 2` och är inte samma arbetsrepo. Ingen flytt eller rensning av den äldre roten ingår i denna sammanställning.

## Spårbar loggning

- Skriv aktivitetens verkliga datum. En sammanställning är inte en ny testkörning.
- Lägg till test-ID, rapportlänk och Git-version för resultat som ska användas som underlag.
- Håll Pass, Fail, Blocked och Ej körda åtskilda.
- Håll omgångarnas antal åtskilda när kontroller överlappar.
- Markera om ett fel har omtestats, i vilken miljö och med vilket resultat.
- Skilj observation från möjlig orsak. Lägg inte till timmar eller egen reflektion som inte har registrerats.
- För ett nytt körningsdatum används en ny daterad rapport i `qa/reports/`. Uppdatera QA-status och den visuella översikten med länken till den nya rapporten.

## Rapportöversikt

Den visuella rapporten finns i `qa/index.html`. `qa/run-tests.ps1` bygger de befintliga apprapporternas HTML från Markdown och öppnar QA-översikten efter testkörningen. Rapportgenerering ensam innebär ingen ny testkörning. Se `qa/README.md` för körkommandon och bevakningsläge.

## Git efter en QA-ändring

Granska filerna före commit. `tmp/` ska inte läggas till. Kommandona körs i QA-repot:

```powershell
Set-Location "D:\LIA 2\code"
git status --short
git diff --stat
git add -- qa
git diff --cached --stat
git commit -m "qa: update daily log and verified test results"
git pull --rebase
git push
git status --short --branch
```

Välj ett commitmeddelande som beskriver den faktiska ändringen. Vid konflikt ska ändringen granskas innan arbetet fortsätter. Använd inte force-push.
