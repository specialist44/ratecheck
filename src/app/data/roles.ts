export const ROLES_TR = [
  // Tasarım
  "UI/UX Tasarımcı","Grafik Tasarımcı","Marka Tasarımcısı","Ürün Tasarımcısı",
  // İllüstrasyon
  "İllüstratör","Karakter Tasarımcısı","Konsept Sanatçısı","Çizgi Roman Sanatçısı","Çocuk Kitabı İllüstratörü","Dijital Ressam","Storyboard Sanatçısı",
  // Animasyon
  "2D Animatör","3D Animatör","Motion Tasarımcı","Kare-Kare Animatör","Karakter Animatörü","VFX Sanatçısı","Stop Motion Animatör",
  // Geliştirici
  "Web Geliştirici","Frontend Geliştirici","Backend Geliştirici","Fullstack Geliştirici","Mobil Uygulama Geliştirici",
  // İçerik
  "Metin Yazarı (Copywriter)","İçerik Üreticisi","Sosyal Medya Uzmanı","SEO Uzmanı",
  // Video & Fotoğraf
  "Video Editör","Fotoğrafçı","Podcast Yapımcısı",
];
export const ROLES_EN = [
  // Design
  "UI/UX Designer","Graphic Designer","Brand Designer","Product Designer",
  // Illustration
  "Illustrator","Character Designer","Concept Artist","Comic Artist","Children's Book Illustrator","Digital Painter","Storyboard Artist",
  // Animation
  "2D Animator","3D Animator","Motion Designer","Frame-by-Frame Animator","Character Animator","VFX Artist","Stop Motion Animator",
  // Development
  "Web Developer","Frontend Developer","Backend Developer","Fullstack Developer","Mobile App Developer",
  // Content
  "Copywriter","Content Creator","Social Media Specialist","SEO Specialist",
  // Video & Photo
  "Video Editor","Photographer","Podcast Producer",
];

// Typical market-average project length per role, in hours. Index-aligned with
// ROLES_TR / ROLES_EN so the calculator can suggest a duration instead of asking
// the user to guess one before seeing any rate data.
export const ROLE_DEFAULT_HOURS = [
  // Design
  40, 25, 45, 50,
  // Illustration
  20, 18, 25, 35, 40, 20, 30,
  // Animation
  50, 60, 35, 55, 45, 50, 60,
  // Development
  80, 70, 90, 100, 120,
  // Content
  10, 15, 20, 25,
  // Video & Photo
  25, 15, 20,
];

export const CHIPS_TR = [
  { group: "Sektör", items: ["Teknoloji","E-ticaret","Sağlık","Eğitim","Finans","Medya","Startup","Kurumsal"] },
];
export const CHIPS_EN = [
  { group: "Sector", items: ["Tech","E-commerce","Health","Education","Finance","Media","Startup","Enterprise"] },
];

export type RoleCategory = "design" | "illustration" | "animation" | "development" | "content" | "video-photo";

// Index-aligned with ROLES_TR / ROLES_EN / ROLE_DEFAULT_HOURS
export const ROLE_CATEGORIES: RoleCategory[] = [
  // Design
  "design", "design", "design", "design",
  // Illustration
  "illustration", "illustration", "illustration", "illustration", "illustration", "illustration", "illustration",
  // Animation
  "animation", "animation", "animation", "animation", "animation", "animation", "animation",
  // Development
  "development", "development", "development", "development", "development",
  // Content
  "content", "content", "content", "content",
  // Video & Photo
  "video-photo", "video-photo", "video-photo",
];

export function getRoleCategory(role: string, lang: "tr" | "en"): RoleCategory | null {
  const list = lang === "tr" ? ROLES_TR : ROLES_EN;
  const index = list.indexOf(role);
  return index === -1 ? null : ROLE_CATEGORIES[index];
}

// Tool names are the same in TR and EN, only the surrounding UI language differs.
export const TOOLS_BY_CATEGORY: Record<RoleCategory, string[]> = {
  design: ["Figma", "Adobe XD", "Sketch", "Adobe Illustrator", "Adobe Photoshop", "Canva"],
  illustration: ["Procreate", "Adobe Illustrator", "Clip Studio Paint", "Photoshop"],
  animation: ["After Effects", "Blender", "Cinema 4D", "Toon Boom", "Clip Studio Paint"],
  development: ["React", "WordPress", "Shopify", "Webflow"],
  content: ["Google Docs", "Notion", "Canva", "Ahrefs", "SEMrush", "Excel", "Word"],
  "video-photo": ["Premiere Pro", "Final Cut Pro", "Lightroom", "DaVinci Resolve", "After Effects"],
};
