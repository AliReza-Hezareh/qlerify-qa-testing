import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile, FileBlob } from '@oai/artifact-tool';

const outputDir = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(outputDir, 'Qlerify-QA-logg-och-testresultat.xlsx');
if (process.argv.includes('--verify-native')) {
  const native = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(outputDir, 'native-verification.xlsx')));
  native.recalculate();
  const results = [];
  for (const name of ['Översikt','Daglogg','Veckologg','Testomgångar','Buggar','Källor']) {
    const range = name === 'Översikt' ? 'A1:D27' : name === 'Testomgångar' ? 'A1:O3' : name === 'Buggar' ? 'A1:K8' : name === 'Källor' ? 'A1:F8' : name === 'Veckologg' ? 'A1:J2' : 'A1:I5';
    const inspected = await native.inspect({kind:'table',range:`'${name}'!${range}`,include:'values,formulas',tableMaxRows:10,tableMaxCols:15,maxChars:12000});
    results.push(inspected.ndjson);
    const image = await native.render({sheetName:name,range,scale:1,format:'png'});
    await fs.writeFile(path.join(outputDir,`native-preview-${name}.png`),new Uint8Array(await image.arrayBuffer()));
  }
  await fs.writeFile(path.join(outputDir,'native-verification.ndjson'),results.join('\n'),'utf8');
  console.log('Samtliga sex flikar i den nativa exporten är avlästa och renderade.');
  process.exit(0);
}
const commit = '4ba7e8fb81e5915a5e3d37a9a17cc5a3ca9012f2';
const github = `https://github.com/AliReza-Hezareh/qlerify-qa-testing/blob/${commit}/`;
const tree = `https://github.com/AliReza-Hezareh/qlerify-qa-testing/tree/${commit}/`;
const report1 = `${github}qa/reports/exploratory-app-2026-10-19.md`;
const report2 = `${github}qa/reports/exploratory-app-2026-10-19-round2.md`;
const docUrl = 'https://docs.google.com/document/d/1ojP28dH5XNDj-oowxUhK-xZ6c1tG0reOvhkMchx-Rls/edit?usp=drivesdk';
const date19 = new Date('2026-10-19T00:00:00.000Z');
const date22 = new Date('2026-10-22T00:00:00.000Z');
const wb = Workbook.create();
const names = ['Översikt', 'Daglogg', 'Veckologg', 'Testomgångar', 'Buggar', 'Källor'];
const sheets = Object.fromEntries(names.map(name => [name, wb.worksheets.add(name)]));
const plans = [];
const excelDate = date => date.getTime() / 86400000 + 25569;

function setup(name, headers, rows, widths, dropdowns = {}, dateColumns = []) {
  const sheet = sheets[name];
  const end = rows.length + 1;
  const lastCol = String.fromCharCode(64 + headers.length);
  sheet.getRange(`A1:${lastCol}${end}`).values = [headers, ...rows.map(row => row.map(value => value instanceof Date ? excelDate(value) : value))];
  sheet.getRange(`A1:${lastCol}${end}`).format = {
    font: { name: 'Arial', size: 11, color: '#202124' },
    verticalAlignment: 'top',
    rowHeight: 72,
    wrapText: true,
  };
  sheet.getRange(`A1:${lastCol}1`).format = {
    fill: '#F1F3F4', font: { name: 'Arial', size: 11, bold: true, color: '#202124' },
    rowHeight: 36, wrapText: true, verticalAlignment: 'center',
  };
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, end, 1).format.columnWidthPx = width;
  });
  dateColumns.forEach(index => sheet.getRangeByIndexes(1, index, rows.length, 1).setNumberFormat('yyyy-mm-dd'));
  for (const [index, options] of Object.entries(dropdowns)) {
    sheet.getRangeByIndexes(1, Number(index), rows.length, 1).dataValidation = { rule: { type: 'list', values: options } };
  }
  sheet.freezePanes.freezeRows(1);
  sheet.freezePanes.freezeColumns(name === 'Testomgångar' ? 2 : 1);
  sheet.showGridLines = true;
  const tableName = {Daglogg:'DagloggTabell', Veckologg:'VeckologgTabell', Testomgångar:'TestomgangarTabell', Buggar:'BuggarTabell', Källor:'KallorTabell'}[name];
  const table = sheet.tables.add(`A1:${lastCol}${end}`, true, tableName);
  table.style = 'TableStyleLight1';
  table.showFilterButton = true;
  table.showBandedColumns = false;
  plans.push({sheet:name,name:tableName,rows:end,columns:headers.length,headers,dropdowns,dateColumns});
}

setup('Daglogg',
  ['Logg-ID','Datum','Vecka','Arbetstyp','Utfört arbete','Dokumenterat resultat','Lärdom / avgränsning','Status','Källa'],
  [
    ['D-001',date19,43,'Testning','Första utforskande appgranskningen: arbetsflöde, sparning, flikar, export och skrivskydd.','49 kontrollpunkter. 42 körda: 37 Pass, 5 Fail. 3 blockerade och 4 ej körda.','Ett godkänt resultat gäller bara den kontroll som dokumenterats. Serverbehörighet och full säkerhet testades inte.','Dokumenterat','S-002'],
    ['D-002',date19,43,'Testning','Andra granskningen i nytt QA-arbetsflöde: snabba ändringar, kort, releaser, fält och modellkopplingar.','48 kontrollpunkter. 39 körda: 37 Pass, 2 Fail. 5 blockerade och 4 ej körda.','CSV-förhandsvisning kan granskas separat från den exporterade filen. Filinnehållet blev inte verifierat.','Dokumenterat','S-003'],
    ['D-003',date19,43,'Blockering','Två testfiler skapades: qa-åäö.txt, 28 byte, och qa-empty.txt, 0 byte.','Första filvalet stoppades före uppladdning. Ingen fil skickades. R2-041 är fortsatt Blocked.','Kontroll av filnamn, innehåll och lagring efter uppladdning saknar resultat. Ingen produktbugg registrerades.','Blockerat','S-004'],
    ['D-004',date22,43,'Dokumentation','Sammanställde och arkiverade tidigare QA-resultat i logg och rapportunderlag.','Inga nya produkttester genomfördes den 22 oktober. Resultaten kommer från den 19 oktober.','Arbetsrepot är D:\\LIA 2\\code. En äldre Gitrot finns kvar i D:\\LIA 2; den är inte avvecklad.','Dokumenterat','S-001, S-002, S-003, S-007'],
  ], [90,105,65,135,350,390,390,140,130],
  {3:['Testning','Dokumentation','Blockering'],7:['Dokumenterat','Pågående','Blockerat']}, [1]);

setup('Veckologg',
  ['År','Vecka','Veckostart','Veckoslut','Status','Dokumenterat arbete','Resultat','Kvarstående avgränsningar','Lärdom från underlaget','Källor'],
  [[2026,43,date19,new Date('2026-10-25T00:00:00.000Z'),'Pågående',
    '19/10: två utforskande testomgångar. 22/10: sammanställning och arkivering. Inga aktiviteter har registrerats för 20–21/10.',
    'Sju distinkta dokumenterade fel: sex nya APP-001–006 och det tidigare kända QW-001. Omgångarnas kontrollpunkter redovisas separat.',
    'Ingen godkänd release. Bilageuppladdning och CSV-filens innehåll saknar verifierat produktresultat. Roller, API, last och återställning är inte godkända.',
    'En nedladdningsknapp eller förhandsvisning bevisar inte filens innehåll. Ett UI-lås bevisar inte serverns behörighetskontroll.',
    'S-001, S-002, S-003, S-004']],
  [70,65,105,105,140,380,400,400,380,180], {4:['Pågående','Avslutad']}, [2,3]);

setup('Testomgångar',
  ['Omgång','Testdatum','Vecka','Observerad skriptresurs','Dokumenterade','Körda','Pass','Fail','Blockerade','Ej körda','Passandel','Failandel','Beslut','Testad omfattning','Källa'],
  [
    ['Omgång 1',date19,43,'app.b135f38b.js',49,null,37,5,3,4,null,null,'Inte godkänd','Skapande, validering, sparning, flikar, export, skrivskydd och layout.','S-002'],
    ['Omgång 2',date19,43,'app.9855aa4c.js',48,null,37,2,5,4,null,null,'Inte godkänd','Snabba ändringar, releaser, kort, entitetsfält, relationer, modellkopplingar och exportförhandsvisning.','S-003'],
  ], [130,105,65,170,120,90,80,80,110,100,110,110,140,410,90], {12:['Inte godkänd','Godkänd']}, [1]);
const runs = sheets.Testomgångar;
runs.getRange('F2').formulas = [['=G2+H2']];
runs.getRange('F2:F3').fillDown();
runs.getRange('K2').formulas = [['=IF(F2=0,"",G2/F2)']];
runs.getRange('K2:K3').fillDown();
runs.getRange('L2').formulas = [['=IF(F2=0,"",H2/F2)']];
runs.getRange('L2:L3').fillDown();
runs.getRange('E2:J3').setNumberFormat('0');
runs.getRange('K2:L3').setNumberFormat('0.00%');

setup('Buggar',
  ['Bugg-ID','Titel','Severity','Prioritet','Status','Ny / tidigare','Omgång','Rapportdatum','Påverkan','Källa / bevis','Omtest'],
  [
    ['APP-001','Arbetsflöde kan skapas med bara blanksteg','Low','P2','Öppen','Ny','Omgång 1',date19,'Arbetsflödet saknar synligt namn och blir svårt att identifiera.',`${report1}#app-001--ett-arbetsflöde-kan-skapas-med-bara-blanksteg`,'Inte omtestad i omgång 2.'],
    ['APP-002','Verktygsfält överlappar på smal skärm','Medium','P2','Öppen','Ny','Omgång 1',date19,'Etiketter och val blir svåra att läsa vid 390 och 552 pixlars bredd. Stödda skärmstorlekar är inte fastställda.',`${report1}#app-002--domänmodellens-verktygsfält-överlappar-på-smal-skärm`,'Inte omtestad i omgång 2.'],
    ['APP-003','Villkorslänk ger 404 från händelsedetalj','Low','P2','Öppen','Ny','Omgång 1',date19,'Villkorsdokumentet går inte att öppna från den testade detaljadressen.',`${report1}#app-003--villkorslänken-ger-404-från-en-händelses-detaljadress`,'Inte omtestad i omgång 2.'],
    ['APP-004','Fyra ikonknappar saknar tillgängligt namn','Medium','P2','Öppen','Ny','Omgång 1',date19,'Knappar saknar beskrivande namn i tillgänglighetsträdet. Specifik skärmläsare testades inte.',`${report1}#app-004--fyra-ikonknappar-saknar-tillgängligt-namn`,'Inte omtestad i omgång 2.'],
    ['APP-005','Snabb namnändring följd av Add lane tappar banan','Medium','P2','Öppen','Ny','Omgång 2',date19,'Namn sparas men den efterföljande åtgärden misslyckas med konfliktmeddelande. Reproducerat två gånger.',`${report2}#app-005--snabb-namnändring-följd-av-add-lane-tappar-den-nya-banan`,'Två försök i omgång 2.'],
    ['APP-006','CSV-förhandsvisning slår ihop två textrader','Low','P2','Öppen','Ny','Omgång 2',date19,'Två textrader blir en text utan avskiljare. Själva CSV-filen är inte verifierad.',`${report2}#app-006--csv-förhandsvisningen-tar-bort-gränsen-mellan-två-textrader`,'Förhandsvisningen verifierad i omgång 2.'],
    ['QW-001','qlerify.com/login visar Page Not Found','Low','P2','Öppen','Tidigare känt','Omgång 1',date19,'Den publika loginadressen visar en felsida. Sidans Log in-länk pekar på appens login.',`${report1}#qw-001--qlerifycomlogin-visar-page-not-found`,'Återkom i omgång 1. Inte omtestad i omgång 2.'],
  ], [110,350,100,90,120,150,130,105,400,350,300],
  {2:['Critical','High','Medium','Low'],3:['P1','P2','P3'],4:['Öppen','Under arbete','Rättad','Stängd'],5:['Ny','Tidigare känt']}, [7]);

setup('Källor',
  ['Käll-ID','Underlag','Typ','Datum','Länk','Vad länken visar'],
  [
    ['S-001','QA-status','GitHub-snapshot',date19,`${github}qa/STATUS.md`,'Sammanfattning och avgränsningar från den sparade QA-statusen.'],
    ['S-002','Första utforskande appgranskningen','GitHub-snapshot',date19,report1,'49 kontrollpunkter och APP-001–004 samt QW-001.'],
    ['S-003','Andra utforskande appgranskningen','GitHub-snapshot',date19,report2,'48 kontrollpunkter samt APP-005 och APP-006.'],
    ['S-004','R2-041: stoppad filuppladdning','GitHub-snapshot',date19,`${github}qa/evidence/exploratory-2026-10-19-round2/TC-upload-blocked.md`,'Två testfiler skapades. Ingen fil laddades upp och inget manuellt resultat har rapporterats.'],
    ['S-005','Bevis från första omgången','GitHub-snapshot',date19,`${tree}qa/evidence/exploratory-2026-10-19/`,'Sparade bilder, DOM-utdrag och textbevis.'],
    ['S-006','Bevis från andra omgången','GitHub-snapshot',date19,`${tree}qa/evidence/exploratory-2026-10-19-round2/`,'Sparade bilder, textbevis och strukturerade observationer.'],
    ['S-007','QA-rapport och arbetsunderlag','Google Dokument',date22,docUrl,'Sammanställning för rapport och fortsatt dokumentation.'],
  ], [90,330,170,105,650,430], {}, [3]);

const overview = sheets.Översikt;
overview.showGridLines = true;
overview.getRange('A1:D29').format = {font:{name:'Arial',size:11,color:'#202124'},verticalAlignment:'top',wrapText:true,rowHeight:30};
overview.getRange('A2').values = [['Qlerify QA – Logg och testresultat']];
overview.getRange('A2').format.font = {name:'Arial',size:15,bold:true};
overview.getRange('A2').format.columnWidthPx = 340;
overview.getRange('B1:B29').format.columnWidthPx = 270;
overview.getRange('C1:C29').format.columnWidthPx = 300;
overview.getRange('D1:D29').format.columnWidthPx = 320;
overview.getRange('A4:B6').values = [
  ['Sammanställd',excelDate(date22)],['QA-ansvarig','Ali Reza Hezareh'],['Vecka','2026, vecka 43 – pågående'],
];
overview.getRange('B4').setNumberFormat('yyyy-mm-dd');
overview.getRange('A8:D8').values = [['Omgång','Körda','Pass','Fail']];
overview.getRange('A8:D8').format = {fill:'#F1F3F4',font:{name:'Arial',size:11,bold:true},rowHeight:30};
overview.getRange('A9:D10').formulas = [
  ["='Testomgångar'!A2","='Testomgångar'!F2","='Testomgångar'!G2","='Testomgångar'!H2"],
  ["='Testomgångar'!A3","='Testomgångar'!F3","='Testomgångar'!G3","='Testomgångar'!H3"],
];
overview.getRange('A12').values = [['Distinkta dokumenterade fel']];
overview.getRange('B12').formulas = [["=COUNTA('Buggar'!A2:A1000)"]];
overview.getRange('C12:D12').values = [['Sex nya fel och ett tidigare känt.','Ingen godkänd release.']];
overview.getRange('A14:B14').values = [['Definition','Tolkning']];
overview.getRange('A14:B14').format = {fill:'#F1F3F4',font:{name:'Arial',size:11,bold:true}};
overview.getRange('A15:B24').values = [
  ['Pass','Det förväntade resultatet för just den dokumenterade kontrollen uppfylldes.'],
  ['Fail','En dokumenterad avvikelse från kontrollens förväntade resultat observerades.'],
  ['Blockerat','Kontrollen saknar slutligt produktresultat på grund av angivet hinder.'],
  ['Ej körda','Kontrollen genomfördes inte.'],
  ['Körda','Pass + Fail inom samma omgång. Blockerade och ej körda ingår inte.'],
  ['Passandel / Failandel','Antal Pass eller Fail delat med körda kontroller i samma omgång.'],
  ['Två omgångar','Resultaten ska inte summeras till antal unika tester eller generell testtäckning.'],
  ['Skriptresurs','En observerad resursfil, inte ett verifierat fullständigt byggnummer. Äldre fel omtestades inte i den andra resursversionen.'],
  ['Fortsatt loggning','Lägg en ny rad i Daglogg för dokumenterat arbete och en rad per vecka i Veckologg. Bevara tidigare källor och datum.'],
  ['Rapportunderlag',docUrl],
];
overview.getRange('B15:B24').format.columnWidthPx = 570;
overview.getRange('A15:D24').format.rowHeight = 58;
overview.getRange('A26:D27').values = [
  ['22 oktober','Endast sammanställning och arkivering.','Inga nya produkttester.','Arbete den 20–21 oktober är inte dokumenterat här.'],
  ['Avgränsning','Filuppladdning och CSV-fil saknar verifierat resultat.','Föreslagna nya testflöden har inte lagts till i testagenten.','En äldre Gitrot i D:\\LIA 2 finns kvar. Arbetsrepot är D:\\LIA 2\\code.'],
];
overview.getRange('A26:D27').format.rowHeight = 80;

wb.recalculate();
const check = await wb.inspect({kind:'table',range:'Testomgångar!A1:M3',include:'values,formulas',tableMaxRows:3,tableMaxCols:13,maxChars:4500});
await fs.writeFile(path.join(outputDir,'sheet-local-check.ndjson'),check.ndjson,'utf8');
const errors = await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:50},summary:'Kontroll av formelfel',maxChars:2000});
await fs.writeFile(path.join(outputDir,'sheet-formula-check.ndjson'),errors.ndjson,'utf8');
for (const name of names) {
  const preview = await wb.render({sheetName:name,range: name === 'Översikt' ? 'A1:D27' : name === 'Testomgångar' ? 'A1:M3' : name === 'Buggar' ? 'A1:I8' : name === 'Källor' ? 'A1:D8' : 'A1:H5',scale:1,format:'png'});
  await fs.writeFile(path.join(outputDir,`sheet-preview-${names.indexOf(name)+1}.png`),new Uint8Array(await preview.arrayBuffer()));
}
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
await fs.writeFile(path.join(outputDir,'sheet-plan.json'),JSON.stringify({outputPath,commit,plans,names},null,2),'utf8');
console.log(JSON.stringify({outputPath,tabs:names,counts:{round1:{documented:49,executed:42,pass:37,fail:5,blocked:3,notRun:4},round2:{documented:48,executed:39,pass:37,fail:2,blocked:5,notRun:4},distinctBugs:7},check:check.ndjson,errors:errors.ndjson}));
