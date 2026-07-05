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

export interface RoleCategoryDef {
  id: string; // stabil slug, dil değişse de sabit kalır (örn. "corporate-identity")
  label: string; // TR
  labelEn: string; // EN
  items: string[]; // kategorinin kapsadığı alt kalemler, TR — checkbox açıklaması + detay listesi bundan türetilir
  itemsEn: string[]; // EN
  // Bir kategoride ya price ya variants olur, ikisi birden değil: mecra ayrımı
  // yoksa price kullanılır (mevcut roller), mecra ayrımı varsa variants kullanılır
  // (Konsept Sanatı) ve price tanımsız kalır.
  price?: PackagePriceTable;
  variants?: RoleCategoryVariant[];
}

export interface RoleCategorySet {
  roleId: string; // roles.ts / ROLE_IDS ile aynı slug
  categories: RoleCategoryDef[];
}
