import type { Currency, Experience } from "../types";

const STORAGE_KEY = "ratecheck.homeForm";

const EXPERIENCES: Experience[] = ["junior", "mid", "senior"];
const CURRENCIES: Currency[] = ["TRY", "EUR", "GBP"];

export interface HomeFormState {
  role: string;
  experience: Experience;
  currency: Currency;
  country: string;
  selectedChips: string[];
  selectedCategoryIds: string[];
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
      role: typeof parsed.role === "string" ? parsed.role : undefined,
      experience: EXPERIENCES.includes(parsed.experience) ? parsed.experience : undefined,
      currency: CURRENCIES.includes(parsed.currency) ? parsed.currency : undefined,
      country: typeof parsed.country === "string" ? parsed.country : undefined,
      selectedChips: Array.isArray(parsed.selectedChips) && parsed.selectedChips.every((c: unknown) => typeof c === "string")
        ? parsed.selectedChips
        : undefined,
      selectedCategoryIds: Array.isArray(parsed.selectedCategoryIds) && parsed.selectedCategoryIds.every((c: unknown) => typeof c === "string")
        ? parsed.selectedCategoryIds
        : undefined,
    };
  } catch {
    return {};
  }
}
