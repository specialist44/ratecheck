import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import type { Currency, Experience } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { ROLES_TR, ROLES_EN, ROLE_IDS, CHIPS_TR, CHIPS_EN, TOOLS_BY_ROLE_ID, TRADITIONAL_DIGITAL_TOOL_GROUPS, MEDIUM_TOOL_GROUP_ROLE_IDS, ADOBE_SUITE_TOOLTIP } from "../data/roles";
import { getRoleCategories } from "../data/packages";
import { CUR_SYMBOL, COUNTRY_REGION } from "../lib/pricing";
import type { CalcInput } from "../lib/pricing";
import { DEFAULT_DURATION_SECONDS, DURATION_PRESET_SECONDS, MIN_DURATION_SECONDS, MAX_DURATION_SECONDS, isDurationPricedRole, clampDurationSeconds } from "../lib/durationPricing";
import { calcInputToSearchParams } from "../lib/calcInputQuery";
import { loadHomeFormState, saveHomeFormState, clearHomeFormState } from "../lib/homeFormState";
import { RESULTS_PATH, CATALOG_PATH } from "../routes";
import { Footer } from "../components/Footer";
import { NoticeBanner } from "../components/NoticeBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";

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

  const [roleId, setRoleId] = useState(saved.roleId ?? "");
  const [experience, setExperience] = useState<Experience>(saved.experience ?? "mid");
  const [currency, setCurrency] = useState<Currency>(saved.currency ?? "EUR");
  const [country, setCountry] = useState(saved.country ?? "Türkiye");
  const [selectedChips, setSelectedChips] = useState<string[]>(saved.selectedChips ?? []);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(saved.selectedCategoryIds ?? []);
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<string, string>>(saved.selectedVariantIds ?? {});
  const [selectedSubItemIds, setSelectedSubItemIds] = useState<Record<string, string[]>>(saved.selectedSubItemIds ?? {});
  const [durationSeconds, setDurationSeconds] = useState<number>(saved.durationSeconds ?? DEFAULT_DURATION_SECONDS);
  const [durationMode, setDurationMode] = useState<"preset" | "custom">(
    saved.durationSeconds && !(DURATION_PRESET_SECONDS as readonly number[]).includes(saved.durationSeconds) ? "custom" : "preset",
  );
  // Butonların görsel "aktif" hâli durationSeconds'tan AYRI takip edilir —
  // aynı butona tekrar basınca sadece bu null olur (hiçbir buton işaretli
  // görünmez), durationSeconds ise arka planda varsayılan 10sn'e döner.
  const [selectedPresetSeconds, setSelectedPresetSeconds] = useState<number | null>(saved.durationSeconds ?? DEFAULT_DURATION_SECONDS);
  const [customDurationText, setCustomDurationText] = useState<string>(String(saved.durationSeconds ?? DEFAULT_DURATION_SECONDS));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [toolGroupIds, setToolGroupIds] = useState<("digital" | "traditional")[]>([]);

  const tools = roleId ? TOOLS_BY_ROLE_ID[roleId] ?? EMPTY_TOOLS : EMPTY_TOOLS;
  const packageCategories = roleId ? getRoleCategories(roleId) : [];
  const hasToolGroups = MEDIUM_TOOL_GROUP_ROLE_IDS.includes(roleId);

  useEffect(() => {
    saveHomeFormState({ roleId, experience, currency, country, selectedChips, selectedCategoryIds, selectedVariantIds, selectedSubItemIds, durationSeconds });
  }, [roleId, experience, currency, country, selectedChips, selectedCategoryIds, selectedVariantIds, selectedSubItemIds, durationSeconds]);

  // Süre sadece Animatör/Motion-VFX'te anlamlı — başka bir role geçince
  // eski süre seçimi "hayalet" kalıp yanlışlıkla taşınmasın diye sıfırlanır.
  useEffect(() => {
    if (!isDurationPricedRole(roleId)) {
      setDurationSeconds(DEFAULT_DURATION_SECONDS);
      setDurationMode("preset");
      setSelectedPresetSeconds(DEFAULT_DURATION_SECONDS);
      setCustomDurationText(String(DEFAULT_DURATION_SECONDS));
    }
  }, [roleId]);

  useEffect(() => {
    setSelectedChips((prev) => prev.filter((c) => !ALL_TOOLS.has(c) || tools.includes(c)));
  }, [roleId]);

  useEffect(() => {
    if (!hasToolGroups) setToolGroupIds([]);
  }, [hasToolGroups]);

  const toggleToolGroup = (id: "digital" | "traditional") =>
    setToolGroupIds((p) => {
      if (p.includes(id)) {
        // Grup kapanınca içindeki araç seçimleri de temizlensin — kapalı bir
        // grubun "hayalet" seçili aracı kalmasın (bkz. audit raporu).
        const groupToolIds = TRADITIONAL_DIGITAL_TOOL_GROUPS.find((g) => g.id === id)?.tools.map((t) => t.id) ?? [];
        setSelectedChips((chips) => chips.filter((c) => !groupToolIds.includes(c)));
        return p.filter((g) => g !== id);
      }
      return [...p, id];
    });

  useEffect(() => {
    setSelectedCategoryIds((prev) => prev.filter((id) => packageCategories.some((c) => c.id === id)));
  }, [roleId]);

  // Mecra seçimleri kategori id'sine bağlı — rol değişince (dolayısıyla packageCategories
  // değişince) artık var olmayan kategori/mecra kombinasyonlarını temizle.
  useEffect(() => {
    setSelectedVariantIds((prev) => {
      const next: Record<string, string> = {};
      for (const [catId, variantId] of Object.entries(prev)) {
        const cat = packageCategories.find((c) => c.id === catId);
        if (cat?.variants?.some((v) => v.id === variantId)) next[catId] = variantId;
      }
      return next;
    });
  }, [roleId]);

  // Alt kalem seçimleri de kategori id'sine bağlı — rol değişince artık var
  // olmayan kategori/alt-kalem kombinasyonlarını temizle.
  useEffect(() => {
    setSelectedSubItemIds((prev) => {
      const next: Record<string, string[]> = {};
      for (const [catId, ids] of Object.entries(prev)) {
        const cat = packageCategories.find((c) => c.id === catId);
        const valid = ids.filter((id) => cat?.subItems?.some((s) => s.id === id));
        if (valid.length > 0) next[catId] = valid;
      }
      return next;
    });
  }, [roleId]);

  const toggleChip = (chip: string) =>
    setSelectedChips((p) => p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]);

  // Konsept Sanatı'nda mecra seçimi, İllüstrasyon'da ise Geleneksel/Dijital
  // araç seçimi zaten Sektör'ün yerini tutuyor, bu yüzden grup hiç gösterilmiyor.
  const showSectorChips = roleId !== "concept-art" && roleId !== "illustration";
  const sectorChipIds = chips.flatMap((g) => g.items.map((i) => i.id));
  const sectorSelected = !showSectorChips || sectorChipIds.some((id) => selectedChips.includes(id));
  const toolsSelected = tools.length === 0 || tools.some((c) => selectedChips.includes(c));
  // Mecra'lı bir kategori seçiliyken kendi mecrası, alt-kalemli bir kategoride
  // en az bir alt kalem seçilmeden "hazır" sayılmaz.
  const variantsReady = selectedCategoryIds.every((id) => {
    const cat = packageCategories.find((c) => c.id === id);
    if (cat?.variants) return !!selectedVariantIds[id];
    if (cat?.subItems) return (selectedSubItemIds[id]?.length ?? 0) > 0;
    return true;
  });
  const categorySelected = packageCategories.length === 0 || (selectedCategoryIds.length > 0 && variantsReady);
  const canCalculate = !!roleId && categorySelected && sectorSelected && toolsSelected;

  const hasAnySelection = !!roleId || experience !== "mid" || currency !== "EUR" || country !== "Türkiye"
    || selectedChips.length > 0 || selectedCategoryIds.length > 0 || toolGroupIds.length > 0
    || Object.keys(selectedVariantIds).length > 0 || Object.keys(selectedSubItemIds).length > 0
    || durationSeconds !== DEFAULT_DURATION_SECONDS;

  const resetAll = () => {
    setRoleId("");
    setExperience("mid");
    setCurrency("EUR");
    setCountry("Türkiye");
    setSelectedChips([]);
    setSelectedCategoryIds([]);
    setSelectedVariantIds({});
    setSelectedSubItemIds({});
    setToolGroupIds([]);
    setDurationSeconds(DEFAULT_DURATION_SECONDS);
    setDurationMode("preset");
    setSelectedPresetSeconds(DEFAULT_DURATION_SECONDS);
    setCustomDurationText(String(DEFAULT_DURATION_SECONDS));
    setAttemptedSubmit(false);
    clearHomeFormState();
  };

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((p) => {
      if (p.includes(id)) {
        setSelectedVariantIds((v) => { const next = { ...v }; delete next[id]; return next; });
        setSelectedSubItemIds((s) => { const next = { ...s }; delete next[id]; return next; });
        return p.filter((c) => c !== id);
      }
      return [...p, id];
    });

  const selectVariant = (categoryId: string, variantId: string) =>
    setSelectedVariantIds((p) => ({ ...p, [categoryId]: variantId }));

  const toggleSubItem = (categoryId: string, subItemId: string) =>
    setSelectedSubItemIds((p) => {
      const current = p[categoryId] ?? [];
      const next = current.includes(subItemId) ? current.filter((id) => id !== subItemId) : [...current, subItemId];
      return { ...p, [categoryId]: next };
    });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-16 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-4">{t.heroTitle}</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">{t.heroSub}</p>
          </div>

          <div className="space-y-5">
            {hasAnySelection && (
              <div className="flex justify-end">
                <button type="button" onClick={resetAll}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 decoration-1 transition-colors min-h-11 px-2 -my-2 flex items-center">
                  {t.resetSelections}
                </button>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelRole}</label>
              <select value={roleId} onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all">
                <option value="">{t.rolePlaceholder}</option>
                {ROLE_IDS.map((id, i) => <option key={id} value={id}>{roles[i]}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelExp}</label>
              <div className="grid grid-cols-3 gap-2">
                {([["junior", t.expJunior, t.expJuniorSub], ["mid", t.expMid, t.expMidSub], ["senior", t.expSenior, t.expSeniorSub]] as [Experience, string, string][]).map(([key, label, sub]) => (
                  <button key={key} onClick={() => setExperience(key)} aria-pressed={experience === key}
                    className={`relative after:absolute after:content-[''] after:-inset-[9px] py-2.5 px-2 rounded-xl border text-left transition-all ${experience === key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
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
                      <div key={cat.id}>
                        <div
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
                        {checked && cat.variants && (
                          <div className="mt-2 ml-2 pl-3.5 border-l-2 border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">{t.categoryVariantLabel}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.variants.map((variant) => {
                                const variantChecked = selectedVariantIds[cat.id] === variant.id;
                                return (
                                  <button key={variant.id} type="button" onClick={() => selectVariant(cat.id, variant.id)}
                                    aria-pressed={variantChecked}
                                    className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${variantChecked ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                                    {variantChecked && <Check size={10} className="inline mr-1 -mt-0.5" />}{lang === "tr" ? variant.label : variant.labelEn}
                                  </button>
                                );
                              })}
                            </div>
                            {attemptedSubmit && !selectedVariantIds[cat.id] && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                          </div>
                        )}
                        {checked && cat.subItems && (
                          <div className="mt-2 ml-2 pl-3.5 border-l-2 border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">{t.categorySubItemLabel}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.subItems.map((subItem) => {
                                const subItemChecked = (selectedSubItemIds[cat.id] ?? []).includes(subItem.id);
                                return (
                                  <button key={subItem.id} type="button" onClick={() => toggleSubItem(cat.id, subItem.id)}
                                    aria-pressed={subItemChecked}
                                    className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${subItemChecked ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                                    {subItemChecked && <Check size={10} className="inline mr-1 -mt-0.5" />}{lang === "tr" ? subItem.label : subItem.labelEn}
                                  </button>
                                );
                              })}
                            </div>
                            {attemptedSubmit && (selectedSubItemIds[cat.id]?.length ?? 0) === 0 && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {attemptedSubmit && !categorySelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
              </div>
            )}

            {/* Duration (role-specific, only Animator / Motion-VFX) */}
            {isDurationPricedRole(roleId) && (
              <div>
                <label className="block text-sm font-semibold mb-0.5">{t.labelDuration}</label>
                <p className="text-xs text-muted-foreground mb-1.5">{t.durationSub}</p>
                <div className="flex flex-wrap gap-1.5">
                  {DURATION_PRESET_SECONDS.map((sec) => {
                    const active = durationMode === "preset" && selectedPresetSeconds === sec;
                    return (
                      <button key={sec} type="button"
                        onClick={() => {
                          if (active) {
                            // Aynı butona tekrar basılınca seçim iptal olur — hiçbir
                            // buton işaretli görünmez, hesaplama varsayılan 10sn'e döner.
                            setSelectedPresetSeconds(null);
                            setDurationSeconds(DEFAULT_DURATION_SECONDS);
                            return;
                          }
                          setDurationMode("preset");
                          setSelectedPresetSeconds(sec);
                          setDurationSeconds(sec);
                          setCustomDurationText(String(sec));
                        }}
                        aria-pressed={active}
                        className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${active ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                        {active && <Check size={10} className="inline mr-1 -mt-0.5" />}{sec}{t.durationUnit}
                      </button>
                    );
                  })}
                  <button type="button" onClick={() => setDurationMode("custom")} aria-pressed={durationMode === "custom"}
                    className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${durationMode === "custom" ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                    {durationMode === "custom" && <Check size={10} className="inline mr-1 -mt-0.5" />}{t.durationCustomToggle}
                  </button>
                </div>
                {durationMode === "custom" && (
                  <div className="mt-2">
                    <input
                      type="number" min={MIN_DURATION_SECONDS} max={MAX_DURATION_SECONDS} value={customDurationText}
                      onChange={(e) => setCustomDurationText(e.target.value)}
                      onBlur={() => {
                        const v = clampDurationSeconds(Number(customDurationText));
                        setDurationSeconds(v);
                        setCustomDurationText(String(v));
                      }}
                      placeholder={t.durationCustomPlaceholder}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
                    <p className="text-[11px] text-muted-foreground mt-1">{t.durationCustomHint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Required chips (sector, tools) */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.labelExtras}</label>
              <div className="space-y-3">
                {showSectorChips && chips.map(({ group, items }) => (
                  <div key={group}>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((chip) => (
                        <button key={chip.id} onClick={() => toggleChip(chip.id)} aria-pressed={selectedChips.includes(chip.id)}
                          className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${selectedChips.includes(chip.id) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                          {selectedChips.includes(chip.id) && <Check size={10} className="inline mr-1 -mt-0.5" />}{chip.label}
                        </button>
                      ))}
                    </div>
                    {attemptedSubmit && !sectorSelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                  </div>
                ))}
                {hasToolGroups ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{lang === "tr" ? "Araçlar" : "Tools"}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {TRADITIONAL_DIGITAL_TOOL_GROUPS.map((group) => (
                        <button key={group.id} onClick={() => toggleToolGroup(group.id)} aria-pressed={toolGroupIds.includes(group.id)}
                          className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${toolGroupIds.includes(group.id) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                          {toolGroupIds.includes(group.id) && <Check size={10} className="inline mr-1 -mt-0.5" />}{lang === "tr" ? group.label : group.labelEn}
                        </button>
                      ))}
                    </div>
                    {toolGroupIds.length > 0 && (
                      <div className="space-y-2">
                        {TRADITIONAL_DIGITAL_TOOL_GROUPS.filter((g) => toolGroupIds.includes(g.id)).map((group) => (
                          <div key={group.id} className="flex flex-wrap gap-1.5">
                            {group.tools.map((tool) => {
                              const label = lang === "tr" ? tool.label : tool.labelEn;
                              const tooltip = lang === "tr" ? tool.tooltip : tool.tooltipEn;
                              const chip = (
                                <button key={tool.id} onClick={() => toggleChip(tool.id)} aria-pressed={selectedChips.includes(tool.id)}
                                  className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${selectedChips.includes(tool.id) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                                  {selectedChips.includes(tool.id) && <Check size={10} className="inline mr-1 -mt-0.5" />}{label}
                                </button>
                              );
                              if (!tooltip) return chip;
                              return (
                                <Tooltip key={tool.id}>
                                  <TooltipTrigger asChild>{chip}</TooltipTrigger>
                                  <TooltipContent>{tooltip}</TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                    {attemptedSubmit && !toolsSelected && <p className="text-[11px] text-red-500 mt-1.5">{t.requiredFieldWarning}</p>}
                  </div>
                ) : tools.length > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{lang === "tr" ? "Araçlar" : "Tools"}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.map((chip) => {
                        const button = (
                          <button key={chip} onClick={() => toggleChip(chip)} aria-pressed={selectedChips.includes(chip)}
                            className={`relative after:absolute after:content-[''] after:-inset-[9px] text-xs px-3 py-1.5 rounded-full border transition-all ${selectedChips.includes(chip) ? "border-foreground bg-foreground text-background font-medium" : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"}`}>
                            {selectedChips.includes(chip) && <Check size={10} className="inline mr-1 -mt-0.5" />}{chip}
                          </button>
                        );
                        if (chip !== "Adobe Suite") return button;
                        return (
                          <Tooltip key={chip}>
                            <TooltipTrigger asChild>{button}</TooltipTrigger>
                            <TooltipContent>{lang === "tr" ? ADOBE_SUITE_TOOLTIP.tr : ADOBE_SUITE_TOOLTIP.en}</TooltipContent>
                          </Tooltip>
                        );
                      })}
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
                  <option value="Türkiye">{t.countryTurkiye}</option><option value="Almanya">{t.countryAlmanya}</option><option value="İngiltere">{t.countryIngiltere}</option><option value="Polonya">{t.countryPolonya}</option><option value="Fransa">{t.countryFransa}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-0.5">{t.labelCurrency}</label>
                <p className="text-xs text-muted-foreground mb-1.5 invisible" aria-hidden="true">{t.labelCountrySub}</p>
                <div className="flex gap-1.5">
                  {(["TRY","EUR","GBP"] as Currency[]).map((c) => (
                    <button key={c} onClick={() => setCurrency(c)} aria-pressed={currency === c}
                      className={`relative after:absolute after:content-[''] after:-inset-[9px] flex-1 py-2.5 text-xs rounded-xl border font-medium transition-all ${currency === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30"}`}>
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
                // Kullanıcı "Kendi süreni gir" input'undayken blur olmadan Hesapla'ya
                // basarsa, henüz commit edilmemiş (durationSeconds'a yansımamış)
                // metni burada clamp'leyip kullan — state'in güncellenmesini beklemeye gerek yok.
                const finalDurationSeconds = durationMode === "custom" ? clampDurationSeconds(Number(customDurationText)) : durationSeconds;
                const input: CalcInput = { roleId, experience, currency, region: COUNTRY_REGION[country] ?? "eastern", categoryIds: selectedCategoryIds, variantIds: selectedVariantIds, subItemIds: selectedSubItemIds, durationSeconds: finalDurationSeconds };
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
