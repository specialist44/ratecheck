import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const BRAND_DESIGNER_CATEGORIES: RoleCategorySet = {
  roleId: "brand-designer",
  categories: [
    {
      id: "strategy-naming",
      label: "Strateji ve İsimlendirme",
      labelEn: "Strategy & Naming",
      items: ["Görsel rakip analizi ve pazar konumlandırma raporu", "Marka kişiliği ve ses tonu (Brand voice) belirleme"],
      itemsEn: ["Competitive visual analysis and market positioning report", "Brand personality and voice tone definition"],
      price: {
        turkey: { junior: 92, mid: 150, senior: 215 },
        eastern: { junior: 372, mid: 600, senior: 858 },
        western: { junior: 930, mid: 1500, senior: 2145 },
      },
    },
    {
      id: "core-identity",
      label: "Ana Kimlik İnşası",
      labelEn: "Core Identity Build",
      items: ["Logo tasarımı (Amblem ve logotip)", "Alternatif logo varyasyonları", "Marka renk paleti oluşturma", "Kurumsal tipografi seçimi ve lisanslaması"],
      itemsEn: ["Logo design (emblem and logotype)", "Alternative logo variations", "Brand color palette creation", "Corporate typography selection and licensing"],
      price: {
        turkey: { junior: 174, mid: 281, senior: 402 },
        eastern: { junior: 744, mid: 1200, senior: 1716 },
        western: { junior: 1736, mid: 2800, senior: 4004 },
      },
    },
    {
      id: "guidelines",
      label: "Kılavuzlama",
      labelEn: "Guidelines",
      items: ["Brandbook (Kurumsal Kimlik Kılavuzu) PDF belgesi", "Logonun hatalı kullanım kuralları sayfası", "Marka fotoğraf ve illüstrasyon dili standartları"],
      itemsEn: ["Brandbook (Corporate Identity Guide) PDF document", "Logo misuse rules page", "Brand photography and illustration language standards"],
      price: {
        turkey: { junior: 81, mid: 131, senior: 187 },
        eastern: { junior: 310, mid: 500, senior: 715 },
        western: { junior: 744, mid: 1200, senior: 1716 },
      },
    },
  ],
};
