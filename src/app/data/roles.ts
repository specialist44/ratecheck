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

export function getRoleId(role: string, lang: "tr" | "en"): string | null {
  const list = lang === "tr" ? ROLES_TR : ROLES_EN;
  const index = list.indexOf(role);
  return index === -1 ? null : ROLE_IDS[index];
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

export const CHIPS_TR = [
  { group: "Sektör", items: ["Teknoloji","E-ticaret","Sağlık","Eğitim","Finans","Medya","Startup","Kurumsal"] },
];
export const CHIPS_EN = [
  { group: "Sector", items: ["Tech","E-commerce","Health","Education","Finance","Media","Startup","Enterprise"] },
];

// roleId -> araç listesi (TR/EN'de aynı, sadece çevre metin dile göre değişir).
export const TOOLS_BY_ROLE_ID: Record<string, string[]> = {
  "graphic-designer": ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Canva"],
  "brand-designer": ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Canva"],
  "ui-ux-product-designer": ["Figma", "Adobe XD", "Sketch", "Miro"],
  "illustration": ["Procreate", "Adobe Illustrator", "Photoshop", "Clip Studio Paint"],
  "concept-art": ["Photoshop", "Procreate", "Clip Studio Paint", "Adobe Illustrator"],
  "animator": ["After Effects", "Toon Boom", "Blender", "Clip Studio Paint"],
  "motion-vfx": ["After Effects", "Cinema 4D", "Blender"],
  "web-developer": ["React", "WordPress", "Shopify", "Webflow"],
  "mobile-app-developer": ["React Native", "Swift", "Kotlin", "Flutter"],
  "writing-content": ["Google Docs", "Notion", "Canva", "SEMrush"],
  "digital-marketing": ["Google Ads", "Meta Ads Manager", "Google Analytics", "Mailchimp"],
  "production-media": ["Premiere Pro", "DaVinci Resolve", "Lightroom", "Final Cut Pro"],
};
