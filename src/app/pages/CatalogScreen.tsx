import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search, X } from "lucide-react";
import type { Currency, Experience, Region } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { CATALOG } from "../data/catalog";
import type { CatalogJob } from "../data/catalog";
import { CUR_SYMBOL, formatPrice } from "../lib/pricing";
import { HOME_PATH } from "../routes";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";

export function CatalogScreen() {
  const t = useLang();
  const { lang } = useLangCtx();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [region, setRegion] = useState<Region | "all">("all");
  const [experience, setExperience] = useState<Experience>("mid");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(CATALOG.map((j) => lang === "tr" ? j.category : j.categoryEn)));
    return ["all", ...cats];
  }, [lang]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CATALOG.filter((job) => {
      const label = lang === "tr" ? job.label : job.labelEn;
      const desc = lang === "tr" ? job.desc : job.descEn;
      const cat = lang === "tr" ? job.category : job.categoryEn;
      const matchCat = activeCategory === "all" || cat === activeCategory;
      const matchQ = !q || label.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory, lang]);

  const grouped = useMemo(() => {
    if (activeCategory !== "all") {
      const cat = lang === "tr" ? activeCategory : activeCategory;
      return { [activeCategory]: filtered };
    }
    return filtered.reduce<Record<string, CatalogJob[]>>((acc, job) => {
      const key = lang === "tr" ? job.category : job.categoryEn;
      (acc[key] = acc[key] || []).push(job);
      return acc;
    }, {});
  }, [filtered, activeCategory, lang]);

  const effectiveRegion: Region = region === "all" ? "eastern" : region;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-12 pb-20">
          <BackButton />

          {/* Header */}
          <div className="mb-10 md:mb-8">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{t.catalogLabel}</p>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3 md:mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{t.catalogTitle}</h1>
              <div className="hidden md:block shrink-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{t.catalogCurrency}</p>
                <div className="flex gap-1.5">
                  {(["EUR","TRY","GBP"] as Currency[]).map((c) => (
                    <button key={c} onClick={() => setCurrency(c)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition-all ${currency===c?"border-foreground bg-foreground text-background":"border-border text-muted-foreground hover:border-foreground/30"}`}>{CUR_SYMBOL[c]} {c}</button>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{t.catalogSub}</p>
          </div>

          {/* Search */}
          <div className="relative mb-6 md:mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.catalogSearch}
              className="w-full pl-10 pr-10 py-3 md:py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Region + Experience filters */}
          <div className="flex flex-wrap gap-5 mb-6 md:gap-3 md:mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 md:mb-1.5">{t.catalogRegion}</p>
              <div className="flex flex-wrap gap-2 md:gap-1.5">
                {([["all", t.regionAll], ["turkey", t.regionTurkey], ["eastern", t.regionEastern], ["western", t.regionWestern]] as [Region|"all", string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setRegion(key)}
                    className={`text-xs px-3.5 py-2 md:px-3 md:py-1.5 rounded-lg border font-medium transition-all ${region===key?"border-foreground bg-foreground text-background":"border-border text-muted-foreground hover:border-foreground/30"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:hidden shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{t.catalogCurrency}</p>
              <div className="flex gap-1.5">
                {(["EUR","TRY","GBP"] as Currency[]).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`px-3.5 py-2 text-xs rounded-lg border font-semibold transition-all ${currency===c?"border-foreground bg-foreground text-background":"border-border text-muted-foreground hover:border-foreground/30"}`}>{CUR_SYMBOL[c]} {c}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 md:mb-1.5">{t.catalogExperience}</p>
              <div className="flex flex-wrap gap-2 md:gap-1.5">
                {([["junior",t.expJunior],["mid",t.expMid],["senior",t.expSenior]] as [Experience,string][]).map(([key,label]) => (
                  <button key={key} onClick={() => setExperience(key)}
                    className={`text-xs px-3.5 py-2 md:px-3 md:py-1.5 rounded-lg border font-medium transition-all ${experience===key?"border-foreground bg-foreground text-background":"border-border text-muted-foreground hover:border-foreground/30"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2.5 flex-wrap mb-10 md:gap-2 md:mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 py-2 md:px-3.5 md:py-1.5 rounded-full border font-medium transition-all ${activeCategory===cat?"border-foreground bg-foreground text-background":"border-border text-muted-foreground hover:border-foreground/40"}`}>
                {cat === "all" ? t.catalogAll : cat}
              </button>
            ))}
          </div>

          {/* Region note */}
          {region !== "all" && (
            <p className="text-xs text-muted-foreground mb-4 italic">
              {lang === "tr"
                ? `Fiyatlar: ${[t.regionTurkey, t.regionEastern, t.regionWestern][["turkey","eastern","western"].indexOf(region)]} · ${[t.expJunior, t.expMid, t.expSenior][["junior","mid","senior"].indexOf(experience)]} seviye`
                : `Prices: ${[t.regionTurkey, t.regionEastern, t.regionWestern][["turkey","eastern","western"].indexOf(region)]} · ${[t.expJunior, t.expMid, t.expSenior][["junior","mid","senior"].indexOf(experience)]} level`}
            </p>
          )}

          {/* Job grid */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">{t.catalogNoResult}</p>
              <button onClick={() => { setQuery(""); setActiveCategory("all"); }} className="mt-3 text-xs underline text-muted-foreground hover:text-foreground">{t.catalogClear}</button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([category, jobs]) => (
                <div key={category}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border">{category === "all" ? t.catalogAll : category}</h2>
                  <div className="grid md:grid-cols-2 gap-2.5">
                    {jobs.map((job) => (
                      <div key={job.label} className="flex items-start justify-between gap-3 px-4 py-3.5 border border-border rounded-xl hover:border-foreground/30 hover:bg-muted/30 transition-all">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">{lang === "tr" ? job.label : job.labelEn}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{lang === "tr" ? job.desc : job.descEn}</p>
                        </div>
                        <span className="text-xs font-bold shrink-0 mt-0.5 whitespace-nowrap">
                          {formatPrice(job.baseEur, effectiveRegion, experience, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Go to calculator */}
          <button onClick={() => navigate(HOME_PATH)}
            className="mt-10 w-full flex items-center justify-between p-5 bg-muted rounded-2xl hover:bg-muted/70 transition-colors group text-left">
            <div>
              <p className="text-sm font-semibold mb-1">{t.catalogGoCalc}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.catalogGoCalcSub}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-4" />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
