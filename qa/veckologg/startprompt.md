Ny arbetsdag för Qlerify QA. Använd dagens datum och håll denna dags arbete i denna chatt. Jag är praktikant inom test och QA-ansvarig är Ali Reza Hezareh.

1. Kontrollera först att det aktiva repot är D:\LIA 2\code. Läs gällande AGENTS.md, qa/README.md, qa/STATUS.md, qa/veckologg/README.md och de två apprapporterna från 2026-10-19. En äldre Gitrot finns i D:\LIA 2; använd den inte som QA-repo och rensa inga mappar utan stöd i uppgiften. Kontrollera aktuellt Git- och webbläsarläge innan du utgår från tidigare status.

2. Ändra bara tester, testdata, QA-verktyg och QA-dokumentation. Ändra inte applikationskod. Logga aldrig in åt mig och hantera inte mina lösenord. Gör förändrande webbtester endast i ett eget, tydligt namngivet QA-arbetsflöde. Använd bara syntetiska data och respektera befintliga säkerhetsspärrar.

3. Senast dokumenterat: första omgången 42 körda kontroller, 37 Pass och 5 Fail; andra omgången 39 körda, 37 Pass och 2 Fail. De ska inte summeras till unika tester eller generell täckning. APP-001–006 och tidigare kända QW-001 finns i rapporterna. De är inte omtestade efter 19 oktober i detta underlag. Den 22 oktober gjordes sammanställning, inga nya produkttester.

4. Fortsätt bilagetestet på kortet QA R1 – Skapa order ÅÄÖ 🧪 i arbetsflödet QA 2026-10-19 – flöden och edge cases 2. Filen qa/fixtures/attachments/qa-åäö.txt är 28 byte. Den 24 oktober rapporterades först att filnamnet syntes efter omladdning och att filen öppnades korrekt; vid senare direkt kontroll syntes den inte på kortet. Resultatet är därför Blocked: det är inte bekräftat att filen sparades eller öppnades från kortet. Filväljarens accept-filter listar inte .txt, men serverstödet är inte fastställt. Upprepa den manuella kontrollen av samma fil på samma kort och dokumentera vad som faktiskt syns efter omladdning och öppning. Kringgå inte verktygsspärrar. Ändra inte Blocked till Pass utan verifierbara resultat. Arbetsflödets URL finns i andra omgångens rapport.

5. Fortsätt sedan riskbaserad utforskande testning och omtesta öppna fel där förutsättningarna finns. Skilj produktfel från verktygsproblem. Dokumentera exakta steg, expected/actual, miljö, status, severity och bevis. Fråga innan du lägger de föreslagna förändrande flödena för APP-005, APP-006 och releasefilter i testagenten; detta är ännu inte registrerat som implementerat.

6. Använd det befintliga Google-dokumentet och kalkylarket som länkas i qa/veckologg/README.md. Lägg till dagens faktiska arbete och uppdatera rätt vecka. Bevara historik, datum, rapportlänkar och Git-versioner. Hitta inte på timmar, resultat eller personliga reflektioner. Skriv enkel professionell svenska med korrekta ÅÄÖ. Nämn inte författarverktyg i dokumenten.

7. Efter en testkörning: skapa en ny daterad rapport i qa/reports/, uppdatera qa/STATUS.md och länkarna i qa/index.html samt bygg den visuella rapporten med det befintliga rapportverktyget. Äldre resultat ska finnas kvar. Rapportgenerering är inte en testkörning.

8. Avsluta med en kort dagsrapport, kvarvarande blockeringar och nästa steg. Granska och committa bara relevanta QA-filer med ett tydligt meddelande, ta in fjärrändringar med rebase och pusha utan force. Rör inte tmp/. Svara kort, ge PowerShell-kommandon och handled mig ett manuellt steg åt gången när min medverkan behövs.
