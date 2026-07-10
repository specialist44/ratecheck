import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const WEB_DEVELOPER_CATEGORIES: RoleCategorySet = {
  roleId: "web-developer",
  categories: [
    {
      id: "frontend-developer",
      label: "Frontend Geliştirici",
      labelEn: "Frontend Developer",
      items: ["HTML5/CSS3 ve JavaScript ile tasarımları koda dökme (Pixel-perfect)", "React, Vue veya Angular gibi frameworklerle tek sayfa uygulama (SPA) inşası", "CSS animasyonları ve scroll etkileşimlerinin kodlanması", "WCAG erişilebilirlik standartlarına ve SEO teknik altyapısına uygun kodlama"],
      itemsEn: ["Pixel-perfect coding of designs with HTML5/CSS3/JavaScript", "Building single-page applications (SPA) with React, Vue, or Angular", "Coding CSS animations and scroll interactions", "WCAG accessibility standards and SEO-compliant coding"],
      price: {
        turkey: { junior: 301, mid: 486, senior: 695 },
        eastern: { junior: 670, mid: 1080, senior: 1544 },
        western: { junior: 1116, mid: 1800, senior: 2574 },
        us: { junior: 1228, mid: 1980, senior: 2831 },
      },
    },
    {
      id: "backend-developer",
      label: "Backend Geliştirici",
      labelEn: "Backend Developer",
      items: ["RESTful veya GraphQL API uçlarının (Endpoint) yazılması", "SQL (PostgreSQL, MySQL) veya NoSQL (MongoDB) veritabanı mimarisinin kurulumu", "Kullanıcı yetkilendirme (Auth), JWT ve veri güvenliği kurguları", "Üçüncü parti ödeme geçitleri (Stripe, Iyzico) entegrasyonu"],
      itemsEn: ["Writing RESTful or GraphQL API endpoints", "Setting up SQL (PostgreSQL, MySQL) or NoSQL (MongoDB) database architecture", "User authentication (auth), JWT, and data security setups", "Third-party payment gateway (Stripe, Iyzico) integration"],
      price: {
        turkey: { junior: 251, mid: 405, senior: 579 },
        eastern: { junior: 558, mid: 900, senior: 1287 },
        western: { junior: 930, mid: 1500, senior: 2145 },
        us: { junior: 1023, mid: 1650, senior: 2360 },
      },
    },
    {
      id: "fullstack-developer",
      label: "Fullstack Geliştirici",
      labelEn: "Fullstack Developer",
      items: ["Sıfırdan SaaS (Hizmet olarak yazılım) MVP'sinin uçtan uca kodlanması", "CMS (WordPress, Strapi) özel tema ve eklenti/modül programlama", "Sunucu kurulumu, domain yönlendirme ve canlıya alma (Deployment) süreçleri"],
      itemsEn: ["End-to-end coding of a SaaS MVP from scratch", "Custom CMS (WordPress, Strapi) theme and plugin/module programming", "Server setup, domain routing, and deployment processes"],
      price: {
        turkey: { junior: 586, mid: 945, senior: 1351 },
        eastern: { junior: 1302, mid: 2100, senior: 3003 },
        western: { junior: 2170, mid: 3500, senior: 5005 },
        us: { junior: 2387, mid: 3850, senior: 5506 },
      },
    },
  ],
};
