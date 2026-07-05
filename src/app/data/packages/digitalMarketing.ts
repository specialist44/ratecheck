import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const DIGITAL_MARKETING_CATEGORIES: RoleCategorySet = {
  roleId: "digital-marketing",
  categories: [
    {
      id: "social-media-specialist",
      label: "Sosyal Medya Uzmanı",
      labelEn: "Social Media Specialist",
      items: ["Platform bazlı aylık içerik takvimi (Content Calendar) oluşturma", "Gönderilerin zamanlanması ve otomatik paylaşım yönetimi", "Topluluk yönetimi (Yorum cevaplama, DM iletişimi, kriz yönetimi)", "Çekiliş, etkileşim kampanyaları ve marka işbirlikleri kurgusu"],
      itemsEn: ["Platform-based monthly content calendar creation", "Post scheduling and automated publishing management", "Community management (comment replies, DM communication, crisis management)", "Giveaway, engagement campaign, and brand collaboration planning"],
      price: {
        turkey: { junior: 119, mid: 192, senior: 275 },
        eastern: { junior: 341, mid: 550, senior: 786 },
        western: { junior: 620, mid: 1000, senior: 1430 },
      },
    },
    {
      id: "seo-specialist",
      label: "SEO Uzmanı",
      labelEn: "SEO Specialist",
      items: ["Kapsamlı site içi teknik SEO denetimi (Core Web Vitals, indexleme hataları)", "Anahtar kelime araştırması (Keyword Research) ve içerik boşluğu (Gap) analizi", "On-Page Optimizasyon (Title, Meta Description, H1/H2 yapılandırması)", "Off-Page Stratejisi (Kaliteli backlink inşası ve PR yönetimi)", "Yerel SEO (Google Benim İşletmem) harita optimizasyonları"],
      itemsEn: ["Comprehensive on-site technical SEO audit (Core Web Vitals, indexing errors)", "Keyword research and content gap analysis", "On-page optimization (title, meta description, H1/H2 structuring)", "Off-page strategy (quality backlink building and PR management)", "Local SEO (Google Business Profile) map optimizations"],
      price: {
        turkey: { junior: 107, mid: 173, senior: 247 },
        eastern: { junior: 307, mid: 495, senior: 708 },
        western: { junior: 558, mid: 900, senior: 1287 },
      },
    },
  ],
};
