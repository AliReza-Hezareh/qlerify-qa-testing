# Exploratory test – Qlerify Live och Modeler

- Datum: 2026-10-19
- Miljö: Publika Qlerify-webben och inloggad Qlerify-app i webbläsare
- Testtyp: Utforskande användartest och smoke test
- Testare: Ali Reza Hezareh
- Status: 1 buggrapport dokumenterad; övriga kontroller i scope godkända

## Sammanfattning

Jag öppnade den publika inloggningsadressen, fortsatte från en redan inloggad session och kontrollerade dashboarden samt ett befintligt arbetsflöde. Jag testade flikbyten, uppdatering av sidan och att skrivskyddat läge stoppar ändringar. Ingen data skapades eller ändrades.

## Testresultat

| ID | Kontroll | Resultat | Kommentar |
|---|---|---|---|
| QW-001 | Öppna `https://qlerify.com/login` | Fail | Sidan visar `Page Not Found`. Se buggrapport nedan. |
| QW-002 | Öppna appens loginlänk | Pass | Sidans egen länk öppnade `https://app.qlerify.com/login` med e-post- och lösenordsfält. Inga uppgifter fylldes i av testaren. |
| QW-003 | Öppna dashboard i befintlig session | Pass | Dashboarden laddade och visade ett befintligt arbetsflöde. |
| QW-004 | Öppna arbetsflödet | Pass | Flödet öppnades i `View only mode`. |
| QW-005 | Byta mellan `Entities` och `Read Models` | Pass | Vald flik och innehåll visades. URL:en uppdaterades med `selectedTab`. |
| QW-006 | Uppdatera sidan på `Read Models` | Pass | Efter att sidan laddat klart visades samma flik och dess innehåll. |
| QW-007 | Kontrollera ändringskontroller i skrivskyddat läge | Pass | Synliga kontroller för ändringar var inaktiverade. Ingen ändring utfördes. |

## Buggrapport QW-001

- **Titel:** `qlerify.com/login` visar sidan hittades inte
- **Severity:** Low
- **Priority:** P2
- **Status:** Öppen, behöver bekräftas av produktansvarig
- **Miljö:** `https://qlerify.com/login`, webbläsare, 2026-10-19

### Steg för att återskapa

1. Öppna `https://qlerify.com/login`.
2. Vänta tills sidan har laddat.

### Förväntat resultat

Inloggningssidan öppnas eller adressen skickar användaren vidare till appens inloggning.

### Faktiskt resultat

Sidan visar `Page Not Found` och texten `The page you are looking for doesn't exist or has been moved.` Sidans länk `Log in` går till `https://app.qlerify.com/login`, där ett inloggningsformulär visas.

### Påverkan och risk

En användare som följer instruktionen att öppna `qlerify.com/login` kommer inte direkt till inloggningen. Appens inloggningssida går att nå via sidans `Log in`-länk. Grundorsak är inte fastställd.

### Bevis

Feltexten observerades direkt på `qlerify.com/login`. Ingen skärmbild eller nätverkslogg sparades i rapporten.

## Omfattning och begränsningar

- Testade publika inloggningsadressens utfall och befintligt arbetsflöde i en redan inloggad session.
- Testade inte lösenordsinloggning, CRUD, kloning, API, behörighetsbypass eller flera användare.
- Arbetsflödet var skrivskyddat. Inga data ändrades.
- Rotorsak är inte analyserad eftersom testet gjordes utan åtkomst till applikationskod.
