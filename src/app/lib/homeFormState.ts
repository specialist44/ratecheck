import type { Currency, Experience } from "../types";

const STORAGE_KEY = "ratecheck.homeForm";

const EXPERIENCES: Experience[] = ["junior", "mid", "senior"];
const CURRENCIES: Currency[] = ["TRY", "EUR", "GBP"];

export interface HomeFormState {
  roleId: string;
  experience: Experience;
  currency: Currency;
  country: string;
  selectedChips: string[];
  selectedCategoryIds: string[];
  selectedVariantIds: Record<string, string>;
}

export function saveHomeFormState(state: HomeFormState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable (private mode, disabled, etc.) — silently skip
  }
}

export function clearHomeFormState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable (private mode, disabled, etc.) — silently skip
  }
}

// Guards against malformed/hand-edited storage falling back to undefined,
// so callers can apply the same defaults HomeScreen used before.
export function loadHomeFormState(): Partial<HomeFormState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      roleId: typeof parsed.roleId === "string" ? parsed.roleId : undefined,
      experience: EXPERIENCES.includes(parsed.experience) ? parsed.experience : undefined,
      currency: CURRENCIES.includes(parsed.currency) ? parsed.currency : undefined,
      country: typeof parsed.country === "string" ? parsed.country : undefined,
      selectedChips: Array.isArray(parsed.selectedChips) && parsed.selectedChips.every((c: unknown) => typeof c === "string")
        ? parsed.selectedChips
        : undefined,
      selectedCategoryIds: Array.isArray(parsed.selectedCategoryIds) && parsed.selectedCategoryIds.every((c: unknown) => typeof c === "string")
        ? parsed.selectedCategoryIds
        : undefined,
      selectedVariantIds: parsed.selectedVariantIds && typeof parsed.selectedVariantIds === "object"
        && Object.entries(parsed.selectedVariantIds).every(([k, v]) => typeof k === "string" && typeof v === "string")
        ? parsed.selectedVariantIds
        : undefined,
    };
  } catch {
    return {};
  }
}
