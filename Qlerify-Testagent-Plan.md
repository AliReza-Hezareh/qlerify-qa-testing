# Testagent för Qlerify

## Mål
Målet är att bygga en testagent som hjälper QA-arbetet för Qlerify. Agenten ska läsa Qlerify-modeller, krav, user stories, business rules, Given-When-Then och exporterade specar. Utifrån det ska den skapa testplan, testspecifikation, testfall, buggrapporter och en enkel QA-dashboard.

Agenten ska bara arbeta med test, QA och dokumentation. Den ska inte ändra applikationskod.

## Rekommenderad agenttyp
Den testagent som passar bäst är en **Model-Based QA Agent**.

Det betyder att testerna byggs från modellen och kraven, inte från gissningar. Qlerify jobbar med workflows, domain models, user stories, bounded contexts, commands, events och acceptance criteria. Därför ska agenten använda detta som testbasis.

## Varför detta passar Qlerify
Qlerify används för att beskriva processer, krav och systemlogik visuellt. Det gör att QA-arbetet kan starta tidigt, innan all kod är klar.

Agenten passar Qlerify eftersom den kan:

- hitta testluckor i krav och user stories
- skapa testfall från Given-When-Then
- koppla testfall till krav, process-steg och user stories
- analysera domain model, commands och events
- hitta risker innan implementation
- skapa underlag för regressionstest när modellen ändras
- skapa tydlig QA-dokumentation i repo

## Huvuddelar

### 1. Requirement Analyzer
Analyserar krav, user stories, business rules och Given-When-Then.

Ska hitta:

- otydliga krav
- saknade acceptance criteria
- krav som inte går att testa
- saknade negativa scenarier
- saknade edge cases
- krav som kan skapa säkerhetsrisk

### 2. Test Case Generator
Skapar konkreta testfall som går att automatisera senare.

Testfallen ska innehålla:

- Test Case ID
- titel
- beskrivning
- preconditions
- teststeg
- testdata
- expected result
- prioritet
- testtyp
- koppling till krav eller user story

Testtyper som ska täckas:

- smoke
- regression
- functional
- API
- validation
- edge case
- UI/UX
- accessibility
- security
- performance
- exploratory

### 3. Automation Planner
Planerar vilka tester som ska automatiseras och hur.

Den ska föreslå:

- Playwright för UI och E2E
- API-tester för endpoints och OpenAPI
- valideringstester för fel input
- säkerhetstester för XSS, auth, IDOR och data leaks
- manuella exploratory tester när automation inte räcker

Den ska inte skriva eller ändra applikationskod.

### 4. Risk & Security Reviewer
Letar efter risker i krav, flöden och API-kontrakt.

Ska kontrollera:

- XSS-risk
- trasig behörighet
- direkt åtkomst till skyddade resurser
- IDOR
- tokenläckage
- känslig data i svar
- svag validering
- felaktig felhantering
- race conditions

När ett problem hittas ska det dokumenteras med:

- titel
- severity
- priority
- steg för att återskapa
- expected behavior
- actual behavior
- loggar eller bevis
- möjlig root cause

### 5. QA Report Builder
Skapar och uppdaterar QA-dokumentation.

Den ska skapa tydliga rapporter som visar:

- vad som testades
- hur många tester som kördes
- vad som passade
- vad som failade
- vilka buggar som hittades
- vilka risker som finns kvar
- om testningen är godkänd eller inte godkänd

## MVP-output
Första versionen ska kunna skapa eller uppdatera dessa filer:

- `qa/testplan.md`
- `qa/testspecifikation.md`
- `qa/testresultat.md`
- `qa/buggrapporter.md`
- `qa/index.html`

`qa/index.html` ska visa en enkel visuell rapport över teststatus, testomfattning, buggar och viktiga kommandon.

## Regler

Agenten ska alltid följa dessa regler:

- ändra inte applikationskod
- skapa bara test, testdata, mockar, fixtures, dokumentation, buggrapporter och QA-verktyg
- skriv enkel och tydlig svenska
- dokumentera expected vs actual vid fel
- koppla varje testfall till krav, user story eller process-steg
- dokumentera risknivå när fel hittas
- skapa stabila tester utan hårdkodade sleeps
- använd tydliga assertions
- undvik duplicerad testkod
- skriv dokumentation så att den går att förstå snabbt

## Första steg

1. Samla Qlerify-export eller kravunderlag.
2. Identifiera user stories, business rules och Given-When-Then.
3. Skapa test conditions.
4. Skapa testspecifikation.
5. Skapa testfall med prioritet och testtyp.
6. Skapa buggrapportmall.
7. Skapa QA-dashboard i `qa/index.html`.
8. Kör tester och uppdatera testresultat.

## Definition of Done

Planen är klar när:

- dokumentet finns i repo-roten
- planen är skriven på svenska
- agenttypen är tydlig
- alla huvuddelar är beskrivna
- MVP-output är listad
- reglerna säger tydligt att bara QA/testrelaterade filer får ändras
- filen är redo att committas

## PowerShell-kommandon

Initiera repo:

```powershell
cd "D:\LIA 2"
git init
```

Kontrollera filen:

```powershell
Get-Content "D:\LIA 2\Qlerify-Testagent-Plan.md"
git status
```

Commit:

```powershell
git add "Qlerify-Testagent-Plan.md"
git commit -m "Lägg till plan för Qlerify testagent"
```

Push när remote finns:

```powershell
git remote add origin <repo-url>
git push -u origin master
```
