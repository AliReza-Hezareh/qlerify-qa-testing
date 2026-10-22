# Qlerify QA – Veckologg och rapporter

Lokal arkivkopia från 2026-10-22. [Löpande Google-dokument](https://docs.google.com/document/d/1ojP28dH5XNDj-oowxUhK-xZ6c1tG0reOvhkMchx-Rls/edit?usp=drivesdk). Kommande ändringar i Google-dokumentet synkroniseras inte automatiskt till denna kopia.

*Underlag för examensarbete · Uppdaterat 22 oktober 2026*

QA-ansvarig: Ali Reza Hezareh. Vecka 43 pågår. Testresultaten är från 19 oktober 2026. Dokumentationen sammanställdes 22 oktober 2026.

## Arbetsöversikt

Jag har granskat Qlerify från användarens perspektiv. Arbetet omfattar utforskande testning, egna testdata, testresultat, buggrapporter och en visuell QA-översikt. Jag har inte ändrat applikationskod.

QA-materialet finns i D:\LIA 2\code och i GitHub-repot qlerify-qa-testing. Dokumentationen och testverktygen har sparats och pushats. Den senaste verifierade committen före denna sammanställning är 4ba7e8f.

Den första delen av chatten innehåller också arbete med Git, lokal mapp och terminal. Exakta datum och arbetstimmar för dessa steg är inte fastställda. De räknas därför inte som nya testaktiviteter den 22 oktober.

## Vecka 43 · 19–25 oktober 2026

### 19 oktober – testning och dokumentation

Jag skapade två separata QA-arbetsflöden med syntetiska data. I första omgången testade jag bland annat namnvalidering, navigation, lagring, historik, export, synligt skrivskydd, layout och tillgängliga namn.

I andra omgången testade jag bland annat två kopplade händelser, banor, User Story-kort, releaser, filter, duplicering, Done/Reopen, sökning, kommentarer, röstning, entitetsfält, relationer, Command, Read Model, Domain Event och Ångra/Gör om.

Jag dokumenterade steg, förväntat och faktiskt resultat, severity, skärmbilder och textbevis. Fullständiga resultat finns i rapporterna som länkas under Källor. Inga videor spelades in.

### 22 oktober – sammanställning

Jag gick igenom tidigare rapporter och repots status för att samla underlaget per arbetsdag och vecka. Jag skapade denna löpande veckologg och ett kalkylark med daglogg, veckologg, testomgångar, buggar och källor.

Inga nya produkttester eller omtester genomfördes den 22 oktober i denna fortsättning. Inga arbetstimmar har registrerats. Aktiviteter för 20–21 oktober är inte dokumenterade här.

### Resultat per testomgång

Varje rad nedan kommer från den sparade rapporten. Blocked och Ej körda ingår inte i pass- eller fail-procenten.

| Mått | Omgång 1 | Omgång 2 |
| --- | --- | --- |
| Dokumenterade kontrollpunkter | 49 | 48 |
| Körda (Pass + Fail) | 42 | 39 |
| Pass | 37 | 37 |
| Fail | 5 | 2 |
| Blocked | 3 | 5 |
| Ej körda | 4 | 4 |
| Pass rate | 88,10 % | 94,87 % |
| Fail rate | 11,90 % | 5,13 % |

Pass rate = Pass / (Pass + Fail) × 100. Fail rate = Fail / (Pass + Fail) × 100. Omgångarna innehåller delvis överlappande kontroller. Antalen ska inte summeras till unika testfall eller till ett mått på hela appens täckning.

Första omgången observerade app.b135f38b.js och andra omgången app.9855aa4c.js. Dessa filnamn är observerade resurser, inte verifierade byggnummer. Skillnaden i pass rate visar inte i sig att produkten har blivit bättre.

### Dokumenterade avvikelser

Följande sju distinkta avvikelser finns i underlaget från 19 oktober: sex nyfunna och ett tidigare känt fel. Statusen nedan är den dokumenterade statusen, inte en ny kontroll av dagens app.

- APP-001 · Low: ett arbetsflöde kan skapas med bara blanksteg.

- APP-002 · Medium: domänmodellens verktygsfält överlappar på smal skärm.

- APP-003 · Low: villkorslänken ger 404 från en händelses detaljadress.

- APP-004 · Medium: fyra ikonknappar saknar tillgängligt namn.

- APP-005 · Medium: snabb namnändring följd av Add lane ger konflikt och tappar den nya banan. Två reproduktioner dokumenterades.

- APP-006 · Low: CSV-förhandsvisningen tar bort gränsen mellan två textrader. Den exporterade filens innehåll är inte verifierat.

- QW-001 · Low, tidigare känt: qlerify.com/login visar Page Not Found.

Ingen avvikelse är dokumenterad som åtgärdad eller godkänd. Fynden från första omgången är inte omtestade mot resursen i andra omgången. Det finns inget övergripande releasegodkännande.

## Metod och begränsningar

Testmetod: manuell utforskande black-box-testning i den driftsatta webbappen, med en befintlig inloggad session på Windows i en Chromium-baserad webbläsare. Ändringar gjordes i egna QA-arbetsflöden med syntetiska data.

Pass betyder att den angivna kontrollens förväntade resultat uppnåddes. Fail betyder en observerad avvikelse. Blocked betyder att kontrollen inte kunde slutföras. Ej körda betyder att kontrollen inte genomfördes.

Hela den automatiska sviten kördes inte i de utforskande omgångarna. Ett tidigare publikt test behandlade QW-001 som ett förväntat fel. Grön körstatus i den situationen betyder inte att inloggningsadressen fungerar.

Rollbehörigheter mellan konton, manipulerade API-anrop, last, databasbegränsningar och flera säkerhetsscenarier saknar godkänt testresultat. Inga slutsatser om säkerhet eller prestanda kan dras från vanliga UI-klick.

R2-041, filuppladdning: qa-åäö.txt på 28 byte och qa-empty.txt på 0 byte skapades och godkändes för test. Webbläsarverktygets säkerhetskontroll stoppade första filvalet. Ingen fil laddades upp. Manuell fortsättning efterfrågades, men något resultat har inte rapporterats.

R2-032, CSV-fil: testverktyget kunde inte fånga nedladdningen. Detta är en blockering och inte bevis för en produktbugg. APP-006 gäller bara förhandsvisningen.

För examensarbetet är detta ett avgränsat praktiskt underlag. Observationer, möjliga orsaker och oprövade antaganden ska hållas isär. Någon formell standardöverensstämmelse, fullständig säkerhetsgranskning eller heltäckande testning har inte fastställts.

## Källor och versionsspårning

Länkarna till rapporterna och bevisen nedan pekar på sparade Git-versioner. De kan kräva åtkomst till repot. Denna veckologg och kalkylarket är sammanställningar; de detaljerade testresultaten finns i källrapporterna.

[Rapport 1 – 19 oktober](https://github.com/AliReza-Hezareh/qlerify-qa-testing/blob/41f2f3e/qa/reports/exploratory-app-2026-10-19.md)

[Rapport 2 – 19 oktober](https://github.com/AliReza-Hezareh/qlerify-qa-testing/blob/4ba7e8f/qa/reports/exploratory-app-2026-10-19-round2.md)

[Bilagetestets blockering och testdata](https://github.com/AliReza-Hezareh/qlerify-qa-testing/blob/4ba7e8f/qa/evidence/exploratory-2026-10-19-round2/TC-upload-blocked.md)

[Bevis från första omgången](https://github.com/AliReza-Hezareh/qlerify-qa-testing/tree/41f2f3e/qa/evidence/exploratory-2026-10-19)

[Bevis från andra omgången](https://github.com/AliReza-Hezareh/qlerify-qa-testing/tree/4ba7e8f/qa/evidence/exploratory-2026-10-19-round2)

[QA-status och läsanvisningar](https://github.com/AliReza-Hezareh/qlerify-qa-testing/blob/4ba7e8f/qa/STATUS.md)

[Tillhörande kalkylark](https://docs.google.com/spreadsheets/d/1rWCCTZidf9dyKAlyuix1E1FJ8s9j6plluSayuItQJGU/edit?usp=drivesdk)

Git-versioner: 41f2f3e innehåller första appgranskningen. aac3118 innehåller andra omgången och två nya fynd. 4ba7e8f innehåller testfilerna och den dokumenterade uppladdningsblockeringen.

## Fortsättning nästa arbetsdag

Utgå från QA-repot D:\LIA 2\code. Kontrollera Git-status och läs qa/STATUS.md samt den senaste rapporten innan nya resultat skrivs.

En äldre Gitrot finns kvar i D:\LIA 2. Den kontrollerades den 22 oktober. Arbeta därför i den uttryckligen angivna QA-mappen och utgå inte från att mappfrågan är löst.

För bilagetestet behövs först resultat från den manuella uppladdningen av qa-åäö.txt på R1-kortet. Fortsätt sedan med den tomma filen. Ändra inte Blocked till Pass innan resultatet och bevisen finns.

Automatiska kontroller för APP-005, APP-006 och releasefilter har föreslagits. De är inte registrerade som implementerade i detta underlag.

Nya testresultat ska få sitt verkliga körningsdatum. Den gamla rapporten ska inte dateras om eller skrivas över så att tidigare resultat försvinner.

## Mall för kommande veckor

Kopiera följande fält till en ny veckosektion. Fyll bara i genomförda och verifierade aktiviteter. Planerade aktiviteter ska markeras som planerade.

Vecka och datumintervall:

Arbetsdag och aktivitet:

Syfte och testobjekt:

Miljö och observerad version:

Test-ID eller rapport-ID:

Faktiskt resultat och status:

Bugg-ID, severity och reproduktionssteg:

Källrapport, bevis och Git-version:

Blockeringar och ej genomförda kontroller:

Egen reflektion, när jag själv har lagt till den:

Nästa planerade steg:
