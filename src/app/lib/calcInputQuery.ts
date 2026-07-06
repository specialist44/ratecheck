import type { Currency, Experience, Region } from "../types";
import type { CalcInput } from "./pricing";
import { DEFAULT_DURATION_SECONDS, clampDurationSeconds } from "./durationPricing";

const EXPERIENCES: Experience[] = ["junior", "mid", "senior"];
const REGIONS: Region[] = ["turkey", "eastern", "western"];
const CURRENCIES: Currency[] = ["EUR", "TRY", "GBP"];

export function calcInputToSearchParams(input: CalcInput): URLSearchParams {
  return new URLSearchParams({
    roleId: input.roleId,
    experience: input.experience,
    region: input.region,
    currency: input.currency,
    categories: input.categoryIds.join(","),
    variants: Object.entries(input.variantIds).map(([catId, variantId]) => `${catId}:${variantId}`).join(","),
    subitems: Object.entries(input.subItemIds).filter(([, ids]) => ids.length > 0).map(([catId, ids]) => `${catId}:${ids.join("|")}`).join(","),
    duration: String(input.durationSeconds),
  });
}

// Guards against malformed/hand-edited query strings (e.g. after F5 or a
// shared link) falling back to the same defaults ResultsScreen used before.
export function calcInputFromSearchParams(params: URLSearchParams): CalcInput {
  const experience = params.get("experience");
  const region = params.get("region");
  const currency = params.get("currency");
  const categories = params.get("categories");
  const variants = params.get("variants");
  const subitems = params.get("subitems");
  const variantIds: Record<string, string> = {};
  if (variants) {
    for (const pair of variants.split(",").filter(Boolean)) {
      const [catId, variantId] = pair.split(":");
      if (catId && variantId) variantIds[catId] = variantId;
    }
  }
  const subItemIds: Record<string, string[]> = {};
  if (subitems) {
    for (const pair of subitems.split(",").filter(Boolean)) {
      const [catId, ids] = pair.split(":");
      const itemIds = ids ? ids.split("|").filter(Boolean) : [];
      if (catId && itemIds.length > 0) subItemIds[catId] = itemIds;
    }
  }
  return {
    roleId: params.get("roleId") ?? "",
    experience: EXPERIENCES.includes(experience as Experience) ? (experience as Experience) : "mid",
    region: REGIONS.includes(region as Region) ? (region as Region) : "eastern",
    currency: CURRENCIES.includes(currency as Currency) ? (currency as Currency) : "EUR",
    categoryIds: categories ? categories.split(",").filter(Boolean) : [],
    variantIds,
    subItemIds,
    durationSeconds: params.has("duration") ? clampDurationSeconds(Number(params.get("duration"))) : DEFAULT_DURATION_SECONDS,
  };
}
