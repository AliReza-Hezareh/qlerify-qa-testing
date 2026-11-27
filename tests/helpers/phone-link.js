// Hjälpfunktioner för CONTACT-005: läser av telefonnummer som visas på en sida
// och kontrollerar att varje nummer ligger i en tel:-länk som pekar på samma
// nummer. Bryts ut hit så kontrollen kan verifieras separat mot kända sidor.

// --- CONTACT-005: telefonnummer och tel:-länk ---------------------------------
// Mönstret plockar ut telefonliknande text. Numret måste börja på "+" eller på
// en nolla, vilket täcker internationellt och svenskt nationellt format. Kravet
// behövs för att sifferserier som "2024 2025" inte ska läsas som telefonnummer;
// det gav falskt Fail i en tidigare version av kontrollen.
// Känd avgränsning: ett nummer som skrivs utan "+" och utan inledande nolla,
// till exempel "8 503 556 55", upptäcks inte av den här kontrollen.
const PHONE_TEXT_SOURCE = String.raw`(?:\+|\b0)\d[\d\s()\-]{5,}\d`;

// Räknar bara siffror så två format kan jämföras. "(0)" tas bort först, eftersom
// trunknollan skrivs ut nationellt men utelämnas i internationellt format:
// "+46 (0)8 503 556 55" och "tel:+46850355655" ska räknas som samma nummer.
function phoneDigits(raw) {
  return ((raw || '').replace(/\(0\)/g, '').match(/\d/g) || []).join('');
}

// Numret i länken ska vara samma som det synliga. Jämförelsen tillåter att en av
// dem bär landskod eller ledande nolla som den andra saknar, men kräver att de
// sju sista siffrorna är identiska. Ett helt annat nummer i href ger alltså Fail.
function phoneDigitsMatch(shownDigits, hrefDigits) {
  if (!shownDigits || !hrefDigits) return false;
  const [short, long] = shownDigits.length <= hrefDigits.length
    ? [shownDigits, hrefDigits]
    : [hrefDigits, shownDigits];
  return long.endsWith(short) || long.endsWith(short.slice(-7));
}

// Läser av sidan en gång och returnerar varje synligt telefonnummer med den
// länk det ligger i, var i DOM:en det står och vilken rubrik som står närmast
// ovanför. Allt som behövs för felrapporten samlas här, i ett anrop.
async function collectPhoneFindings(page) {
  return page.evaluate((patternSource) => {
    const digitsOf = (raw) => ((raw || '').replace(/\(0\)/g, '').match(/\d/g) || []).join('');

    // Kort DOM-väg till elementet, så felrapporten pekar ut exakt var numret står.
    const describePlace = (el) => {
      const path = [];
      let node = el;
      while (node && node.nodeType === 1 && path.length < 6) {
        let step = node.tagName.toLowerCase();
        if (node.id) {
          path.unshift(`${step}#${node.id}`);
          break;
        }
        const classes = (node.getAttribute('class') || '')
          .trim().split(/\s+/).filter(Boolean).slice(0, 2);
        if (classes.length) step += `.${classes.join('.')}`;
        path.unshift(step);
        node = node.parentElement;
      }

      // Den sista rubriken före elementet i dokumentordning ger en läsbar
      // placering, t.ex. "Contact information". Jämförelsen görs på
      // dokumentposition och inte på syskon, eftersom numret kan ligga djupt
      // nästlat i ett block som inte har någon rubrik direkt före sig.
      let heading = '';
      const rubriker = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      for (const rubrik of rubriker) {
        const before = el.compareDocumentPosition(rubrik) & Node.DOCUMENT_POSITION_PRECEDING;
        if (!before) continue;
        const text = (rubrik.innerText || '').trim().replace(/\s+/g, ' ');
        if (text) heading = text.slice(0, 60);
      }

      // Vilket landmärke numret ligger i, t.ex. header eller footer. Det behövs
      // när numret står ovanför sidans första rubrik, för då pekar rubriken
      // ensam inte ut någon plats.
      const landmark = el.closest('header, footer, nav, main, section, aside, form');
      let omrade = '';
      if (landmark) {
        const namn = landmark.getAttribute('aria-label') || landmark.getAttribute('id') || '';
        omrade = `<${landmark.tagName.toLowerCase()}>${namn ? ` "${namn}"` : ''}`;
      }

      // Omgivande text som kontext, men bara om blocket säger mer än numret
      // självt. Annars är uppgiften inte till någon hjälp i felrapporten.
      let omgivning = '';
      const egenText = (el.innerText || '').trim().replace(/\s+/g, ' ');
      let scan = el.parentElement;
      while (scan && !omgivning) {
        const text = (scan.innerText || '').trim().replace(/\s+/g, ' ');
        if (text.length > egenText.length + 10) omgivning = text.slice(0, 80);
        scan = scan.parentElement;
      }

      const delar = [
        omrade,
        heading ? `närmaste rubrik ovanför: "${heading}"` : 'står ovanför sidans första rubrik',
        omgivning ? `omgivande text: "${omgivning}"` : ''
      ].filter(Boolean);

      return { domPath: path.join(' > '), section: delar.join(' | ') || '(ingen placering hittad)' };
    };

    const pattern = new RegExp(patternSource, 'g');
    const findings = [];
    const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    let textNode;
    while ((textNode = walker.nextNode())) {
      const parent = textNode.parentElement;
      if (!parent) continue;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(parent.tagName)) continue;
      // Dold text räknas inte: kontrollen gäller nummer en besökare faktiskt ser.
      if (!parent.offsetParent && parent.tagName !== 'BODY') continue;

      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(textNode.nodeValue || ''))) {
        const shown = match[0].trim();
        const shownDigits = digitsOf(shown);
        // 8-15 siffror enligt ITU-T E.164 som längsta tillåtna nummer.
        if (shownDigits.length < 8 || shownDigits.length > 15) continue;

        const anchor = parent.closest('a');
        const href = anchor ? (anchor.getAttribute('href') || '') : null;
        const key = `${shownDigits}|${href === null ? 'TEXT' : href}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          shown,
          shownDigits,
          isLink: Boolean(anchor),
          href,
          hrefDigits: anchor ? digitsOf(href) : '',
          ...describePlace(anchor || parent)
        });
      }
    }
    return findings;
  }, PHONE_TEXT_SOURCE);
}

// Varför ett fynd underkänns, uttryckt så det går att läsa i felrapporten.
function phoneFindingProblem(finding) {
  if (!finding.isLink) return 'numret är ren text, det ligger inte i något <a>-element';
  if (!/^tel:/i.test(finding.href || '')) return `länkmålet är "${finding.href}" i stället för "tel:"`;
  if (!phoneDigitsMatch(finding.shownDigits, finding.hrefDigits)) {
    return `länken pekar på ett annat nummer: visat ${finding.shownDigits}, i href ${finding.hrefDigits || '(inga siffror)'}`;
  }
  return null;
}

// En post per hittat nummer, oavsett om det godkänns eller inte, så rapporten
// visar vad kontrollen faktiskt läste av och var.
function formatPhoneFinding(finding, index) {
  const problem = phoneFindingProblem(finding);
  return [
    `  [${index + 1}] nummer på sidan : ${finding.shown}`,
    `      plats             : ${finding.section}`,
    `      element           : ${finding.domPath}`,
    `      länk              : ${finding.isLink ? `href="${finding.href}"` : 'inget <a>-element'}`,
    `      utfall            : ${problem ? `FEL - ${problem}` : 'OK - tel:-länk med samma nummer'}`
  ].join('\n');
}

module.exports = {
  PHONE_TEXT_SOURCE,
  phoneDigits,
  phoneDigitsMatch,
  collectPhoneFindings,
  phoneFindingProblem,
  formatPhoneFinding
};
