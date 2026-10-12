# Testspecifikation - Qlerify publika smoke tests

## 1. Test Design Overview
Testerna är black-box och körs mot publika Qlerify-sidor. Fokus är snabb riskkontroll: laddning, synligt innehåll, formulärvalidering och tydliga UI-fel.

Prioritet:
- Publika sidor ska inte krascha.
- Formulär ska stoppa fel input.
- Kontaktväg ska vara synlig.

## 2. Test Conditions
- Sidor laddar utan serverfel.
- Body och huvudtext syns.
- Pricing visar monthly/yearly.
- Contact har fält och submit.
- Contact stoppar tomma fält och ogiltig e-post.
- Contact hanterar lång text och specialtecken.
- Telefonlänk är klickbar om telefonnummer visas.
- Auth-sidor visar validering för fel input.

## 3. Test Cases

| Test Case ID | Titel | Beskrivning | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WEB-001 | Startsida laddar | Kontrollera att startsidan öppnas. | Internet finns. | 1. Öppna startsidan 2. Kontrollera body 3. Kontrollera text | URL `/` | Ingen krasch, text och knappar syns | High | Smoke |
| WEB-002 | Pricing monthly/yearly | Kontrollera pricing och toggle. | Pricing är publik. | 1. Öppna pricing 2. Kontrollera Monthly 3. Kontrollera Yearly 4. Klicka Yearly | URL `/pricing` | Prisinnehåll finns kvar och sidan blir inte tom | High | Functional |
| WEB-003 | Contact formulär syns | Kontrollera kontaktformulär. | Contact är publik. | 1. Öppna contact 2. Kontrollera namn/e-post/message/submit | URL `/contact` | Namn, e-post, message och submit finns | High | Smoke |
| WEB-004 | Blog laddar | Kontrollera bloggsidan. | Blog är publik. | 1. Öppna blog 2. Kontrollera innehåll 3. Kontrollera footer | URL `/blog` | Bloggen laddar utan konstiga sektioner efter footer | Medium | UI |
| AUTH-001 | Login tomma fält | Kontrollera login-validering. | Login är publik. | 1. Öppna login 2. Klicka submit tomt | Tom input | Felmeddelande eller native validering visas | High | Negative |
| AUTH-002 | Signup ogiltig e-post | Kontrollera signup-validering. | Signup är publik. | 1. Öppna signup 2. Skriv fel e-post 3. Klicka submit | `fel-epost` | Felmeddelande visas | High | Negative |
| AUTH-003 | Reset tom e-post | Kontrollera reset-validering. | Reset är publik. | 1. Öppna reset password 2. Klicka submit tomt | Tom input | Felmeddelande visas | High | Negative |
| CONTACT-001 | Contact tomma fält | Formulär får inte skickas tomt. | Contact är publik. | 1. Öppna contact 2. Klicka submit tomt | Tom input | Felmeddelande eller native validering visas | High | Negative |
| CONTACT-002 | Contact fel e-post | E-post ska valideras. | Contact är publik. | 1. Fyll fel e-post 2. Klicka submit | `fel-epost` | Formuläret stoppar input | High | Validation |
| CONTACT-003 | Contact lång text | Message ska tåla lång text. | Contact är publik. | 1. Fyll 5000 tecken i message | 5000 tecken | Ingen krasch eller freeze | Medium | Edge case |
| CONTACT-004 | Contact specialtecken | Specialtecken ska behandlas säkert. | Contact är publik. | 1. Fyll script och specialtecken | `<script>alert(1)</script> åäö` | Ingen script-exekvering eller krasch | High | Security |
| CONTACT-005 | Contact telefonlänk | Telefonnummer ska vara klickbart om det visas. | Contact är publik. | 1. Leta telefonnummer 2. Kontrollera tel-länk | Telefontext | `tel:` används om telefonnummer visas | Medium | Functional |

## 4. Traceability

| Krav | Testfall |
| --- | --- |
| Publika sidor ska laddas | WEB-001, WEB-002, WEB-003, WEB-004 |
| Pricing ska visa prisinformation | WEB-002 |
| Kontaktformulär ska fungera | WEB-003, CONTACT-001, CONTACT-002, CONTACT-003, CONTACT-004, CONTACT-005 |
| Auth-formulär ska validera input | AUTH-001, AUTH-002, AUTH-003 |

## 5. Riskbaserade testfall
- CONTACT-004 täcker XSS-risk i meddelandefält.
- AUTH-001 till AUTH-003 täcker svag formulärvalidering.
- WEB-004 täcker layoutfel efter footer.
- CONTACT-003 täcker prestanda- och UI-risk vid stor input.
