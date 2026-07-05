// 12 meslek grubu (30 ayrı rolden konsolide edildi — bkz. memory-bank.md).
// ROLES_TR, ROLES_EN, ROLE_IDS, ROLE_DEFAULT_HOURS index-hizalı, HEP BİRLİKTE değişir.
export const ROLES_TR = [
  "Grafik Tasarımcı",
  "Marka Tasarımcısı",
  "UI/UX ve Ürün Tasarımcısı",
  "İllüstrasyon",
  "Konsept Sanatı",
  "Animatör",
  "Motion Tasarımcı ve VFX",
  "Web Geliştirici",
  "Mobil Uygulama Geliştirici",
  "Yazarlık ve İçerik",
  "Dijital Pazarlama",
  "Prodüksiyon ve Medya",
];
export const ROLES_EN = [
  "Graphic Designer",
  "Brand Designer",
  "UI/UX & Product Designer",
  "Illustration",
  "Concept Art",
  "Animator",
  "Motion Design & VFX",
  "Web Developer",
  "Mobile App Developer",
  "Copywriting & Content",
  "Digital Marketing",
  "Production & Media",
];

// Stabil, dilden bağımsız slug'lar — packages/ veri modelinin anahtarı.
// Index-aligned with ROLES_TR / ROLES_EN. "graphic-designer" sabit kaldı
// (data/packages/graphicDesigner.ts bu id'yi kullanıyor).
export const ROLE_IDS = [
  "graphic-designer",
  "brand-designer",
  "ui-ux-product-designer",
  "illustration",
  "concept-art",
  "animator",
  "motion-vfx",
  "web-developer",
  "mobile-app-developer",
  "writing-content",
  "digital-marketing",
  "production-media",
];

// Dilden bağımsız roleId'den, o an aktif dildeki görünen etikete döner.
// Rol seçimi state'te roleId olarak tutulmalı (bkz. HomeScreen/ResultsScreen) —
// display string'i (ROLES_TR/EN etiketi) tutmak dil değişince eşleşmeyi bozar.
export function getRoleLabel(roleId: string, lang: "tr" | "en"): string {
  const index = ROLE_IDS.indexOf(roleId);
  return index === -1 ? "" : (lang === "tr" ? ROLES_TR : ROLES_EN)[index];
}

// Typical market-average project length per role, in hours. Index-aligned with
// ROLES_TR / ROLES_EN / ROLE_IDS so the calculator can suggest a duration instead
// of asking the user to guess one before seeing any rate data.
export const ROLE_DEFAULT_HOURS = [
  25,  // Grafik Tasarımcı
  45,  // Marka Tasarımcısı
  45,  // UI/UX ve Ürün Tasarımcısı
  25,  // İllüstrasyon
  25,  // Konsept Sanatı
  55,  // Animatör
  45,  // Motion Tasarımcı ve VFX
  85,  // Web Geliştirici
  120, // Mobil Uygulama Geliştirici
  20,  // Yazarlık ve İçerik
  20,  // Dijital Pazarlama
  20,  // Prodüksiyon ve Medya
];

// id: dilden bağımsız stabil anahtar — seçili sektör chip'lerini bununla
// saklıyoruz, dil değişince label değişir ama seçim kaybolmaz.
export interface SectorChip { id: string; label: string }
const SECTOR_CHIP_IDS = ["tech", "ecommerce", "health", "education", "finance", "media", "startup", "enterprise"];

export const CHIPS_TR: { group: string; items: SectorChip[] }[] = [
  { group: "Sektör", items: SECTOR_CHIP_IDS.map((id, i) => ({ id, label: ["Teknoloji","E-ticaret","Sağlık","Eğitim","Finans","Medya","Startup","Kurumsal"][i] })) },
];
export const CHIPS_EN: { group: string; items: SectorChip[] }[] = [
  { group: "Sector", items: SECTOR_CHIP_IDS.map((id, i) => ({ id, label: ["Tech","E-commerce","Health","Education","Finance","Media","Startup","Enterprise"][i] })) },
];

// "Adobe Suite" birden fazla ayrı Adobe ürününün (Illustrator, Photoshop, ...) yerini
// alan birleşik araç seçeneği — İllüstrasyon (grup içi) ve graphic-designer/brand-designer
// (düz liste, bkz. TOOLS_BY_ROLE_ID + HomeScreen.tsx) arasında paylaşılan tek tooltip metni.
export const ADOBE_SUITE_TOOLTIP = {
  tr: "Photoshop, Illustrator, InDesign ve diğer Adobe uygulamaları",
  en: "Photoshop, Illustrator, InDesign and other Adobe applications",
};

// İllüstrasyon ve Konsept Sanatı rollerine özel: Araçlar grubu düz liste değil, önce
// Geleneksel/Dijital üst seçimi yapılıyor, sonra o gruba ait araçlar checkbox olarak
// açılıyor (bkz. HomeScreen.tsx). İki rol de AYNI araç setini paylaşıyor, bu yüzden tek
// bir tanım altında tutulup her iki roleId için de kullanılıyor (kod tekrarı yok).
// id: stabil, dilden bağımsız — selectedChips bununla saklanır.
export interface MediumTool { id: string; label: string; labelEn: string; tooltip?: string; tooltipEn?: string }
export interface MediumToolGroup { id: "digital" | "traditional"; label: string; labelEn: string; tools: MediumTool[] }

// Bu araç grubu ayrımını (Geleneksel/Dijital toggle) kullanan roller.
export const MEDIUM_TOOL_GROUP_ROLE_IDS = ["illustration", "concept-art"];

export const TRADITIONAL_DIGITAL_TOOL_GROUPS: MediumToolGroup[] = [
  {
    id: "digital",
    label: "Dijital",
    labelEn: "Digital",
    tools: [
      { id: "adobe-suite", label: "Adobe Suite", labelEn: "Adobe Suite", tooltip: ADOBE_SUITE_TOOLTIP.tr, tooltipEn: ADOBE_SUITE_TOOLTIP.en },
      { id: "clip-studio-paint", label: "Clip Studio Paint", labelEn: "Clip Studio Paint" },
      { id: "procreate", label: "Procreate", labelEn: "Procreate" },
      { id: "krita", label: "Krita", labelEn: "Krita" },
      { id: "inkscape", label: "Inkscape", labelEn: "Inkscape" },
      { id: "autodesk-sketchbook", label: "Autodesk Sketchbook", labelEn: "Autodesk Sketchbook" },
    ],
  },
  {
    id: "traditional",
    label: "Geleneksel",
    labelEn: "Traditional",
    tools: [
      { id: "graphite-pencil", label: "Karakalem", labelEn: "Graphite Pencil" },
      { id: "ink-pen", label: "Mürekkepli kalem", labelEn: "Ink pen" },
      { id: "colored-marker", label: "Renkli marker", labelEn: "Colored marker" },
      { id: "watercolor", label: "Suluboya", labelEn: "Watercolor" },
      { id: "gouache", label: "Guaj", labelEn: "Gouache" },
      { id: "acrylic", label: "Akrilik", labelEn: "Acrylic" },
      { id: "oil-paint", label: "Yağlı boya", labelEn: "Oil paint" },
    ],
  },
];

const MEDIUM_TOOL_IDS = TRADITIONAL_DIGITAL_TOOL_GROUPS.flatMap((g) => g.tools.map((t) => t.id));

// roleId -> araç listesi (TR/EN'de aynı, sadece çevre metin dile göre değişir).
// "illustration"/"concept-art" burada da yer alıyor (düz liste, gruplar için bkz.
// TRADITIONAL_DIGITAL_TOOL_GROUPS) çünkü toolsSelected/ALL_TOOLS mantığı hâlâ bu flat
// listeyi okuyor — "en az bir araç seçildi mi" kontrolü grup ayrımından bağımsız.
export const TOOLS_BY_ROLE_ID: Record<string, string[]> = {
  "graphic-designer": ["Figma", "Adobe Suite", "Canva"],
  "brand-designer": ["Adobe Suite", "Figma", "Canva"],
  "ui-ux-product-designer": ["Figma", "Adobe XD", "Sketch", "Miro"],
  "illustration": MEDIUM_TOOL_IDS,
  "concept-art": MEDIUM_TOOL_IDS,
  "animator": ["Adobe Suite", "Toon Boom Harmony", "OpenToonz", "Tahoma2D", "Clip Studio Paint", "Krita", "Blender", "Cinema 4D", "DragonFrame"],
  "motion-vfx": ["Adobe Suite", "Cinema 4D", "Blender", "Nuke", "Houdini"],
  "web-developer": ["Figma", "React", "WordPress", "Shopify", "Webflow", "Node.js", "PostgreSQL/MongoDB"],
  "mobile-app-developer": ["React Native", "Swift", "Kotlin", "Flutter"],
  "writing-content": ["Google Docs", "Notion", "Canva", "SEMrush"],
  "digital-marketing": ["Google Ads", "Meta Ads Manager", "Google Analytics", "Mailchimp"],
  "production-media": ["Premiere Pro", "DaVinci Resolve", "Lightroom", "Final Cut Pro"],
};
