import type { Region, Experience } from "../../types";

// Bir kategorinin deneyim x bölge bazlı sabit paket fiyatı, EUR baseline
// (mevcut pricing.ts / CATALOG'daki gibi; ekranda CUR_RATE ile TRY/EUR/GBP'ye çevrilir)
export type PackagePriceTable = Record<Region, Record<Experience, number>>;

export interface RoleCategoryDef {
  id: string; // stabil slug, dil değişse de sabit kalır (örn. "corporate-identity")
  label: string; // TR
  labelEn: string; // EN
  price: PackagePriceTable;
}

export interface RoleCategorySet {
  roleId: string; // roles.ts / ROLE_IDS ile aynı slug
  categories: RoleCategoryDef[];
}
