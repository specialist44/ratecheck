import type { Region, Experience } from "../../types";

// Bir kategorinin deneyim x bölge bazlı sabit paket fiyatı, EUR baseline
// (mevcut pricing.ts / CATALOG'daki gibi; ekranda CUR_RATE ile TRY/EUR/GBP'ye çevrilir)
export type PackagePriceTable = Record<Region, Record<Experience, number>>;

// Bir kategorinin "mecra" (Oyun/Film/Kutu Oyunu vb.) bazlı alt fiyat tablosu —
// Konsept Sanatı gibi aynı iş türünün mecraya göre çok değişken fiyatlandığı
// rollerde kategori.price yerine kategori.variants kullanılır (bkz. RoleCategoryDef).
export interface RoleCategoryVariant {
  id: string; // stabil slug (örn. "game")
  label: string; // TR
  labelEn: string; // EN
  price: PackagePriceTable;
}

// Bir kategorinin ÇOKLU SEÇİLEBİLEN alt kalemi — mecra (variant, tekli seçim)
// aksine, kullanıcı istediği kadar alt kalem seçebilir, seçilenlerin fiyatı
// toplanıp kategori toplamı olur (bkz. Motion Tasarımcı ve VFX, motionVfxArtist.ts).
export interface RoleCategorySubItem {
  id: string; // stabil slug (örn. "logo-animations")
  label: string; // TR
  labelEn: string; // EN
  price: PackagePriceTable;
}

export interface RoleCategoryDef {
  id: string; // stabil slug, dil değişse de sabit kalır (örn. "corporate-identity")
  label: string; // TR
  labelEn: string; // EN
  items: string[]; // kategorinin kapsadığı alt kalemler, TR — checkbox açıklaması + detay listesi bundan türetilir
  itemsEn: string[]; // EN
  // Bir kategoride price, variants veya subItems'tan sadece BİRİ olur, hiçbir zaman
  // ikisi birden: mecra/alt-kalem ayrımı yoksa price kullanılır (çoğu rol), tekli
  // mecra seçimi varsa variants (Konsept Sanatı, Motion/VFX önceki sürüm), çoklu
  // seçilebilir alt kalem toplaması varsa subItems (Motion Tasarımcı ve VFX) kullanılır.
  price?: PackagePriceTable;
  variants?: RoleCategoryVariant[];
  subItems?: RoleCategorySubItem[];
}

export interface RoleCategorySet {
  roleId: string; // roles.ts / ROLE_IDS ile aynı slug
  categories: RoleCategoryDef[];
}
