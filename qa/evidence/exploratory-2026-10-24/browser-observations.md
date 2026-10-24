# Webbläsarbevis – 2026-10-24

## Inloggad app

- Arbetsflöde: `QA 2026-10-19 – flöden och edge cases 2`
- Backlog fanns kvar efter omladdning.
- Sökning utan träff dolde kortet. Rensning visade kortet igen.
- Bakåt och framåt växlade mellan Backlog (`selectedTab=4`) och History (`selectedTab=6`).
- CSV-förhandsvisningen visade `QA R2 – Bekräfta orderRad 2...` utan radbrytning.
- Två klick på `Export to CSV` gav ingen nedladdningshändelse. Ingen ny fil fanns i Downloads och inga fel eller varningar fanns i konsolen.
- Kortets bilagemodal visade `https://inte-en-länk`. `qa-åäö.txt` syntes inte.

## Publik webb

- Kontaktformuläret låg i `iframe[title="Form"]` från HubSpot.
- Synliga formulärfält hade kopplade etiketter.
- Telefonnumret `+46 (0)8 503 556 55` hade länkmålet `#`.
- Bloggen saknade `<footer>` och `role="contentinfo"`.
- Pricing: `scrollWidth/clientWidth` var 1383/1366 px på desktop och 897/393 px på mobil.

