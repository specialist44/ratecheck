import type { Currency, Experience, Lang, Region } from "../types";
import { ROLES_TR, ROLES_EN, ROLE_DEFAULT_HOURS } from "../data/roles";

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

// ─── Hourly calculator ────────────────────────────────────────────────────────

// Baseline hourly rate = Eastern Europe / Mid-level, in EUR (same approach as CATALOG baseEur)
const BASE_HOURLY_EUR = 52;

// Home screen only collects a specific country, not a region bucket — map it here.
export const COUNTRY_REGION: Record<string, Region> = {
  "Türkiye": "turkey",
  "Almanya": "western",
  "İngiltere": "western",
  "Fransa": "western",
  "Polonya": "eastern",
};

export function hourlyRate(region: Region, exp: Experience, cur: Currency): number {
  return BASE_HOURLY_EUR * REGION_MULT[region] * EXP_MULT[exp] * CUR_RATE[cur];
}

const DEFAULT_HOURS_FALLBACK = 40;
export function getDefaultHours(role: string, lang: Lang): number {
  const roles = lang === "tr" ? ROLES_TR : ROLES_EN;
  const idx = roles.indexOf(role);
  return idx >= 0 ? ROLE_DEFAULT_HOURS[idx] : DEFAULT_HOURS_FALLBACK;
}

export type CalcInput = { role: string; experience: Experience; region: Region; currency: Currency; categoryIds: string[] };
