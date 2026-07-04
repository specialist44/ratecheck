import type { Currency, Experience, Region } from "../types";
import type { CalcInput } from "./pricing";

const EXPERIENCES: Experience[] = ["junior", "mid", "senior"];
const REGIONS: Region[] = ["turkey", "eastern", "western"];
const CURRENCIES: Currency[] = ["EUR", "TRY", "GBP"];

export function calcInputToSearchParams(input: CalcInput): URLSearchParams {
  return new URLSearchParams({
    role: input.role,
    experience: input.experience,
    region: input.region,
    currency: input.currency,
  });
}

// Guards against malformed/hand-edited query strings (e.g. after F5 or a
// shared link) falling back to the same defaults ResultsScreen used before.
export function calcInputFromSearchParams(params: URLSearchParams): CalcInput {
  const experience = params.get("experience");
  const region = params.get("region");
  const currency = params.get("currency");
  return {
    role: params.get("role") ?? "",
    experience: EXPERIENCES.includes(experience as Experience) ? (experience as Experience) : "mid",
    region: REGIONS.includes(region as Region) ? (region as Region) : "eastern",
    currency: CURRENCIES.includes(currency as Currency) ? (currency as Currency) : "EUR",
  };
}
