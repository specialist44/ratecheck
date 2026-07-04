import type { RoleCategorySet } from "./types";

// Kaynak veri: Türkiye rakamları TRY, Doğu/Batı Avrupa rakamları USD verildi.
// EUR baseline'a çevrildi: TRY / 53.3 (CUR_RATE), USD / 1.08 (kullanıcı onaylı kur).
export const GRAPHIC_DESIGNER_CATEGORIES: RoleCategorySet = {
  roleId: "graphic-designer",
  categories: [
    {
      id: "corporate-identity",
      label: "Kurumsal Kimlik",
      labelEn: "Corporate Identity",
      price: {
        turkey: { junior: 291, mid: 469, senior: 671 },
        eastern: { junior: 316, mid: 509, senior: 729 },
        western: { junior: 947, mid: 1528, senior: 2185 },
      },
    },
    {
      id: "print-editorial",
      label: "Basılı Yayın/Editoryal Tasarım",
      labelEn: "Print/Editorial Design",
      price: {
        turkey: { junior: 174, mid: 281, senior: 402 },
        eastern: { junior: 287, mid: 463, senior: 662 },
        western: { junior: 517, mid: 833, senior: 1192 },
      },
    },
    {
      id: "packaging-promo",
      label: "Ambalaj ve Promosyon",
      labelEn: "Packaging & Promotion",
      price: {
        turkey: { junior: 128, mid: 206, senior: 295 },
        eastern: { junior: 258, mid: 417, senior: 596 },
        western: { junior: 402, mid: 648, senior: 927 },
      },
    },
    {
      id: "static-digital",
      label: "Statik Dijital Görseller",
      labelEn: "Static Digital Visuals",
      price: {
        turkey: { junior: 47, mid: 75, senior: 107 },
        eastern: { junior: 115, mid: 185, senior: 265 },
        western: { junior: 230, mid: 370, senior: 530 },
      },
    },
  ],
};
