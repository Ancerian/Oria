// ORIA 2.0 full Figma build script.
// Intended for mcp__figma.use_figma({ fileKey: "rDAD4nFixuXzzWi8hSRRak", code: <this file> }).
// It creates foundations, local reusable components, mobile screens, desktop variants,
// and prototype links from oria_screens_and_navigation.md.

const RUN_ID = "oria-2-full-screen-build-2026-07-10";

const COLOR_TOKENS = {
  light: {
    "--bg": "#FAFAF8",
    "--surface": "#FFFFFF",
    "--border": "#E4E2DC",
    "--ink": "#242822",
    "--ink-muted": "#8A8F84",
    "--growth": "#5B7A5B",
    "--bloom": "#D4A24C",
  },
  dark: {
    "--bg": "#1C1F1A",
    "--surface": "#262A23",
    "--border": "#363B32",
    "--ink": "#EDEEE8",
    "--ink-muted": "#8F9488",
    "--growth": "#7FA07F",
    "--bloom": "#E0B368",
  },
};

const SPACE_TOKENS = [
  ["space/2xs", 4, "--space-2xs"],
  ["space/xs", 8, "--space-xs"],
  ["space/sm", 12, "--space-sm"],
  ["space/md", 16, "--space-md"],
  ["space/lg", 24, "--space-lg"],
  ["space/xl", 32, "--space-xl"],
  ["space/2xl", 48, "--space-2xl"],
];

const RADIUS_TOKENS = [
  ["radius/none", 0, "--radius-none"],
  ["radius/sm", 4, "--radius-sm"],
  ["radius/md", 8, "--radius-md"],
  ["radius/lg", 12, "--radius-lg"],
  ["radius/full", 999, "--radius-full"],
];

const SECTION_PAGES = [
  "Система",
  "Онбординг",
  "Квесты",
  "Внутри квеста",
  "Компаньон",
  "Прогресс",
  "Обзор",
];

const createdNodeIds = [];
const mutatedNodeIds = [];
const warnings = [];
const screenByName = new Map();
const hotSpots = [];

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
  };
}

function hexToRgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  return { ...rgb, a: alpha };
}

function solid(hex, opacity = 1) {
  return { type: "SOLID", color: hexToRgb(hex), opacity };
}

function tag(node, key, phase = "screens") {
  node.setSharedPluginData("oria", "run_id", RUN_ID);
  node.setSharedPluginData("oria", "key", key);
  node.setSharedPluginData("oria", "phase", phase);
  createdNodeIds.push(node.id);
  return node;
}

function setFrameBasics(node, name, width, height, fillHex = COLOR_TOKENS.light["--bg"]) {
  node.name = name;
  node.resize(width, height);
  node.fills = [solid(fillHex)];
  node.clipsContent = false;
  return node;
}

function makeFrame(name, width, height, fillHex) {
  const frame = figma.createFrame();
  return setFrameBasics(frame, name, width, height, fillHex);
}

function makeAutoFrame(name, width, height, direction = "VERTICAL", fillHex = COLOR_TOKENS.light["--surface"]) {
  const frame = figma.createFrame();
  setFrameBasics(frame, name, width, height, fillHex);
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.counterAxisAlignItems = "MIN";
  frame.primaryAxisAlignItems = "MIN";
  return frame;
}

function setPadding(frame, top, right = top, bottom = top, left = right) {
  frame.paddingTop = top;
  frame.paddingRight = right;
  frame.paddingBottom = bottom;
  frame.paddingLeft = left;
}

function rounded(node, radius = 8) {
  node.cornerRadius = radius;
  return node;
}

function stroke(node, hex = COLOR_TOKENS.light["--border"], weight = 1, opacity = 1) {
  node.strokes = [solid(hex, opacity)];
  node.strokeWeight = weight;
  return node;
}

function shadow(node, opacity = 0.05) {
  node.effects = [
    {
      type: "DROP_SHADOW",
      color: hexToRgba("#000000", opacity),
      offset: { x: 0, y: 4 },
      radius: 14,
      spread: -8,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
  return node;
}

const fontCatalog = await figma.listAvailableFontsAsync();
const familyToStyles = new Map();
for (const f of fontCatalog) {
  const styles = familyToStyles.get(f.fontName.family) || [];
  styles.push(f.fontName.style);
  familyToStyles.set(f.fontName.family, styles);
}

function resolveFont(preferredFamily, preferredStyles, fallbackFamily = "Inter", fallbackStyles = ["Regular"]) {
  const preferred = familyToStyles.get(preferredFamily);
  if (preferred) {
    for (const s of preferredStyles) {
      if (preferred.includes(s)) return { family: preferredFamily, style: s };
    }
    return { family: preferredFamily, style: preferred[0] };
  }
  const fallback = familyToStyles.get(fallbackFamily);
  if (fallback) {
    for (const s of fallbackStyles) {
      if (fallback.includes(s)) return { family: fallbackFamily, style: s };
    }
    return { family: fallbackFamily, style: fallback[0] };
  }
  const first = fontCatalog[0]?.fontName || { family: "Inter", style: "Regular" };
  warnings.push(`Font fallback used for ${preferredFamily}: ${first.family} ${first.style}`);
  return first;
}

const FONT = {
  uiRegular: resolveFont("Outfit", ["Regular"], "Inter", ["Regular"]),
  uiMedium: resolveFont("Outfit", ["Medium", "Regular"], "Inter", ["Medium", "Regular"]),
  uiBold: resolveFont("Outfit", ["Bold", "SemiBold", "Semi Bold"], "Inter", ["Bold", "Semi Bold"]),
  quest: resolveFont("Fraunces", ["Bold", "Black", "Regular"], "Inter", ["Bold"]),
  questItalic: resolveFont("Fraunces", ["Bold Italic", "Black Italic", "Italic", "Bold"], "Inter", ["Bold"]),
};

if (FONT.uiRegular.family !== "Outfit") warnings.push(`Outfit was not available; used ${FONT.uiRegular.family}.`);
if (FONT.quest.family !== "Fraunces") warnings.push(`Fraunces was not available; used ${FONT.quest.family}.`);

const uniqueFonts = new Map(Object.values(FONT).map((f) => [JSON.stringify(f), f]));
await Promise.all([...uniqueFonts.values()].map((f) => figma.loadFontAsync(f)));

function textNode(content, options = {}) {
  const {
    name = "Text",
    font = FONT.uiRegular,
    size = 14,
    lineHeight = Math.round(size * 1.35),
    fill = COLOR_TOKENS.light["--ink"],
    width = null,
    align = "LEFT",
  } = options;
  const t = figma.createText();
  t.name = name;
  t.fontName = font;
  t.fontSize = size;
  t.lineHeight = { value: lineHeight, unit: "PIXELS" };
  t.letterSpacing = { value: 0, unit: "PIXELS" };
  t.textAlignHorizontal = align;
  t.fills = [solid(fill)];
  if (width) {
    t.textAutoResize = "HEIGHT";
    t.resize(width, Math.max(lineHeight, 12));
  }
  t.characters = content;
  return tag(t, `text/${name}/${content.slice(0, 24)}`);
}

function addText(parent, content, x, y, options = {}) {
  const t = textNode(content, options);
  parent.appendChild(t);
  t.x = x;
  t.y = y;
  return t;
}

function circle(parent, name, x, y, size, fillHex, strokeHex = null, weight = 1) {
  const c = figma.createEllipse();
  c.name = name;
  c.resize(size, size);
  c.fills = [solid(fillHex)];
  if (strokeHex) stroke(c, strokeHex, weight);
  parent.appendChild(c);
  c.x = x;
  c.y = y;
  return tag(c, `shape/${name}`);
}

function rect(parent, name, x, y, w, h, fillHex, radius = 8, strokeHex = null) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = [solid(fillHex)];
  r.cornerRadius = radius;
  if (strokeHex) stroke(r, strokeHex);
  parent.appendChild(r);
  r.x = x;
  r.y = y;
  return tag(r, `shape/${name}`);
}

function curve(parent, name, data, color = COLOR_TOKENS.light["--growth"], weight = 2, opacity = 1) {
  const v = figma.createVector();
  v.name = name;
  v.vectorPaths = [{ windingRule: "NONZERO", data }];
  v.fills = [];
  v.strokes = [solid(color, opacity)];
  v.strokeWeight = weight;
  v.strokeCap = "ROUND";
  v.strokeJoin = "ROUND";
  parent.appendChild(v);
  return tag(v, `vector/${name}`);
}

function makeClickTarget(parent, name, x, y, w, h, to) {
  const r = figma.createRectangle();
  r.name = `Hotspot / ${name}`;
  r.resize(w, h);
  r.fills = [solid("#FFFFFF", 0.01)];
  parent.appendChild(r);
  r.x = x;
  r.y = y;
  tag(r, `hotspot/${name}`);
  hotSpots.push({ node: r, to });
  return r;
}

async function createPages() {
  const byName = new Map(figma.root.children.map((p) => [p.name, p]));
  if (figma.root.children.length === 1 && figma.root.children[0].name === "Page 1") {
    figma.root.children[0].name = "Система";
    byName.set("Система", figma.root.children[0]);
  }
  const result = {};
  for (const name of SECTION_PAGES) {
    let page = byName.get(name);
    if (!page) {
      page = figma.createPage();
      page.name = name;
    }
    page.setSharedPluginData("oria", "run_id", RUN_ID);
    page.setSharedPluginData("oria", "key", `page/${name}`);
    mutatedNodeIds.push(page.id);
    result[name] = page;
  }
  return result;
}

const pages = await createPages();

async function createFoundations(systemPage) {
  await figma.setCurrentPageAsync(systemPage);

  const colorCollection = figma.variables.createVariableCollection("ORIA / Color");
  colorCollection.renameMode(colorCollection.modes[0].modeId, "Light");
  let lightMode = colorCollection.modes[0].modeId;
  let darkMode = null;
  try {
    darkMode = colorCollection.addMode("Dark");
  } catch (err) {
    warnings.push(`Could not add Dark mode to ORIA / Color (${err.message}). Creating light values only in the main collection.`);
  }
  colorCollection.setSharedPluginData("oria", "run_id", RUN_ID);
  colorCollection.setSharedPluginData("oria", "key", "collection/color");

  const colorVars = {};
  for (const token of Object.keys(COLOR_TOKENS.light)) {
    const variable = figma.variables.createVariable(token, colorCollection, "COLOR");
    variable.setValueForMode(lightMode, hexToRgba(COLOR_TOKENS.light[token]));
    if (darkMode) variable.setValueForMode(darkMode, hexToRgba(COLOR_TOKENS.dark[token]));
    variable.setVariableCodeSyntax("WEB", `var(${token})`);
    if (token === "--ink" || token === "--ink-muted") variable.scopes = ["TEXT_FILL"];
    else if (token === "--border") variable.scopes = ["STROKE_COLOR", "FRAME_FILL", "SHAPE_FILL"];
    else variable.scopes = ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"];
    variable.setSharedPluginData("oria", "run_id", RUN_ID);
    variable.setSharedPluginData("oria", "key", `color/${token}`);
    colorVars[token] = variable;
  }

  const spaceCollection = figma.variables.createVariableCollection("ORIA / Spacing + Radius");
  spaceCollection.renameMode(spaceCollection.modes[0].modeId, "Value");
  const valueMode = spaceCollection.modes[0].modeId;
  const sizeVars = {};
  for (const [name, value, css] of SPACE_TOKENS) {
    const v = figma.variables.createVariable(name, spaceCollection, "FLOAT");
    v.setValueForMode(valueMode, value);
    v.scopes = ["GAP"];
    v.setVariableCodeSyntax("WEB", `var(${css})`);
    sizeVars[name] = v;
  }
  for (const [name, value, css] of RADIUS_TOKENS) {
    const v = figma.variables.createVariable(name, spaceCollection, "FLOAT");
    v.setValueForMode(valueMode, value);
    v.scopes = ["CORNER_RADIUS"];
    v.setVariableCodeSyntax("WEB", `var(${css})`);
    sizeVars[name] = v;
  }

  const textStyleDefs = [
    ["UI/Body", FONT.uiRegular, 15, 22],
    ["UI/Body small", FONT.uiRegular, 13, 18],
    ["UI/Label", FONT.uiMedium, 13, 18],
    ["UI/Label strong", FONT.uiBold, 13, 18],
    ["UI/Title", FONT.uiBold, 24, 30],
    ["Quest/Title", FONT.quest, 26, 32],
    ["Quest/Arc heading", FONT.quest, 20, 26],
    ["Level/Huge number", FONT.questItalic, 72, 78],
  ];
  const textStyles = {};
  for (const [name, font, size, lineHeight] of textStyleDefs) {
    const style = figma.createTextStyle();
    style.name = name;
    style.fontName = font;
    style.fontSize = size;
    style.lineHeight = { value: lineHeight, unit: "PIXELS" };
    style.letterSpacing = { value: 0, unit: "PIXELS" };
    style.description = `ORIA 2.0 typography; source font requested: ${font.family}`;
    style.setSharedPluginData("oria", "run_id", RUN_ID);
    style.setSharedPluginData("oria", "key", `text-style/${name}`);
    textStyles[name] = style;
  }

  const effect = figma.createEffectStyle();
  effect.name = "ORIA / Surface lift";
  effect.effects = [
    {
      type: "DROP_SHADOW",
      color: hexToRgba("#000000", 0.05),
      offset: { x: 0, y: 8 },
      radius: 18,
      spread: -12,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const doc = tag(makeFrame("Система / Foundations", 980, 620, COLOR_TOKENS.light["--bg"]), "system/foundations", "system");
  doc.x = 48;
  doc.y = 48;
  addText(doc, "ORIA 2.0", 40, 36, { font: FONT.quest, size: 36, lineHeight: 42, width: 380 });
  addText(doc, "Дизайн-система: рост как ветвление", 40, 84, {
    font: FONT.uiRegular,
    size: 15,
    lineHeight: 22,
    fill: COLOR_TOKENS.light["--ink-muted"],
    width: 430,
  });
  const swatches = [
    ["--bg", COLOR_TOKENS.light["--bg"]],
    ["--surface", COLOR_TOKENS.light["--surface"]],
    ["--border", COLOR_TOKENS.light["--border"]],
    ["--ink", COLOR_TOKENS.light["--ink"]],
    ["--ink-muted", COLOR_TOKENS.light["--ink-muted"]],
    ["--growth", COLOR_TOKENS.light["--growth"]],
    ["--bloom", COLOR_TOKENS.light["--bloom"]],
  ];
  swatches.forEach(([name, hex], i) => {
    const x = 40 + (i % 4) * 170;
    const y = 150 + Math.floor(i / 4) * 118;
    rect(doc, `Swatch ${name}`, x, y, 120, 72, hex, 8, COLOR_TOKENS.light["--border"]);
    addText(doc, name, x, y + 82, { font: FONT.uiMedium, size: 13, lineHeight: 18, width: 120 });
    addText(doc, hex, x, y + 102, { font: FONT.uiRegular, size: 12, lineHeight: 16, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  });
  addText(doc, "Outfit 400/500/700 для интерфейса", 40, 422, { font: FONT.uiMedium, size: 16, lineHeight: 22, width: 420 });
  addText(doc, "Fraunces только для заголовков квестов, арок и крупных чисел левел-апа.", 40, 452, {
    font: FONT.quest,
    size: 24,
    lineHeight: 31,
    width: 620,
  });

  return { colorCollection, colorVars, sizeVars, textStyles, effect };
}

const foundations = await createFoundations(pages["Система"]);

function bindFill(token, fallback = COLOR_TOKENS.light["--surface"]) {
  const v = foundations.colorVars[token];
  if (!v) return solid(fallback);
  return figma.variables.setBoundVariableForPaint(solid(fallback), "color", v);
}

function bindTextFill(token, fallback = COLOR_TOKENS.light["--ink"]) {
  return bindFill(token, fallback);
}

async function createComponents(systemPage) {
  await figma.setCurrentPageAsync(systemPage);
  const components = {};

  function componentText(comp, content, font, size, fillToken = "--ink") {
    const label = textNode(content, {
      name: "label",
      font,
      size,
      lineHeight: Math.round(size * 1.35),
      fill: COLOR_TOKENS.light[fillToken],
    });
    label.fills = [bindTextFill(fillToken, COLOR_TOKENS.light[fillToken])];
    comp.appendChild(label);
    return label;
  }

  function makeButtonVariant(name, fillToken, textToken, strokeToken = null) {
    const comp = figma.createComponent();
    comp.name = name;
    comp.resize(138, 44);
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "AUTO";
    setPadding(comp, 12, 18);
    comp.itemSpacing = 8;
    comp.cornerRadius = 8;
    comp.fills = [bindFill(fillToken, COLOR_TOKENS.light[fillToken])];
    if (strokeToken) stroke(comp, COLOR_TOKENS.light[strokeToken]);
    componentText(comp, "Кнопка", FONT.uiMedium, 14, textToken);
    return comp;
  }

  const btnDefault = makeButtonVariant("Style=Default", "--surface", "--ink", "--border");
  const btnAccent = makeButtonVariant("Style=Accent", "--growth", "--surface");
  const buttonSet = figma.combineAsVariants([btnDefault, btnAccent], systemPage);
  buttonSet.name = "Button";
  buttonSet.x = 48;
  buttonSet.y = 720;
  buttonSet.children.forEach((child, i) => {
    child.x = 24 + i * 158;
    child.y = 24;
  });
  buttonSet.resizeWithoutConstraints(340, 100);
  const buttonLabelKey = buttonSet.addComponentProperty("Label", "TEXT", "Кнопка");
  for (const child of buttonSet.children) {
    const label = child.findOne((n) => n.name === "label");
    if (label) label.componentPropertyReferences = { characters: buttonLabelKey };
  }
  components.buttonSet = buttonSet;
  components.buttonLabelKey = buttonLabelKey;

  const questCard = figma.createComponent();
  questCard.name = "Quest Card";
  questCard.resize(327, 152);
  questCard.layoutMode = "VERTICAL";
  questCard.counterAxisSizingMode = "FIXED";
  questCard.primaryAxisSizingMode = "AUTO";
  setPadding(questCard, 18);
  questCard.itemSpacing = 12;
  questCard.cornerRadius = 8;
  questCard.fills = [bindFill("--surface")];
  stroke(questCard, COLOR_TOKENS.light["--border"]);
  const qcTitle = componentText(questCard, "Название квеста", FONT.quest, 21);
  qcTitle.name = "title";
  const qcMeta = componentText(questCard, "62% · Арка 2", FONT.uiRegular, 13, "--ink-muted");
  qcMeta.name = "meta";
  const budRow = figma.createFrame();
  budRow.name = "progress buds";
  budRow.resize(220, 14);
  budRow.fills = [];
  questCard.appendChild(budRow);
  for (let i = 0; i < 8; i++) {
    circle(budRow, `bud ${i + 1}`, i * 20, 2, 10, i < 5 ? COLOR_TOKENS.light["--growth"] : COLOR_TOKENS.light["--border"]);
  }
  const titleKey = questCard.addComponentProperty("Title", "TEXT", "Название квеста");
  const metaKey = questCard.addComponentProperty("Meta", "TEXT", "62% · Арка 2");
  qcTitle.componentPropertyReferences = { characters: titleKey };
  qcMeta.componentPropertyReferences = { characters: metaKey };
  questCard.x = 430;
  questCard.y = 720;
  components.questCard = questCard;
  components.questTitleKey = titleKey;
  components.questMetaKey = metaKey;

  function makeNodeVariant(name, fillToken, strokeToken, innerHex = null) {
    const comp = figma.createComponent();
    comp.name = name;
    comp.resize(34, 34);
    comp.fills = [];
    const outer = figma.createEllipse();
    outer.name = "circle";
    outer.resize(34, 34);
    outer.fills = [bindFill(fillToken, COLOR_TOKENS.light[fillToken])];
    if (strokeToken) stroke(outer, COLOR_TOKENS.light[strokeToken], 2);
    comp.appendChild(outer);
    if (innerHex) {
      const inner = figma.createEllipse();
      inner.name = "inner bloom";
      inner.resize(12, 12);
      inner.fills = [solid(innerHex)];
      comp.appendChild(inner);
      inner.x = 11;
      inner.y = 11;
    }
    return comp;
  }
  const nodeSet = figma.combineAsVariants(
    [
      makeNodeVariant("State=Done", "--growth", null),
      makeNodeVariant("State=Locked", "--surface", "--border"),
      makeNodeVariant("State=Current", "--surface", "--growth", COLOR_TOKENS.light["--growth"]),
      makeNodeVariant("State=Arc complete", "--bloom", null),
    ],
    systemPage
  );
  nodeSet.name = "Quest Node";
  nodeSet.x = 48;
  nodeSet.y = 880;
  nodeSet.children.forEach((child, i) => {
    child.x = 24 + i * 58;
    child.y = 24;
  });
  nodeSet.resizeWithoutConstraints(300, 90);
  components.nodeSet = nodeSet;

  const input = figma.createComponent();
  input.name = "Input Field";
  input.resize(327, 54);
  input.layoutMode = "HORIZONTAL";
  input.primaryAxisAlignItems = "CENTER";
  input.counterAxisAlignItems = "CENTER";
  setPadding(input, 14, 16);
  input.cornerRadius = 8;
  input.fills = [bindFill("--surface")];
  stroke(input, COLOR_TOKENS.light["--border"]);
  const placeholder = componentText(input, "Какую цель хочешь достичь?", FONT.uiRegular, 14, "--ink-muted");
  placeholder.name = "placeholder";
  const placeholderKey = input.addComponentProperty("Placeholder", "TEXT", "Какую цель хочешь достичь?");
  placeholder.componentPropertyReferences = { characters: placeholderKey };
  input.x = 430;
  input.y = 910;
  components.input = input;
  components.inputPlaceholderKey = placeholderKey;

  const bubble = figma.createComponent();
  bubble.name = "Companion Bubble";
  bubble.resize(286, 72);
  bubble.layoutMode = "VERTICAL";
  bubble.counterAxisSizingMode = "FIXED";
  bubble.primaryAxisSizingMode = "AUTO";
  setPadding(bubble, 14, 16);
  bubble.cornerRadius = 8;
  bubble.fills = [bindFill("--surface")];
  stroke(bubble, COLOR_TOKENS.light["--border"]);
  const msg = textNode("Сообщение компаньона", {
    name: "message",
    font: FONT.uiRegular,
    size: 14,
    lineHeight: 20,
    width: 250,
    fill: COLOR_TOKENS.light["--ink"],
  });
  msg.fills = [bindTextFill("--ink")];
  bubble.appendChild(msg);
  const msgKey = bubble.addComponentProperty("Message", "TEXT", "Сообщение компаньона");
  msg.componentPropertyReferences = { characters: msgKey };
  bubble.x = 790;
  bubble.y = 720;
  components.bubble = bubble;
  components.bubbleMessageKey = msgKey;

  const tab = figma.createComponent();
  tab.name = "Bottom Tab Bar";
  tab.resize(375, 72);
  tab.fills = [bindFill("--surface")];
  stroke(tab, COLOR_TOKENS.light["--border"]);
  const tabs = ["Квесты", "Компаньон", "Прогресс", "Обзор"];
  tabs.forEach((label, i) => {
    const x = i * 93.75;
    circle(tab, `tab dot ${label}`, x + 42, 14, 10, i === 0 ? COLOR_TOKENS.light["--growth"] : COLOR_TOKENS.light["--border"]);
    addText(tab, label, x, 34, {
      font: FONT.uiMedium,
      size: 11,
      lineHeight: 14,
      align: "CENTER",
      width: 93,
      fill: i === 0 ? COLOR_TOKENS.light["--ink"] : COLOR_TOKENS.light["--ink-muted"],
    });
  });
  tab.x = 48;
  tab.y = 1020;
  components.tabBar = tab;

  const sidebar = figma.createComponent();
  sidebar.name = "Desktop Sidebar";
  sidebar.resize(248, 900);
  sidebar.fills = [bindFill("--surface")];
  stroke(sidebar, COLOR_TOKENS.light["--border"]);
  addText(sidebar, "ORIA", 32, 34, { font: FONT.quest, size: 28, lineHeight: 34, width: 160 });
  tabs.forEach((label, i) => {
    const y = 108 + i * 54;
    rect(sidebar, `side item ${label}`, 24, y, 200, 42, i === 0 ? "#F2F5EF" : COLOR_TOKENS.light["--surface"], 8);
    circle(sidebar, `side dot ${label}`, 40, y + 15, 10, i === 0 ? COLOR_TOKENS.light["--growth"] : COLOR_TOKENS.light["--border"]);
    addText(sidebar, label, 62, y + 12, {
      font: FONT.uiMedium,
      size: 14,
      lineHeight: 18,
      width: 120,
      fill: i === 0 ? COLOR_TOKENS.light["--ink"] : COLOR_TOKENS.light["--ink-muted"],
    });
  });
  sidebar.x = 790;
  sidebar.y = 830;
  components.sidebar = sidebar;

  return components;
}

const components = await createComponents(pages["Система"]);

function makeButton(label, style = "Accent") {
  const variant = components.buttonSet.children.find((c) => c.name.includes(`Style=${style}`)) || components.buttonSet.defaultVariant;
  const inst = variant.createInstance();
  inst.setProperties({ [components.buttonLabelKey]: label });
  return inst;
}

function makeQuestCard(title, meta) {
  const inst = components.questCard.createInstance();
  inst.setProperties({ [components.questTitleKey]: title, [components.questMetaKey]: meta });
  return inst;
}

function makeInput(placeholder) {
  const inst = components.input.createInstance();
  inst.setProperties({ [components.inputPlaceholderKey]: placeholder });
  return inst;
}

function makeBubble(message) {
  const inst = components.bubble.createInstance();
  inst.setProperties({ [components.bubbleMessageKey]: message });
  return inst;
}

function nodeInstance(state) {
  const variant = components.nodeSet.children.find((c) => c.name.includes(`State=${state}`)) || components.nodeSet.defaultVariant;
  return variant.createInstance();
}

function screenKey(section, name, platform = "mobile") {
  return `${section} / ${name} / ${platform}`;
}

function framePosition(index, width, gap = 80) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return { x: 48 + col * (width + gap), y: 48 + row * 980 };
}

function mobileFrame(section, name, index, page) {
  const f = tag(makeFrame(screenKey(section, name, "mobile"), 375, 812, COLOR_TOKENS.light["--bg"]), `screen/${section}/${name}/mobile`);
  const pos = framePosition(index, 375);
  page.appendChild(f);
  f.x = pos.x;
  f.y = pos.y;
  screenByName.set(f.name, f);
  return f;
}

function desktopFrame(section, name, index, page) {
  const f = tag(makeFrame(screenKey(section, name, "desktop"), 1440, 900, COLOR_TOKENS.light["--bg"]), `screen/${section}/${name}/desktop`);
  f.x = 48;
  f.y = 48 + index * 1020;
  page.appendChild(f);
  screenByName.set(f.name, f);
  const side = components.sidebar.createInstance();
  f.appendChild(side);
  side.x = 0;
  side.y = 0;
  makeClickTarget(f, `${name} desktop sidebar quests`, 0, 108, 248, 42, screenKey("Квесты", "Квесты", "desktop"));
  makeClickTarget(f, `${name} desktop sidebar companion`, 0, 162, 248, 42, screenKey("Компаньон", "Компаньон", "mobile"));
  makeClickTarget(f, `${name} desktop sidebar progress`, 0, 216, 248, 42, screenKey("Прогресс", "Прогресс", "desktop"));
  makeClickTarget(f, `${name} desktop sidebar overview`, 0, 270, 248, 42, screenKey("Обзор", "Обзор", "mobile"));
  return f;
}

function addHeader(frame, title, subtitle = null, opts = {}) {
  if (opts.backTo) {
    addText(frame, "‹", 20, 34, { font: FONT.uiMedium, size: 30, lineHeight: 32, width: 32, fill: COLOR_TOKENS.light["--ink"] });
    makeClickTarget(frame, `${title} back`, 12, 28, 48, 48, opts.backTo);
  }
  addText(frame, title, opts.backTo ? 64 : 24, 42, { font: FONT.quest, size: 26, lineHeight: 31, width: opts.backTo ? 260 : 285 });
  if (subtitle) {
    addText(frame, subtitle, opts.backTo ? 64 : 24, 78, {
      font: FONT.uiRegular,
      size: 14,
      lineHeight: 20,
      fill: COLOR_TOKENS.light["--ink-muted"],
      width: opts.backTo ? 270 : 315,
    });
  }
}

function addMobileTabs(frame, selected = "Квесты") {
  const tab = components.tabBar.createInstance();
  frame.appendChild(tab);
  tab.x = 0;
  tab.y = 740;
  makeClickTarget(frame, `${frame.name} tab quests`, 0, 740, 94, 72, screenKey("Квесты", "Квесты", "mobile"));
  makeClickTarget(frame, `${frame.name} tab companion`, 94, 740, 94, 72, screenKey("Компаньон", "Компаньон", "mobile"));
  makeClickTarget(frame, `${frame.name} tab progress`, 188, 740, 94, 72, screenKey("Прогресс", "Прогресс", "mobile"));
  makeClickTarget(frame, `${frame.name} tab overview`, 282, 740, 93, 72, screenKey("Обзор", "Обзор", "mobile"));
  addText(frame, selected, 292, 716, { font: FONT.uiMedium, size: 11, lineHeight: 14, fill: COLOR_TOKENS.light["--ink-muted"], width: 64, align: "RIGHT" });
}

function addMascot(parent, x, y, size = 88, level = "3") {
  circle(parent, "mascot ring 1", x, y, size, COLOR_TOKENS.light["--bg"], COLOR_TOKENS.light["--growth"], 2);
  circle(parent, "mascot ring 2", x + 8, y + 8, size - 16, COLOR_TOKENS.light["--surface"], COLOR_TOKENS.light["--border"], 1);
  circle(parent, "mascot face", x + size * 0.3, y + size * 0.28, size * 0.4, "#EAE6DC", COLOR_TOKENS.light["--border"], 1);
  circle(parent, "mascot ear", x + size * 0.27, y + size * 0.24, size * 0.12, "#D7D1C4");
  circle(parent, "mascot eye", x + size * 0.47, y + size * 0.43, size * 0.05, COLOR_TOKENS.light["--ink"]);
  addText(parent, level, x, y + size + 8, { font: FONT.questItalic, size: 24, lineHeight: 26, width: size, align: "CENTER", fill: COLOR_TOKENS.light["--growth"] });
}

function addBudProgress(parent, x, y, total, done, gap = 15) {
  for (let i = 0; i < total; i++) {
    circle(parent, `progress bud ${i + 1}`, x + i * gap, y, 8, i < done ? COLOR_TOKENS.light["--growth"] : COLOR_TOKENS.light["--border"]);
  }
}

function addChip(parent, label, x, y, w = null) {
  const width = w || Math.max(92, label.length * 8 + 22);
  rect(parent, `Chip / ${label}`, x, y, width, 34, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(parent, label, x + 12, y + 8, { font: FONT.uiMedium, size: 12, lineHeight: 16, width: width - 24, fill: COLOR_TOKENS.light["--ink"] });
  return { x, y, width, height: 34 };
}

function addQuestMap(parent, x, y, scale = 1) {
  const s = scale;
  const nodePositions = [
    [30, 40, "Done"],
    [94, 92, "Done"],
    [160, 56, "Current"],
    [230, 112, "Locked"],
    [294, 76, "Locked"],
    [250, 192, "Arc complete"],
  ];
  curve(parent, "quest branch main", `M ${x + 48 * s} ${y + 58 * s} C ${x + 110 * s} ${y + 130 * s}, ${x + 184 * s} ${y + 18 * s}, ${x + 296 * s} ${y + 94 * s}`, COLOR_TOKENS.light["--growth"], 3);
  curve(parent, "quest branch arc", `M ${x + 170 * s} ${y + 72 * s} C ${x + 190 * s} ${y + 135 * s}, ${x + 220 * s} ${y + 164 * s}, ${x + 266 * s} ${y + 210 * s}`, COLOR_TOKENS.light["--border"], 2);
  nodePositions.forEach(([nx, ny, state], i) => {
    const inst = nodeInstance(state);
    parent.appendChild(inst);
    inst.x = x + nx * s;
    inst.y = y + ny * s;
    inst.resize(34 * s, 34 * s);
    if (i === 2) makeClickTarget(parent, "map current step", inst.x - 4, inst.y - 4, 44, 44, screenKey("Внутри квеста", "Экран шага", "mobile"));
    if (i === 5) makeClickTarget(parent, "map arc boss", inst.x - 4, inst.y - 4, 44, 44, screenKey("Внутри квеста", "Тест по арке", "mobile"));
  });
}

async function buildOnboarding() {
  const page = pages["Онбординг"];
  await figma.setCurrentPageAsync(page);
  const splash = mobileFrame("Онбординг", "Splash", 0, page);
  addMascot(splash, 132, 230, 112, "");
  addText(splash, "ORIA", 92, 382, { font: FONT.quest, size: 48, lineHeight: 52, width: 190, align: "CENTER" });
  addText(splash, "Квесты, которые растут вместе с тобой", 52, 444, { font: FONT.uiRegular, size: 15, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 270, align: "CENTER" });
  hotSpots.push({ node: splash, to: screenKey("Онбординг", "Онбординг-карусель", "mobile"), timeout: 0.8 });

  const carousel = mobileFrame("Онбординг", "Онбординг-карусель", 1, page);
  addHeader(carousel, "Ставь любую цель", "ORIA превращает её в путь из арок и маленьких шагов.");
  addQuestMap(carousel, 28, 176, 1);
  addText(carousel, "ИИ строит квест из арок и шагов", 24, 472, { font: FONT.quest, size: 24, lineHeight: 30, width: 300 });
  addText(carousel, "Прокачивайся с компаньоном, а прогресс раскрывается как ветвление.", 24, 538, { font: FONT.uiRegular, size: 15, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 300 });
  ["", "", ""].forEach((_, i) => circle(carousel, `onboarding dot ${i}`, 154 + i * 22, 642, 9, i === 0 ? COLOR_TOKENS.light["--growth"] : COLOR_TOKENS.light["--border"]));
  const startBtn = makeButton("Продолжить", "Accent");
  carousel.appendChild(startBtn);
  startBtn.x = 24;
  startBtn.y = 682;
  startBtn.resize(327, 48);
  makeClickTarget(carousel, "onboarding continue", 24, 682, 327, 48, screenKey("Онбординг", "Регистрация / Вход", "mobile"));
  makeClickTarget(carousel, "onboarding skip", 278, 34, 76, 32, screenKey("Онбординг", "Регистрация / Вход", "mobile"));
  addText(carousel, "Пропустить", 270, 40, { font: FONT.uiMedium, size: 13, lineHeight: 16, fill: COLOR_TOKENS.light["--ink-muted"], width: 82, align: "RIGHT" });

  const auth = mobileFrame("Онбординг", "Регистрация / Вход", 2, page);
  addHeader(auth, "Добро пожаловать", "Войди или создай аккаунт, чтобы сохранить квесты.");
  rect(auth, "Auth segmented", 24, 136, 327, 44, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  rect(auth, "Auth segmented active", 28, 140, 158, 36, "#F2F5EF", 8);
  addText(auth, "Войти", 78, 151, { font: FONT.uiMedium, size: 14, lineHeight: 17, width: 56, align: "CENTER" });
  addText(auth, "Зарегистрироваться", 196, 151, { font: FONT.uiMedium, size: 14, lineHeight: 17, fill: COLOR_TOKENS.light["--ink-muted"], width: 140, align: "CENTER" });
  const email = makeInput("email@example.com");
  auth.appendChild(email);
  email.x = 24;
  email.y = 216;
  const pass = makeInput("Пароль");
  auth.appendChild(pass);
  pass.x = 24;
  pass.y = 286;
  ["Войти через Google", "Войти через Apple", "Войти через Telegram"].forEach((label, i) => {
    const b = makeButton(label, "Default");
    auth.appendChild(b);
    b.x = 24;
    b.y = 428 + i * 58;
    b.resize(327, 44);
  });
  const authBtn = makeButton("Продолжить", "Accent");
  auth.appendChild(authBtn);
  authBtn.x = 24;
  authBtn.y = 650;
  authBtn.resize(327, 48);
  makeClickTarget(auth, "auth continue new", 24, 650, 160, 48, screenKey("Онбординг", "Первый квест", "mobile"));
  makeClickTarget(auth, "auth continue existing", 190, 650, 161, 48, screenKey("Квесты", "Квесты", "mobile"));

  const first = mobileFrame("Онбординг", "Первый квест", 3, page);
  addHeader(first, "Введи свою первую цель", "Путь появится за секунды.");
  const firstInput = makeInput("Например: Английский до B1");
  first.appendChild(firstInput);
  firstInput.x = 24;
  firstInput.y = 150;
  addChip(first, "Выучить Python", 24, 222, 140);
  addChip(first, "Английский до B1", 172, 222, 154);
  addChip(first, "Собеседование", 24, 266, 132);
  addText(first, "Уровень", 24, 330, { font: FONT.uiMedium, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  ["Новичок", "Средний", "Продвинутый"].forEach((label, i) => addChip(first, label, 24 + i * 107, 360, 96));
  const build = makeButton("Построить квест", "Accent");
  first.appendChild(build);
  build.x = 24;
  build.y = 650;
  build.resize(327, 48);
  makeClickTarget(first, "first quest build", 24, 650, 327, 48, screenKey("Квесты", "Генерация", "mobile"));
}

async function buildQuests() {
  const page = pages["Квесты"];
  await figma.setCurrentPageAsync(page);
  const home = mobileFrame("Квесты", "Квесты", 0, page);
  addHeader(home, "Активные квесты", "Уровень 3 · 12 дней стрика");
  const card1 = makeQuestCard("Освоить Python", "62% · сейчас Арка 2");
  home.appendChild(card1);
  card1.x = 24;
  card1.y = 140;
  makeClickTarget(home, "python quest card", 24, 140, 327, 152, screenKey("Внутри квеста", "Карта квеста", "mobile"));
  const card2 = makeQuestCard("Английский до B1", "30% · Арка 1");
  home.appendChild(card2);
  card2.x = 24;
  card2.y = 310;
  makeClickTarget(home, "english quest card", 24, 310, 327, 152, screenKey("Внутри квеста", "Карта квеста", "mobile"));
  addText(home, "Завершённые", 24, 500, { font: FONT.uiMedium, size: 14, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  rect(home, "Completed collapsed", 24, 528, 327, 52, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(home, "1 квест · раскрыть список", 44, 545, { font: FONT.uiRegular, size: 14, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 220 });
  const newQuest = makeButton("Новый квест", "Accent");
  home.appendChild(newQuest);
  newQuest.x = 198;
  newQuest.y = 650;
  newQuest.resize(153, 48);
  makeClickTarget(home, "new quest", 198, 650, 153, 48, screenKey("Квесты", "Ввод цели", "mobile"));
  addMobileTabs(home, "Квесты");

  const input = mobileFrame("Квесты", "Ввод цели", 1, page);
  addHeader(input, "Новая цель", "Опиши результат, а ORIA соберёт путь.", { backTo: screenKey("Квесты", "Квесты", "mobile") });
  const field = makeInput("Какую цель хочешь достичь?");
  input.appendChild(field);
  field.x = 24;
  field.y = 150;
  addChip(input, "Выучить Python", 24, 222, 140);
  addChip(input, "Английский до B1", 172, 222, 154);
  addChip(input, "Подготовиться к собеседованию", 24, 266, 260);
  addText(input, "Уровень", 24, 338, { font: FONT.uiMedium, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  ["Новичок", "Средний", "Продвинутый"].forEach((label, i) => addChip(input, label, 24 + i * 107, 366, 96));
  const buildQuest = makeButton("Построить квест", "Accent");
  input.appendChild(buildQuest);
  buildQuest.x = 24;
  buildQuest.y = 650;
  buildQuest.resize(327, 48);
  makeClickTarget(input, "goal build", 24, 650, 245, 48, screenKey("Квесты", "Генерация", "mobile"));
  makeClickTarget(input, "goal free limit", 274, 650, 77, 48, screenKey("Прогресс", "Подписка", "mobile"));

  const gen = mobileFrame("Квесты", "Генерация", 2, page);
  addMascot(gen, 132, 180, 112, "");
  addText(gen, "Строим квест", 40, 334, { font: FONT.quest, size: 30, lineHeight: 36, width: 295, align: "CENTER" });
  ["Строю арки...", "Расставляю шаги...", "Проверяю темп"].forEach((label, i) => {
    addBudProgress(gen, 103, 424 + i * 42, 6, i + 2, 18);
    addText(gen, label, 196, 417 + i * 42, { font: FONT.uiMedium, size: 14, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 130 });
  });
  hotSpots.push({ node: gen, to: screenKey("Квесты", "Проверка квеста", "mobile"), timeout: 1.8 });

  const review = mobileFrame("Квесты", "Проверка квеста", 3, page);
  addHeader(review, "Проверка квеста", "Освоить Python за 8 недель", { backTo: screenKey("Квесты", "Ввод цели", "mobile") });
  rect(review, "Generated quest summary", 24, 132, 327, 126, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(review, "Мастер-квест", 44, 152, { font: FONT.uiMedium, size: 12, lineHeight: 16, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  addText(review, "Python: от основ к мини-проекту", 44, 178, { font: FONT.quest, size: 22, lineHeight: 28, width: 260 });
  addText(review, "4 арки · 24 шага · 3 теста", 44, 222, { font: FONT.uiRegular, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 220 });
  ["Арка 1: Синтаксис", "Арка 2: Данные и функции", "Арка 3: Практика", "Арка 4: Финальный проект"].forEach((label, i) => {
    rect(review, `Arc row ${i}`, 24, 286 + i * 64, 327, 52, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    addText(review, label, 44, 304 + i * 64, { font: FONT.uiMedium, size: 14, lineHeight: 18, width: 240 });
    addBudProgress(review, 276, 307 + i * 64, 4, i === 0 ? 4 : 1, 12);
  });
  const start = makeButton("Начать квест", "Accent");
  review.appendChild(start);
  start.x = 24;
  start.y = 640;
  start.resize(190, 48);
  const regen = makeButton("Перегенерировать", "Default");
  review.appendChild(regen);
  regen.x = 222;
  regen.y = 640;
  regen.resize(129, 48);
  makeClickTarget(review, "review start", 24, 640, 190, 48, screenKey("Внутри квеста", "Карта квеста", "mobile"));
  makeClickTarget(review, "review regen", 222, 640, 129, 48, screenKey("Квесты", "Генерация", "mobile"));

  const desktop = desktopFrame("Квесты", "Квесты", 0, page);
  addText(desktop, "Активные квесты", 320, 72, { font: FONT.quest, size: 34, lineHeight: 40, width: 420 });
  addText(desktop, "Уровень 3 · 12 дней стрика", 320, 118, { font: FONT.uiRegular, size: 16, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 280 });
  const dCard1 = makeQuestCard("Освоить Python", "62% · сейчас Арка 2");
  desktop.appendChild(dCard1);
  dCard1.x = 320;
  dCard1.y = 180;
  const dCard2 = makeQuestCard("Английский до B1", "30% · Арка 1");
  desktop.appendChild(dCard2);
  dCard2.x = 680;
  dCard2.y = 180;
  const dNew = makeButton("Новый квест", "Accent");
  desktop.appendChild(dNew);
  dNew.x = 1080;
  dNew.y = 74;
  dNew.resize(180, 48);
  makeClickTarget(desktop, "desktop quest card", 320, 180, 327, 152, screenKey("Внутри квеста", "Карта квеста", "desktop"));
  makeClickTarget(desktop, "desktop new quest", 1080, 74, 180, 48, screenKey("Квесты", "Ввод цели", "mobile"));
}

async function buildInsideQuest() {
  const page = pages["Внутри квеста"];
  await figma.setCurrentPageAsync(page);
  const map = mobileFrame("Внутри квеста", "Карта квеста", 0, page);
  addHeader(map, "Освоить Python", "62% · Арка 2: данные и функции", { backTo: screenKey("Квесты", "Квесты", "mobile") });
  addBudProgress(map, 24, 124, 12, 7, 16);
  rect(map, "Quest map panel", 24, 166, 327, 360, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addQuestMap(map, 36, 218, 0.95);
  addText(map, "Текущий шаг", 44, 454, { font: FONT.uiMedium, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  addText(map, "Напиши функцию для подсчёта частот", 44, 478, { font: FONT.uiBold, size: 16, lineHeight: 21, width: 260 });
  const discuss = makeButton("Обсудить с компаньоном", "Default");
  map.appendChild(discuss);
  discuss.x = 24;
  discuss.y = 552;
  discuss.resize(212, 44);
  makeClickTarget(map, "map discuss", 24, 552, 212, 44, screenKey("Компаньон", "Компаньон", "mobile"));
  makeClickTarget(map, "map finish quest", 248, 552, 103, 44, screenKey("Внутри квеста", "Завершение квеста", "mobile"));

  const step = mobileFrame("Внутри квеста", "Экран шага", 1, page);
  addHeader(step, "Шаг 7", "Арка 2 · данные и функции", { backTo: screenKey("Внутри квеста", "Карта квеста", "mobile") });
  addText(step, "Напиши функцию для подсчёта частот", 24, 142, { font: FONT.quest, size: 26, lineHeight: 32, width: 310 });
  rect(step, "Step content", 24, 220, 327, 270, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(step, "Создай функцию count_words(text), которая принимает строку и возвращает словарь: слово → количество повторений. Проверь её на коротком абзаце.", 44, 246, { font: FONT.uiRegular, size: 15, lineHeight: 23, width: 287 });
  addChip(step, "Спросить компаньона", 44, 390, 172);
  const done = makeButton("Отметить выполненным", "Accent");
  step.appendChild(done);
  done.x = 24;
  done.y = 642;
  done.resize(327, 48);
  makeClickTarget(step, "step done", 24, 642, 327, 48, screenKey("Внутри квеста", "Карта квеста", "mobile"));
  makeClickTarget(step, "step ask", 44, 390, 172, 34, screenKey("Компаньон", "Компаньон", "mobile"));

  const test = mobileFrame("Внутри квеста", "Тест по арке", 2, page);
  addHeader(test, "Тест по арке", "3 из 8", { backTo: screenKey("Внутри квеста", "Карта квеста", "mobile") });
  addText(test, "Что вернёт len({'a': 2, 'b': 3})?", 24, 150, { font: FONT.quest, size: 24, lineHeight: 30, width: 310 });
  ["2", "3", "5", "Ошибка"].forEach((label, i) => {
    rect(test, `Answer ${label}`, 24, 242 + i * 66, 327, 52, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    addText(test, label, 48, 259 + i * 66, { font: FONT.uiMedium, size: 15, lineHeight: 20, width: 220 });
  });
  const next = makeButton("Завершить тест", "Accent");
  test.appendChild(next);
  next.x = 24;
  next.y = 650;
  next.resize(327, 48);
  makeClickTarget(test, "test finish", 24, 650, 327, 48, screenKey("Внутри квеста", "Результаты теста", "mobile"));

  const results = mobileFrame("Внутри квеста", "Результаты теста", 3, page);
  addHeader(results, "Результаты", "Порог пройден", { backTo: screenKey("Внутри квеста", "Тест по арке", "mobile") });
  addText(results, "7/8", 84, 158, { font: FONT.questItalic, size: 80, lineHeight: 84, width: 200, align: "CENTER", fill: COLOR_TOKENS.light["--growth"] });
  addText(results, "+180 XP", 118, 252, { font: FONT.uiBold, size: 18, lineHeight: 24, width: 140, align: "CENTER", fill: COLOR_TOKENS.light["--bloom"] });
  rect(results, "Mistakes review", 24, 332, 327, 148, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(results, "Разбор", 44, 354, { font: FONT.uiMedium, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  addText(results, "Повтори разницу между списком и словарём. Остальное уверенно.", 44, 382, { font: FONT.uiRegular, size: 15, lineHeight: 22, width: 280 });
  const level = makeButton("Продолжить", "Accent");
  results.appendChild(level);
  level.x = 24;
  level.y = 640;
  level.resize(194, 48);
  const retry = makeButton("Попробовать снова", "Default");
  results.appendChild(retry);
  retry.x = 226;
  retry.y = 640;
  retry.resize(125, 48);
  makeClickTarget(results, "results success", 24, 640, 194, 48, screenKey("Внутри квеста", "Левел-ап", "mobile"));
  makeClickTarget(results, "results retry", 226, 640, 125, 48, screenKey("Внутри квеста", "Тест по арке", "mobile"));

  const levelUp = mobileFrame("Внутри квеста", "Левел-ап", 4, page);
  addMascot(levelUp, 118, 160, 140, "4");
  addText(levelUp, "Уровень 4", 52, 358, { font: FONT.questItalic, size: 54, lineHeight: 60, width: 270, align: "CENTER", fill: COLOR_TOKENS.light["--bloom"] });
  addText(levelUp, "Новое кольцо роста появилось вокруг компаньона.", 54, 438, { font: FONT.uiRegular, size: 16, lineHeight: 23, fill: COLOR_TOKENS.light["--ink-muted"], width: 266, align: "CENTER" });
  const cont = makeButton("Продолжить", "Accent");
  levelUp.appendChild(cont);
  cont.x = 24;
  cont.y = 650;
  cont.resize(327, 48);
  makeClickTarget(levelUp, "level continue", 24, 650, 327, 48, screenKey("Внутри квеста", "Карта квеста", "mobile"));

  const finish = mobileFrame("Внутри квеста", "Завершение квеста", 5, page);
  addMascot(finish, 118, 128, 140, "");
  addText(finish, "Квест завершён", 44, 320, { font: FONT.quest, size: 34, lineHeight: 40, width: 286, align: "CENTER" });
  rect(finish, "Finish stats", 24, 410, 327, 128, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  ["24 шага", "4 арки", "18 дней"].forEach((label, i) => {
    addText(finish, label, 44 + i * 100, 452, { font: FONT.quest, size: 22, lineHeight: 28, width: 86, align: "CENTER", fill: COLOR_TOKENS.light["--growth"] });
  });
  const toQuests = makeButton("В квесты", "Accent");
  finish.appendChild(toQuests);
  toQuests.x = 24;
  toQuests.y = 650;
  toQuests.resize(327, 48);
  makeClickTarget(finish, "finish to quests", 24, 650, 327, 48, screenKey("Квесты", "Квесты", "mobile"));

  const desktop = desktopFrame("Внутри квеста", "Карта квеста", 0, page);
  addText(desktop, "Освоить Python", 320, 72, { font: FONT.quest, size: 36, lineHeight: 42, width: 420 });
  addText(desktop, "62% · Арка 2: данные и функции", 320, 120, { font: FONT.uiRegular, size: 16, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 320 });
  rect(desktop, "Desktop quest map panel", 320, 180, 840, 520, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addQuestMap(desktop, 410, 260, 1.8);
  const dDiscuss = makeButton("Обсудить с компаньоном", "Default");
  desktop.appendChild(dDiscuss);
  dDiscuss.x = 320;
  dDiscuss.y = 730;
  dDiscuss.resize(230, 48);
  makeClickTarget(desktop, "desktop map discuss", 320, 730, 230, 48, screenKey("Компаньон", "Компаньон", "mobile"));
  makeClickTarget(desktop, "desktop map back", 580, 730, 160, 48, screenKey("Квесты", "Квесты", "desktop"));
}

async function buildCompanion() {
  const page = pages["Компаньон"];
  await figma.setCurrentPageAsync(page);
  const comp = mobileFrame("Компаньон", "Компаньон", 0, page);
  addHeader(comp, "Компаньон", "Все квесты");
  rect(comp, "Context switch", 24, 126, 327, 42, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(comp, "Все квесты", 48, 138, { font: FONT.uiMedium, size: 13, lineHeight: 17, width: 120 });
  addText(comp, "Освоить Python", 196, 138, { font: FONT.uiMedium, size: 13, lineHeight: 17, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  const b1 = makeBubble("По английскому всё горит, а Python не трогали 4 дня — с чего начнём?");
  comp.appendChild(b1);
  b1.x = 24;
  b1.y = 206;
  const b2 = makeBubble("Давай 20 минут Python. Найди шаг с функцией count_words и сделай черновик.");
  comp.appendChild(b2);
  b2.x = 64;
  b2.y = 306;
  const b3 = makeBubble("После этого я предложу короткий повтор по английскому.");
  comp.appendChild(b3);
  b3.x = 24;
  b3.y = 412;
  addChip(comp, "Что мне делать сегодня?", 24, 548, 190);
  addChip(comp, "Объясни последний шаг", 24, 592, 182);
  const messageInput = makeInput("Написать компаньону");
  comp.appendChild(messageInput);
  messageInput.x = 24;
  messageInput.y = 660;
  makeClickTarget(comp, "companion message limit", 298, 660, 53, 54, screenKey("Прогресс", "Подписка", "mobile"));
  addMobileTabs(comp, "Компаньон");
}

async function buildProgress() {
  const page = pages["Прогресс"];
  await figma.setCurrentPageAsync(page);
  const progress = mobileFrame("Прогресс", "Прогресс", 0, page);
  addHeader(progress, "Прогресс", "Кольца роста и привычки");
  addText(progress, "⚙", 316, 42, { font: FONT.uiMedium, size: 22, lineHeight: 24, width: 30, align: "CENTER" });
  makeClickTarget(progress, "progress settings", 304, 32, 48, 48, screenKey("Прогресс", "Настройки", "mobile"));
  addMascot(progress, 122, 130, 132, "3");
  makeClickTarget(progress, "progress mascot", 112, 124, 152, 180, screenKey("Прогресс", "Кастомизация маскота", "mobile"));
  addBudProgress(progress, 94, 342, 10, 7, 18);
  [["12", "дней стрика"], ["2", "квеста"], ["38", "шагов"], ["5", "тестов"]].forEach(([num, label], i) => {
    const x = 24 + (i % 2) * 168;
    const y = 396 + Math.floor(i / 2) * 94;
    rect(progress, `stat ${label}`, x, y, 158, 74, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    addText(progress, num, x + 16, y + 14, { font: FONT.quest, size: 26, lineHeight: 30, width: 50, fill: COLOR_TOKENS.light["--growth"] });
    addText(progress, label, x + 70, y + 24, { font: FONT.uiRegular, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 76 });
  });
  addText(progress, "Ачивменты", 24, 598, { font: FONT.uiMedium, size: 14, lineHeight: 18, width: 120 });
  ["Первая арка", "7 дней", "Без пропусков"].forEach((label, i) => {
    circle(progress, `achievement ${label}`, 38 + i * 98, 638, 42, i === 0 ? COLOR_TOKENS.light["--bloom"] : COLOR_TOKENS.light["--border"]);
    addText(progress, label, 16 + i * 98, 686, { font: FONT.uiRegular, size: 11, lineHeight: 14, fill: COLOR_TOKENS.light["--ink-muted"], width: 86, align: "CENTER" });
  });
  makeClickTarget(progress, "progress upgrade", 264, 598, 88, 88, screenKey("Прогресс", "Подписка", "mobile"));
  addMobileTabs(progress, "Прогресс");

  const settings = mobileFrame("Прогресс", "Настройки", 1, page);
  addHeader(settings, "Настройки", "Аккаунт и приложение", { backTo: screenKey("Прогресс", "Прогресс", "mobile") });
  ["Аккаунт: user@example.com", "Уведомления: 19:30", "Тема: системная", "Язык: русский", "Управление подпиской", "Восстановить покупки"].forEach((label, i) => {
    rect(settings, `settings row ${i}`, 24, 136 + i * 62, 327, 50, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    addText(settings, label, 44, 152 + i * 62, { font: FONT.uiRegular, size: 14, lineHeight: 18, width: 250 });
  });
  const logout = makeButton("Выйти", "Default");
  settings.appendChild(logout);
  logout.x = 24;
  logout.y = 650;
  logout.resize(327, 48);
  makeClickTarget(settings, "settings logout", 24, 650, 327, 48, screenKey("Онбординг", "Регистрация / Вход", "mobile"));

  const custom = mobileFrame("Прогресс", "Кастомизация маскота", 2, page);
  addHeader(custom, "Маскот", "Стадия и аксессуары", { backTo: screenKey("Прогресс", "Прогресс", "mobile") });
  addMascot(custom, 116, 132, 142, "3");
  ["Лесной", "Ночной", "Золотой Pro"].forEach((label, i) => {
    rect(custom, `skin ${label}`, 24 + i * 110, 390, 96, 132, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    circle(custom, `skin dot ${label}`, 53 + i * 110, 422, 38, i === 2 ? COLOR_TOKENS.light["--bloom"] : COLOR_TOKENS.light["--growth"]);
    addText(custom, label, 32 + i * 110, 482, { font: FONT.uiMedium, size: 12, lineHeight: 16, width: 80, align: "CENTER" });
  });
  makeClickTarget(custom, "premium skin", 244, 390, 96, 132, screenKey("Прогресс", "Подписка", "mobile"));

  const pay = mobileFrame("Прогресс", "Подписка", 3, page);
  rect(pay, "Paywall overlay", 0, 0, 375, 812, "#000000", 0);
  pay.fills = [solid("#000000", 0.18)];
  rect(pay, "Paywall modal", 24, 154, 327, 500, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addText(pay, "ORIA Pro", 48, 194, { font: FONT.quest, size: 32, lineHeight: 38, width: 220 });
  addText(pay, "Больше квестов, сообщений компаньону и косметики для маскота.", 48, 244, { font: FONT.uiRegular, size: 15, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 260 });
  ["Безлимитные активные квесты", "Больше сообщений компаньону", "Расширенные тесты", "Скины маскота"].forEach((label, i) => {
    circle(pay, `pro check ${i}`, 50, 326 + i * 42, 14, COLOR_TOKENS.light["--growth"]);
    addText(pay, label, 76, 323 + i * 42, { font: FONT.uiMedium, size: 14, lineHeight: 18, width: 240 });
  });
  const sub = makeButton("Оформить подписку", "Accent");
  pay.appendChild(sub);
  sub.x = 48;
  sub.y = 548;
  sub.resize(255, 48);
  addText(pay, "×", 314, 176, { font: FONT.uiMedium, size: 24, lineHeight: 26, width: 24, align: "CENTER" });
  makeClickTarget(pay, "paywall close", 302, 166, 44, 44, screenKey("Квесты", "Квесты", "mobile"));

  const desktop = desktopFrame("Прогресс", "Прогресс", 0, page);
  addText(desktop, "Прогресс", 320, 72, { font: FONT.quest, size: 36, lineHeight: 42, width: 380 });
  addMascot(desktop, 330, 160, 170, "3");
  rect(desktop, "Desktop progress stats", 560, 170, 560, 260, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  [["12", "дней стрика"], ["2", "квеста"], ["38", "шагов"], ["5", "тестов"]].forEach(([num, label], i) => {
    const x = 600 + (i % 2) * 240;
    const y = 210 + Math.floor(i / 2) * 96;
    addText(desktop, num, x, y, { font: FONT.quest, size: 42, lineHeight: 48, width: 80, fill: COLOR_TOKENS.light["--growth"] });
    addText(desktop, label, x + 86, y + 14, { font: FONT.uiRegular, size: 16, lineHeight: 22, fill: COLOR_TOKENS.light["--ink-muted"], width: 120 });
  });
  makeClickTarget(desktop, "desktop progress settings", 1100, 72, 72, 48, screenKey("Прогресс", "Настройки", "mobile"));
}

async function buildOverview() {
  const page = pages["Обзор"];
  await figma.setCurrentPageAsync(page);
  const overview = mobileFrame("Обзор", "Обзор", 0, page);
  addHeader(overview, "Обзор", "Шаблоны для быстрого старта");
  const search = makeInput("Поиск шаблонов");
  overview.appendChild(search);
  search.x = 24;
  search.y = 126;
  ["Языки", "Код", "Карьера"].forEach((label, i) => addChip(overview, label, 24 + i * 94, 196, 84));
  ["Python с нуля", "Английский B1", "Собеседование JS"].forEach((label, i) => {
    rect(overview, `template ${label}`, 24, 256 + i * 126, 327, 104, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
    addText(overview, label, 44, 278 + i * 126, { font: FONT.quest, size: 21, lineHeight: 27, width: 240 });
    addText(overview, "Команда ORIA · популярное", 44, 320 + i * 126, { font: FONT.uiRegular, size: 13, lineHeight: 18, fill: COLOR_TOKENS.light["--ink-muted"], width: 220 });
    addBudProgress(overview, 260, 314 + i * 126, 4, 3, 13);
    if (i === 0) makeClickTarget(overview, "overview template", 24, 256, 327, 104, screenKey("Обзор", "Детали шаблона", "mobile"));
  });
  addMobileTabs(overview, "Обзор");

  const details = mobileFrame("Обзор", "Детали шаблона", 1, page);
  addHeader(details, "Python с нуля", "Готовая структура квеста", { backTo: screenKey("Обзор", "Обзор", "mobile") });
  rect(details, "template preview", 24, 140, 327, 360, COLOR_TOKENS.light["--surface"], 8, COLOR_TOKENS.light["--border"]);
  addQuestMap(details, 44, 206, 0.82);
  ["Основы синтаксиса", "Данные и функции", "Мини-проект"].forEach((label, i) => {
    addText(details, label, 54, 410 + i * 34, { font: FONT.uiMedium, size: 13, lineHeight: 17, width: 220 });
  });
  const start = makeButton("Начать этот квест", "Accent");
  details.appendChild(start);
  start.x = 24;
  start.y = 650;
  start.resize(327, 48);
  makeClickTarget(details, "template start", 24, 650, 327, 48, screenKey("Внутри квеста", "Карта квеста", "mobile"));
}

await buildOnboarding();
await buildQuests();
await buildInsideQuest();
await buildCompanion();
await buildProgress();
await buildOverview();

async function applyPrototypeLinks() {
  const transition = { type: "SMART_ANIMATE", easing: { type: "EASE_OUT" }, duration: 0.28 };
  let linked = 0;
  for (const entry of hotSpots) {
    const dest = screenByName.get(entry.to);
    if (!dest) {
      warnings.push(`Missing prototype destination: ${entry.to}`);
      continue;
    }
    const trigger = entry.timeout ? { type: "AFTER_TIMEOUT", timeout: entry.timeout } : { type: "ON_CLICK" };
    await entry.node.setReactionsAsync([
      {
        trigger,
        actions: [
          {
            type: "NODE",
            destinationId: dest.id,
            navigation: "NAVIGATE",
            transition,
            resetScrollPosition: true,
          },
        ],
      },
    ]);
    linked += 1;
  }
  return linked;
}

const prototypeLinks = await applyPrototypeLinks();

figma.viewport.scrollAndZoomIntoView([screenByName.get(screenKey("Квесты", "Квесты", "mobile"))].filter(Boolean));

return {
  success: true,
  runId: RUN_ID,
  fileKey: figma.fileKey,
  pages: SECTION_PAGES,
  screenCount: screenByName.size,
  prototypeLinks,
  createdNodeIds,
  mutatedNodeIds,
  warnings,
  fontUsed: {
    outfitRegular: FONT.uiRegular,
    outfitMedium: FONT.uiMedium,
    outfitBold: FONT.uiBold,
    fraunces: FONT.quest,
    frauncesAccent: FONT.questItalic,
  },
};
