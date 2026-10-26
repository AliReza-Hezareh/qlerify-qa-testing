# Gemensam stil för Qlerifys QA-dokument

Stilmallen är `qa/styles/qlerify-qa.css`. Den används av HTML-rapporter som byggs från Markdown. Markdown-filerna behåller sitt innehåll. GitHubs och andra redigerares Markdown-vyer använder inte automatiskt denna CSS.

## Visa valfri Markdown-fil inom qa

```powershell
Set-Location "D:\LIA 2\code"
node .\qa\tools\render-exploratory-report.mjs --source "testplan.md"
Start-Process ".\qa\testplan.html"
```

Ange sökvägen relativt `qa/`, exempelvis `STATUS.md`, `buggrapporter.md` eller `veckologg/daglogg-2026-10-24.md`. Lägg till `--watch` för ombyggnad när Markdown-filen sparas. Rapporten laddas då om var åttonde sekund. Avsluta med Ctrl+C.

## Interaktivt designprov

`qa/reports/exploratory-app-2026-10-24-attachment-retest.html` innehåller statusfilter, sökning, expanderbara bevis, klickbart händelseförlopp, temaväxling och utskrift.

Designprovet använder samma CSS men är fristående från Markdown-generatorn. Markören `qa:custom-design` gör att generatorn bevarar dess interaktioner. Ändringar i originalets Markdown synkroniseras därför inte automatiskt till designprovet.

## Utseende och källor

- Mörk läsyta, ljus text och mintfärgad accent.
- Status visas med både text och färg.
- Responsiv layout, synligt tangentbordsfokus och utskriftsstil.
- Animationer stängs av vid önskemål om minskad rörelse.
- Ingen extern font, JavaScript-CDN eller analyskod krävs.

Designreferens: [Linears visuella hierarki](https://linear.app/now/behind-the-latest-design-refresh). Rörelsereferens: [W3C om minskad rörelse](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40). Dessa är designreferenser och inga källor till testresultaten. Inget formellt tillgänglighetsgodkännande har fastställts.
