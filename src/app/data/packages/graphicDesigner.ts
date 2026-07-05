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
      items: ["Kartvizit", "Antetli kağıt", "Zarf", "Cepli dosya", "Yaka kartı", "Fatura şablonu"],
      itemsEn: ["Business card", "Letterhead", "Envelope", "Presentation folder", "ID badge", "Invoice template"],
      // Doğu Avrupa değeri 5 Temmuz 2026 tarihinde düzeltildi — orijinal rakam (316/509/729)
      // diğer kategorilerle tutarsız/anormal düşüktü, rolün kendi iç Doğu/Batı oran ortalaması
      // (%56.6 — diğer 3 kategorinin eastern/western orta düzey oranından) baz alınarak,
      // gerçek Batı Avrupa orta düzey değeri (1528) üzerinden yeniden hesaplandı.
      price: {
        turkey: { junior: 291, mid: 469, senior: 671 },
        eastern: { junior: 537, mid: 866, senior: 1238 },
        western: { junior: 947, mid: 1528, senior: 2185 },
      },
    },
    {
      id: "print-editorial",
      label: "Basılı Yayın/Editoryal Tasarım",
      labelEn: "Print/Editorial Design",
      items: ["Katalog", "Broşür", "Dergi/kitap kapağı", "Menü tasarımı"],
      itemsEn: ["Catalog", "Brochure", "Magazine/book cover", "Menu design"],
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
      items: ["Kutu/ambalaj", "Etiket", "Tekstil baskı", "Promosyon ürünleri"],
      itemsEn: ["Box/packaging", "Label", "Apparel print", "Promotional items"],
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
      items: ["Sosyal medya post/story", "Reklam banner", "YouTube thumbnail", "E-posta görseli", "Sunum slaytı"],
      itemsEn: ["Social media post/story", "Ad banner", "YouTube thumbnail", "Email visual", "Presentation slide"],
      price: {
        turkey: { junior: 47, mid: 75, senior: 107 },
        eastern: { junior: 115, mid: 185, senior: 265 },
        western: { junior: 230, mid: 370, senior: 530 },
      },
    },
  ],
};
