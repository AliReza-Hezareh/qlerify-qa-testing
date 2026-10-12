# Manuell utforskande testning - skapa organisation i Qlerify

## Kontext
QA ansvarig: Ali Reza Hezareh
Handledare: Nikolaus Varzakakos
Lärare: Marta
Datum: 2026-10-12

## Verifierad åtkomst
- Google Workspace-konto finns: `ali@qlerify.com`.
- Inloggning i Qlerify på `https://app.qlerify.com` fungerar enligt uppgift från testaren.
- Efter inloggning visas dashboard med `Create your first organisation` och `New Organisation` enligt uppgift från testaren.

## Saknad information
- GitHub-åtkomst är inte bekräftad.
- Lokal testmiljö är inte bekräftad.
- Separat testmiljö är inte bekräftad.
- Kravlista är inte bekräftad.
- API-dokumentation är inte bekräftad.
- Dokumentationen i Google Drive-mappen `Introduction` är inte genomgången ännu.

## Testmål
Målet är att testa första användarflödet efter login: skapa en egen organisation i Qlerify.

Fokus är att hitta:
- var man fastnar
- vilka steg som är otydliga
- om felmeddelanden är begripliga
- om användaren förstår nästa steg
- om organisationen skapas korrekt

## Testcharter

| ID | Område | Vad testas | Expected |
| --- | --- | --- | --- |
| ORG-001 | Dashboard | `Create your first organisation` syns | Användaren ser tydligt vad nästa steg är |
| ORG-002 | New Organisation | Klick på `New Organisation` | Formulär eller wizard öppnas utan krasch |
| ORG-003 | Tomt namn | Försök skapa organisation utan namn | Tydligt felmeddelande visas |
| ORG-004 | Ogiltigt namn | Testa specialtecken och bara whitespace | Systemet stoppar eller hanterar input tydligt |
| ORG-005 | Långt namn | Testa mycket långt organisationsnamn | Ingen krasch eller layoutfel |
| ORG-006 | Giltigt namn | Skapa organisation med tydligt testnamn | Organisation skapas och visas i appen |
| ORG-007 | Dubbelklick | Dubbelklicka på skapa-knappen | Bara en organisation skapas |
| ORG-008 | Back/refresh | Refresh/back under skapande | Ingen korrupt state eller duplicering |
| ORG-009 | Förståelse | Notera otydliga texter/steg | Otydligheter dokumenteras |

## Testdata
Använd bara tydlig testdata:

- `Ali QA Test Organisation 2026-10-12`
- `   `
- `Test <script>alert(1)</script>`
- `ÅÄÖ åäö !@#$%`
- 255+ tecken långt namn

## Resultatmall

```yaml
Test ID:
Sida:
Steg:
Expected:
Actual:
Status: Pass/Fail/Blocked
Risknivå:
Screenshot/logg:
Kommentar:
```

## Nästa PowerShell-steg
Öppna appen för manuell testning:

```powershell
Start-Process "https://app.qlerify.com/login"
```

Öppna QA-rapporten:

```powershell
Start-Process "D:\LIA 2\qa\index.html"
```
