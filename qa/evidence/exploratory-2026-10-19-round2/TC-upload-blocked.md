# R2-041 – filuppladdning

Datum: 2026-10-19. Status: Blocked.

## Testobjekt och godkännande

Arbetsflöde: QA 2026-10-19 – flöden och edge cases 2.

Kort: QA R1 – Skapa order ÅÄÖ 🧪. Kort-ID: 9fee94ed-b74b-46bf-bcc4-d9481f0bbe23.

Båda nedanstående filer godkändes uttryckligen för uppladdning på detta kort.

| Fil | Storlek | Innehåll |
| --- | --- | --- |
| [qa-åäö.txt](../../fixtures/attachments/qa-åäö.txt) | 28 byte | Bara QA-testdata ÅÄÖ 🧪, UTF-8 utan BOM och utan avslutande radbrytning |
| [qa-empty.txt](../../fixtures/attachments/qa-empty.txt) | 0 byte | Tom fil |

## Utfört försök

1. Öppnade det befintliga QA-arbetsflödet och backloggen i den befintliga inloggade sessionen.
2. Öppnade Attachments på rätt R1-kort. Den tidigare testlänken fanns kvar.
3. Klickade på uppladdningsytan. Filväljaren tillät en fil åt gången.
4. Valde qa-åäö.txt som första fil.
5. Webbläsarverktygets säkerhetskontroll nekade filåtkomsten före uppladdning. Meddelandet angav att uppladdningsbehörighet till app.qlerify.com inte hade beviljats.
6. Stoppade försöket. Ingen fil skickades och den tomma filen provades inte.

## Förväntat och faktiskt resultat

Förväntat för den vanliga textfilen: den visas som bilaga på rätt kort efter uppladdning och finns kvar efter omladdning. Filnamn och innehåll ska kunna kontrolleras.

För den tomma filen ska resultatet dokumenteras som accepterad tom bilaga eller tydligt avvisad fil. Något produktkrav om noll byte hittades inte. Acceptans av en tom fil är därför inte automatiskt en bugg.

Faktiskt: uppladdningen nådde inte ett verifierbart produktresultat. Filnamn, innehåll, nedladdning och lagring efter omladdning är inte testade. Ingen ny produktbugg registrerades.

Qlerifys [beskrivning av fil- och länkbilagor på kort](https://www.qlerify.com/simple-process-mapping) kontrollerades den 2026-10-19. Den anger ingen särskild regel för tomma filer.

![Bilagevyn efter det stoppade försöket](TC-upload-blocked.jpg)

Bilden visar appens bilagevy. Verktygets säkerhetsmeddelande visas inte i appen och syns därför inte i bilden.
