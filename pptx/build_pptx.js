// Generates a .pptx template, the PowerPoint equivalent of the crns Beamer
// theme (palette=darkred, header=transparent) and its showcase deck.
//
// Usage: node build_pptx.js <assets dir> <output.pptx> <crns|smarts>
// The last argument selects the title page background.
// Run through pptx/build.sh, which prepares the assets (backgrounds rendered
// from graphics/*.pdf, equations and figure rendered from equations.tex).
//
// Geometry comes from the Beamer output: the Beamer page is 160 x 90 mm, the
// PowerPoint page 13.333 x 7.5 in, so lengths scale by K = 2.117 and the 8pt
// Beamer body text becomes 17pt.

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const [assets, output, titleBackground] = process.argv.slice(2);
if (!assets || !output || !["crns", "smarts"].includes(titleBackground)) {
  console.error("usage: node build_pptx.js <assets dir> <output.pptx> <crns|smarts>");
  process.exit(1);
}
const asset = (name) => path.join(assets, name);

// Theme: the darkred color profile of beamercolorthemecrns.sty
const THEME = {
  name: "CRNS darkred",
  headFontFace: "Kurier",
  bodyFontFace: "Kurier",
  colors: {
    dk1: "23373B",     // crnstext: normal text, default block titles
    lt1: "FFFFFF",
    dk2: "AE2626",     // crnsprimary: frame titles, numbers, progress bars, alerts
    lt2: "FAFAFA",     // crnspaper
    accent1: "AE2626", // crnsprimary
    accent2: "1F6F6B", // crnsexample
    accent3: "23373B", // crnsblock
    accent4: "CFD3D4", // filled block title, dimmed table of contents
    accent5: "E5E6E7", // filled block body
    accent6: "CDB8B8", // progress bar track
    hlink: "AE2626",
    folHlink: "7A1B1B",
  },
};
const HEX = THEME.colors;

// Sizes (pt) and positions (in), measured on the Beamer PDF
const SIZE = { title: 30, subtitle: 19, body: 17, toc: 21, small: 15, titlePageSub: 21 };
const TEXT_X = 0.83;          // left edge of the Beamer text area
const TEXT_W = 13.333 - 2 * TEXT_X;
const BAR = { x: 2.57, w: 8.18, h: 0.053 };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Achraf Ben-Hamadou";
pres.title = "CRNS presentation template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

const bgMain = () => ({ path: asset("bg_main.png") });
// pptxgenjs converts option objects in place, so every layout gets fresh objects
const slideNumber = () => ({ x: 11.0, y: 7.1, w: 1.25, h: 0.3, fontSize: SIZE.small, color: C.text2, align: "right", margin: 0 });
const titlePlaceholder = () => ({
  placeholder: {
    options: { name: "title", type: "title", x: 0.37, y: 0.3, w: 12.4, h: 0.55, margin: 0,
      fontSize: SIZE.title, bold: true, color: C.text2, align: "left", valign: "top" },
    text: "Slide title",
  },
});
const bodyPlaceholder = (x, w, name = "body") => ({
  placeholder: {
    options: { name, type: "body", x, y: 1.15, w, h: 5.75, margin: 0,
      fontSize: SIZE.body, color: C.text1, valign: "middle", paraSpaceAfter: 6 },
    text: "",
  },
});
const progressTrack = (y) => ({ rect: { x: BAR.x, y, w: BAR.w, h: BAR.h, fill: { color: C.accent6 }, line: { type: "none" } } });

// Layouts ------------------------------------------------------------------

pres.defineSlideMaster({
  title: "CRNS Title",
  background: { path: asset(`bg_title_${titleBackground}.png`) },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: TEXT_X, y: 2.66, w: 8.75, h: 0.55, margin: 0,
        fontSize: SIZE.title, bold: true, color: C.text1, align: "left", valign: "top" }, text: "Presentation title" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: TEXT_X, y: 3.3, w: 8.75, h: 0.45, margin: 0,
        fontSize: SIZE.titlePageSub, color: C.text1, valign: "top" }, text: "Subtitle" } },
    { line: { x: TEXT_X, y: 3.99, w: 8.75, h: 0, line: { color: C.accent1, width: 0.85 } } },
    { placeholder: { options: { name: "author", type: "body", x: TEXT_X, y: 4.69, w: 8.75, h: 0.55, margin: 0,
        fontSize: SIZE.title, color: C.text1, valign: "top" }, text: "Author" } },
    { placeholder: { options: { name: "affiliation", type: "body", x: TEXT_X, y: 5.25, w: 8.75, h: 0.75, margin: 0,
        fontSize: SIZE.body, color: C.text1, valign: "top" }, text: "Position, affiliation" } },
    { placeholder: { options: { name: "contact", type: "body", x: TEXT_X, y: 6.15, w: 8.75, h: 0.4, margin: 0,
        fontSize: SIZE.body, color: C.text1, valign: "top" }, text: "Email" } },
  ],
});

pres.defineSlideMaster({
  title: "CRNS Section",
  background: bgMain(),
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: BAR.x, y: 2.17, w: BAR.w, h: 0.5, margin: 0,
        fontSize: SIZE.title, color: C.text1, align: "left", valign: "bottom" }, text: "Section title" } },
    progressTrack(2.75),
  ],
});

pres.defineSlideMaster({
  title: "CRNS Subsection",
  background: bgMain(),
  objects: [
    progressTrack(2.666),
    { placeholder: { options: { name: "body", type: "body", x: BAR.x, y: 3.25, w: BAR.w, h: 2.5, margin: 0,
        fontSize: SIZE.toc, color: C.text1, valign: "top" }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CRNS Content",
  background: bgMain(),
  slideNumber: slideNumber(),
  objects: [titlePlaceholder(), bodyPlaceholder(TEXT_X, TEXT_W)],
});

const arrow = JSON.parse(fs.readFileSync(asset("equations.json"), "utf8"))[8];
pres.defineSlideMaster({
  title: "CRNS Content with Subtitle",
  background: bgMain(),
  slideNumber: slideNumber(),
  objects: [
    titlePlaceholder(),
    // hook arrow rendered by LaTeX (equations.tex, page 8), 16pt in Beamer
    { image: { path: asset("eq-8.png"), x: 1.13, y: 0.8, w: arrow.w * 2.117 / 72, h: arrow.h * 2.117 / 72 } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 1.92, y: 0.74, w: 10.9, h: 0.4, margin: 0,
        fontSize: SIZE.subtitle, italic: true, color: C.text2, valign: "middle" }, text: "Slide subtitle" } },
    bodyPlaceholder(TEXT_X, TEXT_W),
  ],
});

pres.defineSlideMaster({
  title: "CRNS Title Only",
  background: bgMain(),
  slideNumber: slideNumber(),
  objects: [titlePlaceholder()],
});

pres.defineSlideMaster({
  title: "CRNS Standout",
  background: bgMain(),
  slideNumber: slideNumber(),
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: TEXT_X, y: 3.0, w: TEXT_W, h: 1.2, margin: 0,
        fontSize: SIZE.title, bold: true, color: C.text1, align: "center", valign: "middle" }, text: "Closing message" } },
  ],
});

// Slides -------------------------------------------------------------------

const slides = []; // [slide, progress fill] for section pages, filled once the deck is complete
const add = (masterName, sectionTitle) => pres.addSlide({ masterName, sectionTitle });
const progress = (slide, y) => slides.push({ slide, y });
const plain = (text, options = {}) => ({ text, options });

// Introduction
pres.addSection({ title: "Introduction" });
{
  const s = add("CRNS Title", "Introduction");
  s.addText("Presentation Title", { placeholder: "title" });
  s.addText("Subtitle", { placeholder: "subtitle" });
  s.addText("Achraf Ben-Hamadou", { placeholder: "author" });
  s.addText("Assistant Professor\nDigital Research Centre of Sfax", { placeholder: "affiliation" });
  s.addText("achraf.benhamadou@crns.rnrt.tn", { placeholder: "contact" });
}
{
  const s = add("CRNS Content", "Introduction");
  s.addText("Plan", { placeholder: "title" });
  const toc = ["Section 1", "Section 2", "Elements"];
  s.addText(toc.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, fontSize: SIZE.toc,
    paraSpaceAfter: 30, breakLine: i < toc.length - 1 } })), { placeholder: "body" });
}

// Section 1
pres.addSection({ title: "Section 1" });
{
  const s = add("CRNS Section", "Section 1");
  s.addText("Section 1", { placeholder: "title" });
  progress(s, 2.75);
}
{
  const s = add("CRNS Content", "Section 1");
  s.addText("Slide's title", { placeholder: "title" });
}
{
  const s = add("CRNS Content with Subtitle", "Section 1");
  s.addText("Slide's title", { placeholder: "title" });
  s.addText("Slide's subtitle", { placeholder: "subtitle" });
  s.addText([
    plain("Use the "),
    plain("CRNS Content with Subtitle", { bold: true }),
    plain(" layout to show a subtitle under the frame title, as Beamer does with "),
    plain("\\begin{frame}{Title}{Subtitle}", { fontFace: "Courier New" }),
    plain("."),
  ], { placeholder: "body" });
}

// Section 2
pres.addSection({ title: "Section 2" });
{
  const s = add("CRNS Section", "Section 2");
  s.addText("Section 2", { placeholder: "title" });
  progress(s, 2.75);
}
{
  const s = add("CRNS Subsection", "Section 2");
  const dim = { color: C.accent4 };
  s.addText([
    plain("1.  Section 1", { ...dim, breakLine: true }),
    plain("2.  Section 2", { breakLine: true }),
    plain("\u00A0".repeat(6) + "Sub-section 2.1", { fontSize: SIZE.body, breakLine: true }),
    plain("3.  Elements", dim),
  ], { placeholder: "body" });
  progress(s, 2.666);
}

// Elements
pres.addSection({ title: "Elements" });
{
  const s = add("CRNS Section", "Elements");
  s.addText("Elements", { placeholder: "title" });
  progress(s, 2.75);
}
{
  const s = add("CRNS Content", "Elements");
  s.addText("Typography", { placeholder: "title" });
  s.addText([
    plain("The theme provides sensible defaults to "),
    plain("emphasize", { italic: true }),
    plain(" text, "),
    plain("accent", { color: C.accent1 }),
    plain(" parts or show "),
    plain("bold", { bold: true }),
    plain(" results."),
  ], { placeholder: "body", fontSize: SIZE.toc });
}
{
  const s = add("CRNS Content", "Elements");
  s.addText("Font feature test", { placeholder: "title" });
  const mono = "Courier New";
  const items = [
    ["Regular", {}],
    ["Italic", { italic: true }],
    ["Small Caps", {}],
    ["Bold", { bold: true }],
    ["Bold Italic", { bold: true, italic: true }],
    ["Bold Small Caps", { bold: true }],
    ["Monospace", { fontFace: mono }],
    ["Monospace Italic", { fontFace: mono, italic: true }],
    ["Monospace Bold", { fontFace: mono, bold: true }],
    ["Monospace Bold Italic", { fontFace: mono, bold: true, italic: true }],
  ];
  s.addText(items.map(([t, o], i) => ({ text: t, options: { ...o, bullet: true, paraSpaceAfter: 2,
    breakLine: i < items.length - 1 } })), { placeholder: "body" });
}
{
  // Equations are LaTeX renders (Latin Modern), scaled from 10pt to the 8pt Beamer math (x 2.117)
  const s = add("CRNS Title Only", "Elements");
  s.addText("Mathematics", { placeholder: "title" });
  const eqScale = (8 / 10) * 2.117 / 72;   // standalone pt -> in
  const eq = JSON.parse(fs.readFileSync(asset("equations.json"), "utf8"));
  const colW = TEXT_W / 2;
  const column = (x, entries) => {
    let y = 1.35;
    for (const [label, page, alt] of entries) {
      s.addText(label, { x, y, w: colW, h: 0.35, margin: 0, fontSize: SIZE.body, color: C.text1,
        isTextBox: true, objectName: `Label: ${label}` });
      y += 0.42;
      const w = eq[page].w * eqScale, h = eq[page].h * eqScale;
      s.addImage({ path: asset(`eq-${page}.png`), x: x + (colW - w) / 2, y, w, h, altText: alt,
        objectName: `Equation: ${label}` });
      y += h + 0.32;
    }
  };
  column(TEXT_X, [
    ["Fourier transform and Basel problem", 1, "Fourier transform of f, and the sum of 1 over n squared equals pi squared over 6"],
    ["Variational lower bound", 2, "Evidence lower bound: log p(x) is at least the expected log-likelihood minus a KL divergence"],
    ["Scaled dot-product attention", 3, "Attention of Q, K, V equals softmax of Q K transpose over square root of d k, times V"],
  ]);
  column(TEXT_X + colW, [
    ["Diffusion forward process", 4, "Gaussian forward diffusion process q of x t given x t minus 1, and given x 0"],
    ["Matrices and cases", 5, "2 by 2 rotation matrix, and the ReLU function defined by cases"],
    ["Alphabets", 6, "Greek, upright Greek, blackboard, calligraphic and bold letters"],
  ]);
  s.addNotes("Equations are images rendered with LaTeX (Latin Modern) from pptx/equations.tex. To write new ones, use Insert > Equation, or render them the same way.");
}
{
  const s = add("CRNS Title Only", "Elements");
  s.addText("Lists", { placeholder: "title" });
  const colW = TEXT_W / 3;
  const y = 2.9, h = 1.7;
  const heading = (t, x) => s.addText(t, { x, y: y - 0.5, w: colW, h: 0.4, margin: 0, fontSize: SIZE.body,
    color: C.text1, isTextBox: true });
  heading("Items", TEXT_X);
  s.addText(["Milk", "Eggs", "Potatoes"].map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1 } })),
    { x: TEXT_X, y, w: colW, h, margin: 0, fontSize: SIZE.body, color: C.text1, valign: "top", paraSpaceAfter: 4, isTextBox: true });
  heading("Enumerations", TEXT_X + colW);
  s.addText(["First,", "Second and", "Last."].map((t, i, a) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < a.length - 1 } })),
    { x: TEXT_X + colW, y, w: colW, h, margin: 0, fontSize: SIZE.body, color: C.text1, valign: "top", paraSpaceAfter: 4, isTextBox: true });
  heading("Descriptions", TEXT_X + 2 * colW);
  s.addText([
    plain("PowerPoint ", { bold: true }), plain("Meeh.", { breakLine: true }),
    plain("Beamer ", { bold: true }), plain("Yeeeha."),
  ], { x: TEXT_X + 2 * colW, y, w: colW, h, margin: 0, fontSize: SIZE.body, color: C.text1, valign: "top", paraSpaceAfter: 4, isTextBox: true });
}
{
  const s = add("CRNS Content", "Elements");
  s.addText("Animation", { placeholder: "title" });
  s.addText([
    { text: "This is really important", options: { bullet: true, color: C.accent1, breakLine: true } },
    { text: "Now this", options: { bullet: true, breakLine: true } },
    { text: "And now this", options: { bullet: true } },
  ], { placeholder: "body" });
  s.addNotes("In Beamer this list is revealed item by item. In PowerPoint, select the list and add Animations > Appear, with Effect Options > By Paragraph.");
}
{
  const s = add("CRNS Title Only", "Elements");
  s.addText("Figures", { placeholder: "title" });
  const fig = JSON.parse(fs.readFileSync(asset("equations.json"), "utf8"))[7];
  const w = fig.w * 2.117 / 72, h = fig.h * 2.117 / 72;
  const y = 1.45;
  s.addImage({ path: asset("eq-7.png"), x: (13.333 - w) / 2, y, w, h,
    altText: "Nested squares, each rotated slightly, shaded from light to dark red", objectName: "Figure: rotated squares" });
  s.addText([
    plain("Figure 1: ", { bold: true }),
    plain("Rotated square from "),
    plain("texample.net", { hyperlink: { url: "http://www.texample.net/tikz/examples/rotated-polygons/" } }),
    plain("."),
  ], { x: TEXT_X, y: y + h + 0.12, w: TEXT_W, h: 0.35, margin: 0, fontSize: SIZE.small, color: C.text1,
    align: "center", isTextBox: true });
}
{
  const s = add("CRNS Title Only", "Elements");
  s.addText("Tables", { placeholder: "title" });
  const heavy = { type: "solid", pt: 1.6, color: HEX.dk1 };
  const light = { type: "solid", pt: 0.85, color: HEX.dk1 };
  const none = { type: "none" };
  const data = [["City", "Population"], ["Mexico City", "20,116,842"], ["Shanghai", "19,210,000"],
    ["Peking", "15,796,450"], ["Istanbul", "14,160,467"]];
  const rows = data.map((r, i) => r.map((t, j) => ({
    text: t,
    options: {
      align: j === 1 ? "right" : "left",
      border: [i === 0 ? heavy : none, none, i === 0 ? light : i === data.length - 1 ? heavy : none, none],
    },
  })));
  const w = 4.6, x = (13.333 - w) / 2, y = 2.75;
  s.addText([plain("Table 1: ", { bold: true }), plain("Largest cities in the world (source: Wikipedia)")],
    { x: TEXT_X, y: y - 0.5, w: TEXT_W, h: 0.35, margin: 0, fontSize: SIZE.small, color: C.text1, align: "center", isTextBox: true });
  s.addTable(rows, { x, y, w, colW: [2.6, 2.0], fontSize: SIZE.body, color: C.text1, rowH: 0.4, margin: [2, 6, 2, 6],
    objectName: "Table: largest cities" });
}
{
  const s = add("CRNS Title Only", "Elements");
  s.addText("Blocks", { placeholder: "title" });
  s.addText("Three different block styles are pre-defined, with or without a background.",
    { x: TEXT_X, y: 2.2, w: TEXT_W, h: 0.4, margin: 0, fontSize: SIZE.body, color: C.text1, isTextBox: true });
  const kinds = [["Default", C.accent3], ["Alert", C.accent1], ["Example", C.accent2]];
  const colW = 5.7;
  const lineH = 0.36;
  // transparent blocks (block=transparent)
  kinds.forEach(([name, color], i) => {
    const y = 2.85 + i * 0.75;
    s.addText(name, { x: TEXT_X, y, w: colW, h: lineH, margin: 0, fontSize: SIZE.body, bold: true, color,
      valign: "middle", isTextBox: true, objectName: `Block title: ${name}` });
    s.addText("Block content.", { x: TEXT_X, y: y + lineH * 0.6, w: colW, h: lineH, margin: 0, fontSize: SIZE.body,
      color: C.text1, valign: "middle", isTextBox: true, objectName: `Block body: ${name}` });
  });
  // filled blocks (block=fill)
  const fx = 6.74 - 0.08;
  kinds.forEach(([name, color], i) => {
    const y = 2.85 + i * 0.95;
    s.addText(name, { x: fx, y, w: colW, h: lineH, margin: [0, 6, 0, 6], fontSize: SIZE.body, bold: true, color,
      fill: { color: C.accent4 }, valign: "middle", isTextBox: true, objectName: `Filled block title: ${name}` });
    s.addText("Block content.", { x: fx, y: y + lineH, w: colW, h: lineH, margin: [0, 6, 0, 6], fontSize: SIZE.body,
      color: C.text1, fill: { color: C.accent5 }, valign: "middle", isTextBox: true, objectName: `Filled block body: ${name}` });
  });
}

// Closing
pres.addSection({ title: "Closing" });
{
  const s = add("CRNS Standout", "Closing");
  s.addText("Thanks for your attention", { placeholder: "title" });
}

// Section progress bars: fraction of the deck reached, like the Beamer section pages
const total = pres.slides.length;
for (const { slide, y } of slides) {
  const n = pres.slides.indexOf(slide) + 1;
  slide.addShape(pres.ShapeType.rect, { x: BAR.x, y, w: BAR.w * n / total, h: BAR.h,
    fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Progress" });
}

// Write, then patch what pptxgenjs cannot express ---------------------------
(async () => {
  await pres.writeFile({ fileName: output });

  // Small caps: pptxgenjs has no option for <a:rPr cap="small">
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(output));
  let patched = 0;
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    const next = xml.replace(/<a:rPr ((?:(?!<a:r>)[\s\S])*?)<a:t>((?:Bold )?Small Caps)<\/a:t>/g, (m, attrs, text) => {
      patched++;
      return `<a:rPr cap="small" ${attrs}<a:t>${text}</a:t>`;
    });
    if (next !== xml) zip.file(name, next);
  }
  if (patched !== 2) throw new Error(`expected 2 small-caps runs, patched ${patched}`);
  fs.writeFileSync(output, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));

  const applyThemePath = process.env.CRNS_APPLY_THEME;
  if (applyThemePath) {
    await require(applyThemePath).applyTheme(output, THEME);
  } else {
    console.warn("CRNS_APPLY_THEME not set: theme colors stay at the Office defaults");
  }
  console.log(`wrote ${output} (${total} slides)`);
})().catch((e) => { console.error(e); process.exit(1); });
