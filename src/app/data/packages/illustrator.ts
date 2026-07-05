import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
// GÜVEN NOTU: Türkiye rakamları için net, sayfa/adet bazlı somut bir Türkiye
// kaynağı bulunamadı — bu üç kategorideki Türkiye rakamları tahmini/düşük
// güvenilirliklidir, genel grafik tasarım fiyat oranlarından türetilmiştir.
// Doğu/Batı Avrupa rakamları uluslararası kaynaklardan (voxillustration.com
// sayfa-bazlı çocuk kitabı illüstrasyon rakamları, Fiverr/Truelancer bölgesel
// illüstrasyon verileri) alındı, bunlar daha güvenilir.
export const ILLUSTRATOR_CATEGORIES: RoleCategorySet = {
  roleId: "illustration",
  categories: [
    {
      id: "childrens-book",
      label: "Çocuk Kitabı İllüstrasyonu",
      labelEn: "Children's Book Illustration",
      items: ["Karakter geliştirme ve onay taslakları (Eskiz)", "Tam sayfa ve çift sayfa yayılım kompozisyonları", "Vinyet (spot çizimler)", "Kitap ön, arka kapak ve sırt çizimi"],
      itemsEn: ["Character development and approval sketches", "Full-page and double-page spread compositions", "Vignette (spot illustrations)", "Book front, back cover and spine illustration"],
      price: {
        turkey: { junior: 93, mid: 150, senior: 215 },
        eastern: { junior: 403, mid: 650, senior: 930 },
        western: { junior: 1037, mid: 1674, senior: 2394 },
      },
    },
    {
      id: "comic-panel",
      label: "Çizgi Roman/Panel İllüstrasyonu",
      labelEn: "Comic/Panel Illustration",
      items: ["Sayfa ve panel kurgusu (Layout/Penciling)", "Siyah-beyaz çinileme (Inking)", "Atmosferik renklendirme (Coloring)", "Konuşma balonları, ses efektleri ve yazı yerleşimi (Lettering)", "Varyant kapak illüstrasyonları"],
      itemsEn: ["Page and panel layout (penciling)", "Black-and-white inking", "Atmospheric coloring", "Speech bubbles, SFX and lettering", "Variant cover illustrations"],
      price: {
        turkey: { junior: 76, mid: 122, senior: 174 },
        eastern: { junior: 346, mid: 558, senior: 798 },
        western: { junior: 865, mid: 1395, senior: 1995 },
      },
    },
    {
      id: "digital-painter",
      label: "Özel Sipariş",
      labelEn: "Custom Commission",
      items: ["Bireysel portre siparişleri (Commission)", "Koleksiyonluk kart oyunları için kart çizimleri", "Müzik albüm kapağı veya poster için özel konsept sanat eserleri"],
      itemsEn: ["Individual portrait commissions", "Trading card game illustrations", "Custom concept art for music album covers or posters"],
      price: {
        turkey: { junior: 47, mid: 75, senior: 107 },
        eastern: { junior: 231, mid: 372, senior: 532 },
        western: { junior: 577, mid: 930, senior: 1330 },
      },
    },
  ],
};
