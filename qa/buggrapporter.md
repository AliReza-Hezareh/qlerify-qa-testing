# Buggrapporter - Qlerify black-box

Körningsdatum: 2026-10-12
Miljö: Windows, Playwright, Chromium desktop och mobile, publik webb
Senaste körning: 36 tester, 21 Pass, 15 Fail

## BUG-CONTACT-001 - Kontaktformulär är inte interaktivt

Severity: High
Priority: High
Relaterat test-ID: WEB-003, CONTACT-001, CONTACT-002, CONTACT-003, CONTACT-004
Sida: `https://www.qlerify.com/contact`

### Steps to reproduce
1. Öppna `https://www.qlerify.com/contact`.
2. Kontrollera kontaktformuläret.
3. Försök klicka eller fylla i namn, e-post och message.
4. Försök klicka submit.

### Expected behavior
Kontaktformuläret ska visa interaktiva fält för namn, e-post och message. Submit-knappen ska gå att klicka. Tomma fält och ogiltig e-post ska ge tydlig validering.

### Actual behavior
Fälten finns i DOM men är inte synliga/interaktiva för browsern. Playwright rapporterar att namn-, e-post- och messagefält är `hidden`. Submit-knappen är också `hidden` och disabled i testkörningen.

### Bevis
- `test-results/public-smoke-Kontaktformul-e559c-it-finns-och-är-interaktiva-chromium-desktop/test-failed-1.png`
- `test-results/public-smoke-Kontaktformul-52fca-TACT-001-tomma-fält-stoppas-chromium-desktop/test-failed-1.png`
- Fel: `Namnfält ska vara synligt`
- Fel: `Submit-knapp ska vara synligt`
- Fel: `E-postfält ska vara synligt`
- Fel: `Message-fält ska vara synligt`

### Risk
Användare kan fastna på kontaktsidan och inte kunna skicka meddelande. Detta är extra riskabelt eftersom kontaktflödet är en publik väg till support, demo och frågor.

### Möjlig root cause
Formuläret kan vara dolt, renderat med fel layout, ligga i ett lager som inte är interaktivt, eller påverkas av extern script/rendering.

### Status
Open

## BUG-CONTACT-002 - Telefonnummer visas men saknar klickbar tel-länk

Severity: Medium
Priority: Medium
Relaterat test-ID: CONTACT-005
Sida: `https://www.qlerify.com/contact`

### Steps to reproduce
1. Öppna `https://www.qlerify.com/contact`.
2. Leta efter telefonnummer i kontaktsektionen.
3. Kontrollera om telefonnumret är en länk med `tel:`.

### Expected behavior
Om telefonnummer visas ska det vara klickbart med `tel:` så mobilanvändare kan ringa direkt.

### Actual behavior
Telefonnummer visas, men testet hittar ingen `tel:`-länk.

### Bevis
- `test-results/public-smoke-Kontaktformul-02059-tel-format-om-telefon-visas-chromium-desktop/test-failed-1.png`
- Fel: `Telefonnummer ska vara klickbart med tel:-länk om det visas`

### Risk
Mobilanvändare får sämre kontaktflöde och kan behöva kopiera numret manuellt.

### Möjlig root cause
Telefonnumret är troligen renderat som vanlig text istället för ankarlänk.

### Status
Open

## BUG-WEB-004 - Bloggsidan saknar tydlig footer/contentinfo-landmark

Severity: Low
Priority: Medium
Relaterat test-ID: WEB-004
Sida: `https://www.qlerify.com/blog`

### Steps to reproduce
1. Öppna `https://www.qlerify.com/blog`.
2. Kontrollera sidans footer längst ned.
3. Kontrollera om footer finns som `<footer>` eller `role="contentinfo"`.

### Expected behavior
Bloggsidan ska ha tydlig footer eller contentinfo-landmark. Det hjälper struktur, navigation och tillgänglighet.

### Actual behavior
Testet hittade ingen footer/contentinfo-landmark.

### Bevis
- `test-results/public-smoke-Publika-smoke-6b76a-dmark-utan-trasig-bottenyta-chromium-desktop/test-failed-1.png`
- Fel: `element(s) not found`

### Risk
Låg funktionell risk, men tillgänglighet och semantisk struktur är svagare.

### Möjlig root cause
Footer kan saknas semantiskt eller vara byggd med generiska div-element.

### Status
Open

## BUG-AUTH-002 - Signup med ogiltig e-post failar på mobile Chrome

Severity: Medium
Priority: Medium
Relaterat test-ID: AUTH-002
Sida: `https://app.qlerify.com/signup`

### Steps to reproduce
1. Öppna `https://app.qlerify.com/signup` i mobile Chrome viewport.
2. Fyll e-postfält med `fel-epost`.
3. Klicka submit.
4. Kontrollera om e-postfältet stoppar ogiltig e-post.

### Expected behavior
Signup ska stoppa ogiltig e-post och visa validering.

### Actual behavior
Testet failade på mobile Chrome. Playwright rapporterade timeout och att ogiltig e-post inte stoppades enligt assertion.

### Bevis
- `test-results/public-smoke-Auth-negativa-2fd44-tig-e-post-visar-validering-mobile-chrome/test-failed-1.png`
- Fel: `Signup ska stoppa ogiltig e-post`
- Fel: `Test timeout of 30000ms exceeded`

### Risk
Mobilanvändare kan få otydlig validering vid signup. Felet behöver verifieras manuellt innan det klassas som produktfel.

### Möjlig root cause
Valideringen kan skilja sig mellan desktop och mobil viewport, eller testet kan träffa fel fält/knapp i mobil layout.

### Status
Open - behöver manuell verifiering
