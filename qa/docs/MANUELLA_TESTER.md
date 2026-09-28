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

Resultat: 8 Pass, 0 Fail, 0 Blocked. Kontrollerna ovan är begränsade till de angivna stegen.

## Nästa testfall

| ID | Prioritet | Steg | Förväntat resultat | Status |
| --- | --- | --- | --- | --- |
| REG-01 | Hög | Öppna [registreringen](https://app.qlerify.com/signup) och lämna obligatoriska fält tomma. | Konto kan inte skapas; felen är tydliga. | Ej körd |
| REG-02 | Hög | Fyll i ogiltig e-post och kontrollera valideringen. | E-postadressen godtas inte. | Ej körd |
| REG-03 | Medel | Prova 40 respektive 41 tecken i förnamn. | Maxgränsen 40 tillämpas och ett begripligt fel visas vid för långt namn. | Ej klar |
| REG-04 | Hög | Kontrollera lösenordskrav och visa/dölj-knappen med testtext. | Kraven förklaras; knappen ändrar bara synligheten. | Ej körd |
| REG-05 | Hög | Gå genom formuläret med Tab och kontrollera samtyckesrutan. | Fokus syns, ordningen är logisk och rutan har ett begripligt namn. | Ej körd |
| AUTH-05 | Hög | Kontrollera återställning med ett godkänt testkonto. | Återställningsflödet fungerar utan att röja vilka adresser som har konto. | Kräver testkonto |
| CNT-02 | Medel | Kontrollera tomt ärende, ogiltig e-post och valfri kommunikationsruta på kontaktsidan. | Formuläret visar rätt fel utan att ändra valfritt samtycke. | Ej körd |
| APP-01 | Hög | Skapa ett projekt från instrumentpanelen. | Projektet visas under senaste projekt. | Kräver testkonto |
| APP-02 | Hög | Skapa ett arbetsflöde i projektet. | Arbetsflödet visas på projektets sida. | Kräver testkonto |
| APP-03 | Hög | Lägg till en startpunkt, bana och händelse i arbetsflödet. | Delarna sparas och visas efter omladdning. | Kräver testkonto |
| APP-04 | Hög | Skapa, ändra och ta bort ett kort kopplat till en händelse. | Ändringar visas korrekt och borttaget kort försvinner. | Kräver testkonto |
| APP-05 | Medel | Exportera ett testprojekt i ett tillgängligt format. | Filen innehåller förväntade projektdata. | Kräver testkonto |
| APP-06 | Medel | Öppna User Story Map och filtrera på release. | Endast valda releaser visas. | Kräver testkonto |

Källa för flödena efter inloggning: [Qlerifys hjälp och steg-för-steg-guide](https://www.qlerify.com/resources).

## Observation att följa upp

På registreringssidan står `At most 40 characters` vid förnamn. Vid en kontroll gick det att skriva 41 tecken och lämna fältet utan synligt fel. Det är ännu inte kontrollerat om formuläret stoppar registreringen senare. Därför är detta inte markerat som en bekräftad bugg.
