import type { Currency, Experience, Region } from "../types";
import type { PackagePriceTable } from "../data/packages/types";
import { CUR_RATE } from "./pricing";

// UI/UX ve Ürün Tasarımcısı rolünde "ui-design" ve "information-architecture"
// kategorilerinde ekran/sayfa sayısı fiyatı. Mevcut sabit price tablosu (bkz.
// data/packages/uiUxDesigner.ts) piyasa araştırmasıyla doğrulandı: örtük olarak
// 3 ekranlık temel kapsamı karşılıyor. 3'ün üzerindeki her ekran için bu dosyadaki
// ek ücret ekleniyor — price tablosundaki 36 veri noktası DEĞİŞMEDİ, sadece üstüne
// bu mekanizma eklendi.
export const DEFAULT_SCREEN_COUNT = 3;
export const MIN_SCREEN_COUNT = 1;

// roleId -> bu roldeki ekran-sayısı-fiyatlı kategori id'leri. Diğer roller ve
// diğer kategoriler (ux-research, prototyping-handoff) bu listede yok — ekran
// sorusu SADECE burada listelenen (roleId, categoryId) çiftlerinde sorulur.
const SCREEN_COUNT_PRICED_CATEGORIES: Record<string, string[]> = {
  "ui-ux-product-designer": ["ui-design", "information-architecture"],
};

export function isScreenCountPricedCategory(roleId: string, categoryId: string): boolean {
  return SCREEN_COUNT_PRICED_CATEGORIES[roleId]?.includes(categoryId) ?? false;
}

// Elle bozulmuş URL/storage değerlerine karşı: NaN/Infinity → varsayılana,
// 1'in altındaki değerler 1'e kırpılır (üst sınır yok — büyük projeler için).
export function clampScreenCount(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SCREEN_COUNT;
  return Math.max(MIN_SCREEN_COUNT, Math.round(n));
}

// Ek ekran başına deneyime göre taban ücret. Piyasa araştırmasında USD baz
// alındı (Junior 80, Mid 150, Senior 280), EUR baseline'a ~0.93 kurla çevrildi
// (bkz. data/packages/*.ts "veri doğrudan EUR baseline" konvansiyonu).
const EXTRA_SCREEN_BASE_EUR: Record<Experience, number> = {
  junior: 80 * 0.93,
  mid: 150 * 0.93,
  senior: 280 * 0.93,
};

// Region çarpanı HARDCODE edilmiyor: ilgili kategorinin KENDİ price tablosundan
// türetiliyor (eastern[exp]/turkey[exp], western[exp]/turkey[exp]). Bu oran her
// deneyim seviyesinde neredeyse sabit kalıyor (ör. ui-design'da Eastern/Turkey
// ~2.67x, Western/Turkey ~4.0x — junior/mid/senior farkı %1'in altında), bu
// yüzden seçili deneyimin kendi oranı kullanılıyor. Her kategori kendi region
// oranını korur: information-architecture'ın oranları (~3.73x/~5.33x) ui-design'dan
// (~2.67x/~4.0x) farklıdır çünkü ayrı price tablosundan hesaplanır.
function regionMultiplier(priceTable: PackagePriceTable, region: Region, exp: Experience): number {
  if (region === "turkey") return 1;
  return priceTable[region][exp] / priceTable.turkey[exp];
}

// priceTable: kategorinin KENDİ price tablosu (cat.price!) — hangi kategori
// için çağrıldığına göre farklı region çarpanı üretir. Dönen değer zaten
// currency'ye çevrilmiştir, resolveCategoryPrice'ın sonucuna DOĞRUDAN eklenebilir.
export function extraScreenFee(priceTable: PackagePriceTable, region: Region, exp: Experience, currency: Currency, screenCount: number): number {
  const extraScreens = Math.max(0, clampScreenCount(screenCount) - DEFAULT_SCREEN_COUNT);
  if (extraScreens === 0) return 0;
  const mult = regionMultiplier(priceTable, region, exp);
  return extraScreens * EXTRA_SCREEN_BASE_EUR[exp] * mult * CUR_RATE[currency];
}
