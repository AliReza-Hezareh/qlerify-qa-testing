# Qlerify QA-testrepo

Delade instruktioner för AI-agenter. Codex läser AGENTS.md. Claude läser CLAUDE.md, som importerar den här filen. Lägg alla gemensamma regler här.

## Projekt
- Sökväg: `D:\LIA 2`
- Git-repo - remote: https://github.com/AliReza-Hezareh/qlerify-qa-testing.git (publikt)
- Stack: Node.js, @playwright/test
- Syfte: black-box QA av Qlerify. Planen för testagenten finns i `Qlerify-Testagent-Plan.md`.

## Kommandon
- `npm run test` - `playwright test`
- `npm run test:smoke` - `playwright test tests/public-smoke.spec.js`
- `npm run report` - `node qa/tools/update-report.mjs`
- `.\qa\run-tests.ps1` - kör smoke tests och öppnar rapporten

## Kunskapsbas (läs först)
Innan du planerar, skriver eller prioriterar tester: läs `qa-knowledge/README.md` och de filer den pekar på.

- `qa-knowledge/funktionskarta.md` - vad Qlerify gör och vilket beteende som förväntas. Använd som testbasis.
- `qa-knowledge/risker.md` - kända problem och risker. Använd för att prioritera.
- `qa-knowledge/kritiska-floden.md` - användarflöden som ska testas först.

Regler för kunskapsbasen:
- Filerna är genererade av NotebookLM (notebook "Qlerify LIA kunskapsbas") och kan innehålla fel. Det som står i Qlerifys egen dokumentation eller i appen vinner.
- Ange vilken fil och vilken rad/sektion ett testfall eller en prioritering bygger på.
- Om något inte finns i kunskapsbasen: säg det och markera det som antagande. Gissa inte fram krav.
- `qa-knowledge/` är git-ignorerad eftersom den bygger på interna Qlerify-dokument. Committa den inte och citera inte interna detaljer i filer som committas.

## QA-regler
- Ändra inte applikationskod. Skapa bara tester, testdata, fixtures, dokumentation, buggrapporter och QA-verktyg.
- Skriv enkel och tydlig svenska.
- Koppla varje testfall till krav, user story, process-steg eller en rad i `qa-knowledge/`.
- Dokumentera expected vs actual och risknivå när fel hittas.
- Stabila tester: inga hårdkodade sleeps, tydliga assertions, ingen duplicerad testkod.
- Använd bara testdata. Inga riktiga lösenord eller personuppgifter.

## Samarbete Codex + Claude
- Varje agent jobbar på en egen branch: `codex/<uppgift>` eller `claude/<uppgift>`. Båda jobbar aldrig direkt på `main` samtidigt.
- Kör `git status` och `git pull` innan arbetet börjar. Committa små, tydliga steg.
- Kör testerna innan merge till `main`.
- Uppdatera AGENTS.md, inte CLAUDE.md, när gemensamma regler ändras.
