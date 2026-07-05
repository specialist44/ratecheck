import type { Currency, Experience, Region } from "../types";

// Multipliers relative to Eastern Europe / Mid baseline
export const REGION_MULT: Record<Region, number> = { turkey: 0.55, eastern: 1.0, western: 1.52 };
export const EXP_MULT: Record<Experience, number> = { junior: 0.62, mid: 1.0, senior: 1.42 };
export const CUR_RATE: Record<Currency, number> = { EUR: 1, TRY: 53.3, GBP: 0.86 };
export const CUR_SYMBOL: Record<Currency, string> = { EUR: "€", TRY: "₺", GBP: "£" };

export function formatPrice(baseEur: [number, number], region: Region, exp: Experience, cur: Currency): string {
  const m = REGION_MULT[region] * EXP_MULT[exp] * CUR_RATE[cur];
  const s = CUR_SYMBOL[cur];
  return `${s}${Math.round(baseEur[0] * m)}–${s}${Math.round(baseEur[1] * m)}`;
}

// Home screen only collects a specific country, not a region bucket — map it here.
export const COUNTRY_REGION: Record<string, Region> = {
  "Türkiye": "turkey",
  "Almanya": "western",
  "İngiltere": "western",
  "Fransa": "western",
  "Polonya": "eastern",
};

// variantIds: kategoriId -> mecra id (sadece cat.variants olan kategoriler için, bkz. data/packages/types.ts)
// subItemIds: kategoriId -> seçilen alt kalem id listesi (sadece cat.subItems olan kategoriler için, çoklu seçim)
export type CalcInput = { roleId: string; experience: Experience; region: Region; currency: Currency; categoryIds: string[]; variantIds: Record<string, string>; subItemIds: Record<string, string[]> };
