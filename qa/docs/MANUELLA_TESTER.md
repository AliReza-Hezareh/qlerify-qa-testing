# Manuella tester - Qlerify

- Datum: 2026-09-28
- Miljö: Publika sidor på `www.qlerify.com` och `app.qlerify.com`, Windows, inbyggd webbläsare.
- QA-ansvarig: Ali Reza Hezareh.

## Kontrollerade flöden

`Pass` betyder att det förväntade resultatet syntes vid denna kontroll. Inget konto skapades och inget kontaktformulär skickades.

| ID | Kontroll | Förväntat | Faktiskt resultat | Status |
| --- | --- | --- | --- | --- |
| SMK-01 | Klicka `Try for free` på [startsidan](https://www.qlerify.com/). | Registreringen öppnas. | `app.qlerify.com/signup` öppnades. | Pass |
| PRI-01 | Växla `Monthly` till `Yearly` på [prissidan](https://www.qlerify.com/pricing). | Pris och period ändras. | Basic ändrades från 25 USD/månad till 250 USD/år. Pro ändrades från 40 USD/månad till 400 USD/år. | Pass |
| AUTH-01 | Klicka `Log in` med tomma fält på [inloggningen](https://app.qlerify.com/login). | Båda obligatoriska fälten visar fel. | `Required.` visades för e-post och lösenord. | Pass |
| AUTH-02 | Ange `inte-en-adress` och testtext som lösenord. Klicka `Log in`. | Felaktig e-post stoppas. | `Invalid e-mail.` visades. | Pass |
| AUTH-03 | Klicka `Request reset password` med tom e-post på [återställningssidan](https://app.qlerify.com/reset-password). | E-post krävs. | `Required.` visades. | Pass |
| AUTH-04 | Ange `ogiltig` på återställningssidan och klicka på knappen. | Felaktig e-post stoppas. | `Invalid e-mail.` visades. | Pass |
| NAV-01 | Öppna menyn på startsidan i ett smalt webbläsarfönster. | Navigationslänkar visas. | Product, Pricing, Customer stories, Resources och Blog visades. | Pass |
| CNT-01 | Öppna [kontaktsidan](https://www.qlerify.com/contact) och vänta på formuläret. | Formuläret visas. | Fält för namn, e-post och ärende samt en Submit-knapp visades. | Pass |

Resultat 2026-09-28: 8 Pass, 0 Fail, 0 Blocked. Kontrollerna ovan är begränsade till de angivna stegen.

## Kontroller 2026-09-29

- Miljö: Windows, inbyggd webbläsare med smalt fönster och separat Chromium-kontroll med skrivbordsbredd. Endast publika sidor och fältvalidering testades. Inget konto skapades och inget ärende skickades.

| ID | Kontroll | Förväntat | Faktiskt resultat | Status |
| --- | --- | --- | --- | --- |
| HOM-02 | Välj `CRM` bland exemplen på [startsidan](https://www.qlerify.com/). | CRM-exemplet ersätter E-commerce. | `CRM` valdes och stegen `Created lead`, `Converted lead` och `Created opportunity` visades. | Pass |
| REG-02 | Skriv `inte-en-adress` i e-post på [registreringen](https://app.qlerify.com/signup) och lämna fältet. | Felaktig e-post markeras. | `Invalid e-mail` visades och `Create account` var inaktiv. | Pass |
| REG-04A | Skriv tre tecken som lösenord och lämna fältet. | Minimilängden förklaras. | `Password must be at least 8 characters long` visades. | Pass |
| AUTH-06A | Klicka `Confirm` på [bekräftelsesidan](https://app.qlerify.com/confirm) med tom e-post och tom kod. | Båda obligatoriska fälten stoppas. | `Required.` visades för både e-post och kod. | Pass |
| AUTH-06B | Skriv `inte-en-adress` som e-post och klicka `Confirm` utan kod. | E-postformat och saknad kod markeras. | `Invalid e-mail.` och `Required.` visades. | Pass |
| CNT-02A | Klicka `Submit` på [kontaktsidan](https://www.qlerify.com/contact) med tomma fält. | Obligatorisk e-post stoppas. | `Please complete this required field` visades vid e-post; formuläret förblev öppet. | Pass |
| CNT-02B | Skriv `inte-en-adress` som e-post och klicka `Submit`. | Ogiltig e-post stoppas. | `Email must be formatted correctly` visades; formuläret förblev öppet. | Pass |
| PUB-01 | Öppna det [publika Cart-arbetsflödet](https://app.qlerify.com/workflow/0cbc80c0-a79b-4920-90db-c6e7d9077e04/75d19947-1b0a-4e4b-a8dd-570862681788) utan inloggning. | Arbetsflödet kan läsas och läsläge framgår. | Flödet laddades med `View only mode` och `Log in to clone this workflow`. Skrivskyddet prövades inte med en ändring. | Pass |
| HELP-01A | Välj `Step by step guide` på [hjälpsidan](https://www.qlerify.com/resources). | Guiden för projektstart visas. | `Create Project` och fyra steg för ett nytt projekt visades. | Pass |
| HELP-01B | Välj `Export` på hjälpsidan. | Exportguiden visas. | Steg för CSV, JSON och PDF samt länkar för Jira och Azure DevOps visades. | Pass |
| PRI-02 | Växla mellan `Monthly` och `Yearly` på [prissidan](https://www.qlerify.com/pricing) och kontrollera Basic, Pro och länkar. | Rätt pris, period och registreringsadress visas. | Basic: 25 USD/månad och 250 USD/år. Pro: 40 USD/månad och 400 USD/år. Båda årslänkarnas mål var registreringen. | Pass |
| WEB-01 | Rulla längst ner på [bloggsidan](https://www.qlerify.com/blog). | Sidan slutar efter ordinarie sidfot. | En generisk sektion med `Grow your business` och `Start Now` visas efter sidfoten. [BUG-001](../bugs/BUG-001.md). | Fail |
| WEB-02 | Rulla längst ner på [artikeln om legacy modernization](https://www.qlerify.com/post/ai-legacy-modernization-reverse-engineer-ecommerce-cart). | Ingen intern markör visas efter sidfoten. | `///SOCIAL SHARE` visas som sidtext. Samma text finns även på [artikeln om MCP](https://www.qlerify.com/post/how-to-use-mcp-with-qlerify-plugins). [BUG-002](../bugs/BUG-002.md). | Fail |
| CNT-03 | Klicka telefonnumret under `Contact information` på [kontaktsidan](https://www.qlerify.com/contact). | En telefonåtgärd öppnas. | Länken pekar på `#`; sidan stannar på samma adress och ingen telefonåtgärd startar. [BUG-003](../bugs/BUG-003.md). | Fail |

Resultat 2026-09-29: 11 Pass, 3 Fail, 0 Blocked. Totalt dokumenterat: 19 Pass, 3 Fail, 0 Blocked.

## Nästa testfall

| ID | Prioritet | Steg | Förväntat resultat | Status |
| --- | --- | --- | --- | --- |
| REG-01 | Hög | Öppna [registreringen](https://app.qlerify.com/signup) och lämna obligatoriska fält tomma. | Konto kan inte skapas; felen är tydliga. | Ej körd |
| REG-03 | Medel | Prova 40 respektive 41 tecken i förnamn och kontrollera hela valideringsflödet med ett godkänt testkonto. | Maxgränsen 40 tillämpas innan konto skapas. | Ej klar |
| REG-04B | Medel | Växla visa/dölj med ett testlösenord. | Endast synligheten ändras; värdet behålls. | Ej körd |
| REG-05 | Hög | Gå genom formuläret med Tab och kontrollera samtyckesrutan. | Fokus syns, ordningen är logisk och rutan har ett begripligt namn. | Ej körd |
| AUTH-05 | Hög | Kontrollera återställning med ett godkänt testkonto. | Återställningsflödet fungerar utan att röja vilka adresser som har konto. | Kräver testkonto |
| AUTH-06C | Hög | Kontrollera felaktig och utgången registreringskod för ett godkänt testkonto. | Fel visas utan att konto bekräftas. | Kräver testkonto |
| AUTH-07 | Medel | Begär en ny registreringskod för ett godkänt testkonto. | Ny kod skickas enligt förväntat flöde; upprepade begäranden begränsas. | Kräver testkonto |
| CNT-02C | Medel | Kontrollera ärendetext och valfri kommunikationsruta på kontaktsidan. | Obligatoriska fält markeras korrekt och samtycket ändras inte automatiskt. | Ej körd |
| PRI-03 | Medel | Jämför pris, rabatt och provperiod mot FAQ på [prissidan](https://www.qlerify.com/pricing). | Uppgifterna är konsekventa. | Ej körd |
| HELP-01C | Medel | Öppna hjälpens övriga flikar, bland annat FAQ och User Story Mapping. | Rätt avsnitt visas och kan nås med tangentbord. | Ej körd |
| HELP-02 | Medel | Undersök konsolfelet på hjälpsidan i Chrome och Edge och kontrollera berörda funktioner. | Inga JavaScript-fel och inga trasiga kontroller. | Ej körd |
| BLOG-03 | Medel | Öppna en artikel och använd innehållslänkar samt `Copy link to clipboard`. | Rätt avsnitt nås och kopierad länk pekar på artikeln. | Ej körd |
| PUB-02 | Hög | Kontrollera läsläge i ett eget delat testflöde. | Gäst kan läsa men inte ändra flöde, modell eller historik. | Kräver eget testflöde |
| PUB-03 | Medel | Öppna entiteter, backlog och User Story Map i ett publikt testflöde. | Varje vy visar rätt data utan att läsläget försvinner. | Kräver eget testflöde |
| NAV-02 | Medel | Kontrollera interna länkar i sidfot på startsida, blogg och pris. | Varje länk öppnar rätt sida utan trasig adress. | Ej körd |
| RESP-01 | Medel | Kontrollera blogg, hjälp och publikt flöde i mobilbredd samt på skrivbord. | Text och kontroller är läsbara utan överlappning. | Ej körd |
| A11Y-01 | Medel | Navigera prisflikar, hjälpflikar och formulär med tangentbord. | Fokus syns och Tab-ordningen följer innehållet. | Ej körd |
| APP-01 | Hög | Skapa ett projekt från instrumentpanelen. | Projektet visas under senaste projekt. | Kräver testkonto |
| APP-02 | Hög | Skapa ett arbetsflöde i projektet. | Arbetsflödet visas på projektets sida. | Kräver testkonto |
| APP-03 | Hög | Lägg till en startpunkt, bana och händelse i arbetsflödet. | Delarna sparas och visas efter omladdning. | Kräver testkonto |
| APP-04 | Hög | Skapa, ändra och ta bort ett kort kopplat till en händelse. | Ändringar visas korrekt och borttaget kort försvinner. | Kräver testkonto |
| APP-05 | Medel | Exportera ett testprojekt i ett tillgängligt format. | Filen innehåller förväntade projektdata. | Kräver testkonto |
| APP-06 | Medel | Öppna User Story Map och filtrera på release. | Endast valda releaser visas. | Kräver testkonto |

Källa för flödena efter inloggning: [Qlerifys hjälp och steg-för-steg-guide](https://www.qlerify.com/resources).

## Observation att följa upp

På registreringssidan står `At most 40 characters` vid förnamn. Vid en kontroll gick det att skriva 41 tecken och lämna fältet utan synligt fel. Det är ännu inte kontrollerat om formuläret stoppar registreringen senare. Därför är detta inte markerat som en bekräftad bugg.

Vid laddning av hjälpsidan i Chromium noterades `TypeError: Cannot read properties of null (reading 'addEventListener')` på `resources:243:41`. Flikarna `Step by step guide` och `Export` fungerade i samma körning. Påverkan på andra funktioner är inte fastställd, så detta är ännu inte en bekräftad bugg.
