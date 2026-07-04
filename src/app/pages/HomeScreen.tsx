import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import type { Currency, Experience } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { ROLES_TR, ROLES_EN, CHIPS_TR, CHIPS_EN, TOOLS_BY_ROLE_ID, getRoleId } from "../data/roles";
import { getRoleCategories } from "../data/packages";
import { CUR_SYMBOL, COUNTRY_REGION } from "../lib/pricing";
import type { CalcInput } from "../lib/pricing";
import { calcInputToSearchParams } from "../lib/calcInputQuery";
import { loadHomeFormState, saveHomeFormState } from "../lib/homeFormState";
import { RESULTS_PATH, CATALOG_PATH } from "../routes";
import { Footer } from "../components/Footer";
import { NoticeBanner } from "../components/NoticeBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const EMPTY_TOOLS: string[] = [];
const ALL_TOOLS = new Set(Object.values(TOOLS_BY_ROLE_ID).flat());

// Prevents the row's own onClick (checkbox toggle) from firing when the
// "Detaylar" link inside it is clicked, and keeps a >=44px touch target.
function DialogTriggerButton({ checked, label }: { checked: boolean; label: string }) {
  return (
    <DialogTrigger asChild>
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className={`shrink-0 min-h-11 px-2 -my-2 flex items-center text-xs font-medium underline underline-offset-2 decoration-1 transition-colors ${checked ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"}`}
      >
        {label}
      </button>
    </DialogTrigger>
  );
}

export function HomeScreen() {
  const t = useLang();
  const { lang } = useLangCtx();
  const navigate = useNavigate();
  const roles = lang === "tr" ? ROLES_TR : ROLES_EN;
  const chips = lang === "tr" ? CHIPS_TR : CHIPS_EN;
  const saved = useMemo(() => loadHomeFormState(), []);

  const [role, setRole] = useState(saved.role ?? "");
  const [experience, setExperience] = useState<Experience>(saved.experience ?? "mid");
  const [currency, setCurrency] = useState<Currency>(saved.currency ?? "EUR");
  const [country, setCountry] = useState(saved.country ?? "Türkiye");
  const [selectedChips, setSelectedChips] = useState<string[]>(saved.selectedChips ?? []);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(saved.selectedCategoryIds ?? []);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const roleId = role ? getRoleId(role, lang) : null;
  const tools = roleId ? TOOLS_BY_ROLE_ID[roleId] ?? EMPTY_TOOLS : EMPTY_TOOLS;
  const packageCategories = roleId ? getRoleCategories(roleId) : [];

  useEffect(() => {
    saveHomeFormState({ role, experience, currency, country, selectedChips, selectedCategoryIds });
  }, [role, experience, currency, country, selectedChips, selectedCategoryIds]);

  useEffect(() => {
    setSelectedChips((prev) => prev.filter((c) => !ALL_TOOLS.has(c) || tools.includes(c)));
  }, [roleId]);

  useEffect(() => {
    setSelectedCategoryIds((prev) => prev.filter((id) => packageCategories.some((c) => c.id === id)));
  }, [roleId]);

  const toggleChip = (chip: string) =>
    setSelectedChips((p) => p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]);

  const sectorChips = chips.flatMap((g) => g.items);
  const sectorSelected = sectorChips.some((c) => selectedChips.includes(c));
  const toolsSelected = tools.length === 0 || tools.some((c) => selectedChips.includes(c));
  const categorySelected = packageCategories.length === 0 || selectedCategoryIds.length > 0;
  const canCalculate = !!role && categorySelected && sectorSelected && toolsSelected;

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-16 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-4">{t.heroTitle}</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">{t.heroSub}</p>
          </div>

          <div className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelRole}</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all">
                <option value="">{t.rolePlaceholder}</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelExp}</label>
              <div className="grid grid-cols-3 gap-2">
                {([["junior", t.expJunior, t.expJuniorSub], ["mid", t.expMid, t.expMidSub], ["senior", t.expSenior, t.expSeniorSub]] as [Experience, string, string][]).map(([key, label, sub]) => (
                  <button key={key} onClick={() => setExperience(key)}
                    className={`py-2.5 px-2 rounded-xl border text-left transition-all ${experience === key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
                    <span className="block text-xs font-semibold">{label}</span>
                    <span className={`block text-[10px] mt-0.5 ${experience === key ? "text-background/60" : "text-muted-foreground"}`}>{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Package categories (role-specific, fixed price) */}
            {packageCategories.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {t.labelCategories} <span className="text-muted-foreground font-normal text-xs">{t.categoriesSub}</span>
                </label>
                <div className="space-y-2">
                  {packageCategories.map((cat) => {
                    const checked = selectedCategoryIds.includes(cat.id);
                    const items = lang === "tr" ? cat.items : cat.itemsEn;
                    return (
                      <div key={cat.id}
                        role="checkbox" aria-checked={checked} tabIndex={0}
                        onClick={() => toggleCategory(cat.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCategory(cat.id); } }}
                        className={`w-full flex items-start gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${checked ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
                        <span className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${checked ? "border-background bg-background" : "border-border"}`}>
                          {checked && <Check size={11} className="text-foreground" />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium">{lang === "tr" ? cat.label : cat.labelEn}</span>
                          <span className={`block text-xs mt-0.5 ${checked ? "text-background/60" : "text-muted-foreground"}`}>{items.join(", ")}</span>
                        </span>
                        <Dialog>
                          <DialogTriggerButton checked={checked} label={t.categoryDetailsLink} />
                          <DialogContent onClick={(e) => e.stopPropagation()}>
                            <DialogHeader>
                              <DialogTitle>{lang === "tr" ? cat.label : cat.labelEn}</DialogTitle>
                            </DialogHeader>
                            <p className="text-xs text-muted-foreground -mt-2">{t.categoryDetailsTitle}</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm">
                              {items.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })}
                </div>
                {attemptedSubmit && !categorySelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
              </div>
            )}

            {/* Required chips (sector, tools) */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelExtras}</label>
              <div className="space-y-3">
                {chips.map(({ group, items }) => (
                  <div key={group}>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((chip) => (
                        <button key={chip} onClick={() => toggleChip(chip)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedChips.includes(chip) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                          {selectedChips.includes(chip) && <Check size={10} className="inline mr-1 -mt-0.5" />}{chip}
                        </button>
                      ))}
                    </div>
                    {attemptedSubmit && !sectorSelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                  </div>
                ))}
                {tools.length > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{lang === "tr" ? "Araçlar" : "Tools"}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.map((chip) => (
                        <button key={chip} onClick={() => toggleChip(chip)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedChips.includes(chip) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                          {selectedChips.includes(chip) && <Check size={10} className="inline mr-1 -mt-0.5" />}{chip}
                        </button>
                      ))}
                    </div>
                    {attemptedSubmit && !toolsSelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Country / Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-0.5">{t.labelCountry}</label>
                <p className="text-xs text-muted-foreground mb-1.5">{t.labelCountrySub}</p>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-foreground/40 transition-all">
                  <option>Türkiye</option><option>Almanya</option><option>İngiltere</option><option>Polonya</option><option>Fransa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-0.5">{t.labelCurrency}</label>
                <p className="text-xs text-muted-foreground mb-1.5 invisible" aria-hidden="true">{t.labelCountrySub}</p>
                <div className="flex gap-1.5">
                  {(["TRY","EUR","GBP"] as Currency[]).map((c) => (
                    <button key={c} onClick={() => setCurrency(c)}
                      className={`flex-1 py-2.5 text-xs rounded-xl border font-medium transition-all ${currency === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
                      {CUR_SYMBOL[c]} {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              aria-disabled={!canCalculate}
              onClick={() => {
                if (!canCalculate) { setAttemptedSubmit(true); return; }
                const input: CalcInput = { role, experience, currency, region: COUNTRY_REGION[country] ?? "eastern", categoryIds: selectedCategoryIds };
                navigate(`${RESULTS_PATH}?${calcInputToSearchParams(input).toString()}`);
              }}
              className={`w-full mb-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${canCalculate ? "bg-foreground text-background hover:opacity-85 active:scale-[0.99]" : "bg-foreground text-background opacity-40 cursor-not-allowed"}`}>
              {t.ctaCalculate} <ArrowRight size={16} />
            </button>

            {/* Catalog nudge */}
            <button onClick={() => navigate(CATALOG_PATH)}
              className="w-full flex items-center justify-between px-4 py-3 border border-dashed border-border rounded-xl hover:border-foreground/40 hover:bg-muted/40 transition-all group">
              <div className="text-left">
                <p className="text-sm font-medium">{t.smallJobNudge}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.smallJobNudgeSub}</p>
              </div>
              <ArrowRight size={15} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-3" />
            </button>
          </div>
          <NoticeBanner spacing="mt-12" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
