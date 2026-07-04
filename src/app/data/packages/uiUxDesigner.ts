import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const UI_UX_DESIGNER_CATEGORIES: RoleCategorySet = {
  roleId: "ui-ux-product-designer",
  categories: [
    {
      id: "ux-research",
      label: "UX Araştırma ve Analiz",
      labelEn: "UX Research & Analysis",
      items: ["Kullanıcı Persona kartları", "Kullanıcı Yolculuğu Haritası", "Rakip arayüz analizi", "Kullanılabilirlik test senaryoları ve sonuç raporları"],
      itemsEn: ["User persona cards", "User journey map", "Competitor interface analysis", "Usability test scenarios and result reports"],
      price: {
        turkey: { junior: 93, mid: 150, senior: 215 },
        eastern: { junior: 279, mid: 450, senior: 644 },
        western: { junior: 403, mid: 650, senior: 930 },
      },
    },
    {
      id: "information-architecture",
      label: "Bilgi Mimarisi ve İskelet",
      labelEn: "Information Architecture & Wireframing",
      items: ["Site haritası dokümantasyonu", "Kullanıcı akış şemaları", "Düşük sadakatli tel çerçeveler (Low-Fi Wireframing)"],
      itemsEn: ["Sitemap documentation", "User flow diagrams", "Low-fidelity wireframes"],
      price: {
        turkey: { junior: 58, mid: 94, senior: 134 },
        eastern: { junior: 217, mid: 350, senior: 501 },
        western: { junior: 310, mid: 500, senior: 715 },
      },
    },
    {
      id: "ui-design",
      label: "UI Tasarımı",
      labelEn: "UI Design",
      items: ["Masaüstü/tablet/mobil responsive web tasarımları", "iOS ve Android native mobil uygulama ekranları", "SaaS/B2B dashboard ve admin arayüzleri", "Dönüşüm odaklı landing page tasarımları", "A/B testi için varyasyonlu arayüz tasarımları"],
      itemsEn: ["Responsive web designs (desktop/tablet/mobile)", "iOS and Android native app screens", "SaaS/B2B dashboard and admin interfaces", "Conversion-focused landing page designs", "A/B test interface variations"],
      price: {
        turkey: { junior: 139, mid: 225, senior: 322 },
        eastern: { junior: 372, mid: 600, senior: 858 },
        western: { junior: 558, mid: 900, senior: 1287 },
      },
    },
    {
      id: "prototyping-handoff",
      label: "Prototipleme ve Handoff",
      labelEn: "Prototyping & Handoff",
      items: ["Tıklanabilir Hi-Fi Figma prototipleri", "Mikro-etkileşim ve sayfa geçiş senaryoları", "UI Kit inşası", "Developer Handoff redline ve asset dışa aktarımı"],
      itemsEn: ["Clickable Hi-Fi Figma prototypes", "Micro-interaction and page transition scenarios", "UI Kit construction", "Developer handoff redlines and asset export"],
      price: {
        turkey: { junior: 70, mid: 113, senior: 162 },
        eastern: { junior: 217, mid: 350, senior: 501 },
        western: { junior: 341, mid: 550, senior: 787 },
      },
    },
  ],
};
