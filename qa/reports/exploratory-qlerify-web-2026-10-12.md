# Exploratory test - Qlerify webb

- Datum: 2026-10-12
- Testtyp: Exploratory black-box test
- Miljö: Qlerify live-webb i webbläsare
- QA ansvarig: Ali Reza Hezareh
- Kodaccess: Nej
- Status: Flera fel hittades

## Kort sammanfattning

Jag klickade runt på Qlerifys publika sidor utan att använda GitHub eller applikationskod. Fokus var att hitta synliga fel som en vanlig användare kan märka direkt.

Testet omfattade:

- Contact
- Blog
- Resources
- Pricing
- Login
- Signup
- Reset password

## Resultat

| ID | Sida | Severity | Vad hittades | Risk |
|---|---|---|---|---|
| WEB-001 | Contact | Low | Telefonnumret i `Contact information` länkar till `#`. Klick gör ingen telefonåtgärd. | Användare kan inte ringa genom länken. |
| WEB-002 | Blog | Low | Bloggsidan visar en generisk mallsektion med `Grow your business` och `Start Now`. | Sidan ser ofärdig och oprofessionell ut. |
| WEB-003 | Reset password | Low | Texten innehåller stavfel: `registsration` i stället för `registration`. | Ger dåligt intryck i auth-flödet. |
| WEB-004 | Signup | Medium | `I agree to Terms...` fungerar som en checkbox men exponeras inte som checkbox i accessibility-trädet. | Skärmläsare och tangentbordsanvändare kan få problem. |
| WEB-005 | Resources | Medium | Console error hittades: `Cannot read properties of null (reading 'addEventListener')`. | Kan betyda trasig JavaScript-logik på sidan. |
| WEB-006 | Startsida | Low | Länkar med `href="#"` hittades för `Scroll list of methods left/right`. | Kan skapa trasig eller oklar navigation om knapparna inte hanteras korrekt. |

## Det som fungerade

| Område | Resultat |
|---|---|
| Pricing | `Monthly` och `Yearly` gick att växla. |
| Login | Tomma fält gav `Required`. |
| Signup | Fel e-post gav `Invalid e-mail`. |
| Reset password | Tom e-post gav `Required`. |
| Signup sida | Sidan laddade utan krasch. |

## Viktigaste buggar att visa först

1. Contact: telefonlänken använder `#` i stället för `tel:`.
2. Blog: fel mallsektion visas efter innehållet.
3. Reset password: stavfel i viktig auth-text.

## Reproduktion

### WEB-001 Contact phone link

1. Öppna `https://www.qlerify.com/contact`.
2. Scrolla till `Contact information`.
3. Klicka på `+46 (0)8 503 556 55`.

Expected: En telefonåtgärd öppnas via `tel:`.

Actual: Länken pekar på `#` och inget användbart händer.

### WEB-002 Blog template section

1. Öppna `https://www.qlerify.com/blog`.
2. Scrolla längst ner på sidan.

Expected: Bloggsidan slutar med korrekt sidfot och inget extra mallinnehåll.

Actual: Sektionen `Grow your business` och `Start Now` visas.

### WEB-003 Reset password typo

1. Öppna `https://app.qlerify.com/reset-password`.
2. Läs texten under rubriken `Reset password`.

Expected: Texten använder korrekt stavning: `registration`.

Actual: Texten visar `registsration`.

### WEB-004 Signup accessibility

1. Öppna `https://app.qlerify.com/signup`.
2. Kontrollera `I agree to the Terms of Service & Privacy Policy`.
3. Kontrollera hur kontrollen exponeras för tillgänglighet.

Expected: Kontroll ska exponeras som checkbox med tydligt namn.

Actual: Den går att klicka men syns inte som checkbox i accessibility-trädet.

### WEB-005 Resources console error

1. Öppna `https://www.qlerify.com/resources`.
2. Öppna utvecklarkonsolen.
3. Ladda om sidan och klicka på några tabs.

Expected: Inga JavaScript-fel visas.

Actual: Console error visas: `Cannot read properties of null (reading 'addEventListener')`.

## Nästa steg

- Ta screenshot för varje fel.
- Skapa separata buggrapporter för de fel som ska rapporteras vidare.
- Kör samma test i Chrome och Edge.
- Testa mobilvy för Contact, Blog, Signup och Reset password.
