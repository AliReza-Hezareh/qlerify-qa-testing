# Testrapport - Qlerify black-box smoke

## 1. Sammanfattning
Publika smoke tests kördes mot Qlerifys publika webb och auth-sidor.

Övergripande resultat: **Ej godkänd** för releasebeslut inom testat scope eftersom kontaktformuläret inte är interaktivt i browser-test och flera viktiga valideringstester failar.

## 2. Test Scope
Ingick:
- Startsida
- Pricing
- Contact
- Blog
- Login
- Signup
- Reset password

Ingick inte:
- Inloggat organisationsflöde
- API-tester
- Databas
- Lokal testmiljö
- Google Drive-dokumentation

## 3. Test Execution Summary

| Mått | Antal |
| --- | ---: |
| Totalt antal testfall | 36 |
| Passed | 21 |
| Failed | 15 |
| Blocked | 0 |
| Ej körda | 0 |

## 4. Defect Summary

| Severity | Antal | Kommentar |
| --- | ---: | --- |
| Critical | 0 | Inga critical verifierade i denna körning |
| High | 1 | Kontaktformulär är inte interaktivt |
| Medium | 2 | Telefonlänk saknas och mobile signup-validering failar |
| Low | 1 | Blogg saknar footer/contentinfo-landmark |

## 5. Kvalitetsbedömning
Systemet är inte godkänt inom testat publikt scope. Kontaktflödet är för riskabelt eftersom användare kan fastna när de försöker kontakta Qlerify.

## 6. Avvikelser från testplan
Ingen separat testmiljö användes. Testerna kördes mot publik live-webb eftersom annan miljö inte är bekräftad.

## 7. Rekommendationer
No-Go för kontaktformuläret tills `BUG-CONTACT-001` är utredd.

Nästa QA-steg är manuell utforskande testning av organisationsskapande efter login.
