import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Download } from "lucide-react";
import type { Currency, Region } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { CUR_SYMBOL } from "../lib/pricing";
import { getRoleLabel } from "../data/roles";
import { getRoleCategories } from "../data/packages";
import { resolveCategoryPrice, resolveSubItemsPrice, calculatePackageQuote } from "../lib/packagePricing";
import { calcInputFromSearchParams } from "../lib/calcInputQuery";
import { clearHomeFormState } from "../lib/homeFormState";
import { downloadResultsPdf, rasterizeLogoFile } from "../lib/pdf";
import type { PdfLogo } from "../lib/pdf";
import { HOME_PATH } from "../routes";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";
import { NoticeBanner } from "../components/NoticeBanner";

const REGION_KEYS: Region[] = ["turkey", "eastern", "western"];

export function ResultsScreen() {
  const t = useLang();
  const { lang } = useLangCtx();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { roleId, experience, region, currency: initialCurrency, categoryIds, variantIds, subItemIds } = calcInputFromSearchParams(searchParams);
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [logo, setLogo] = useState<PdfLogo | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const isAllowed = file.type === "image/png" || file.type === "image/svg+xml" || /\.(png|svg)$/i.test(file.name);
    if (!isAllowed) {
      setLogoError(lang === "tr" ? "Sadece PNG veya SVG dosyası yükleyebilirsin." : "Only PNG or SVG files are supported.");
      return;
    }
    try {
      setLogo(await rasterizeLogoFile(file));
      setLogoError(null);
    } catch {
      setLogoError(lang === "tr" ? "Görsel yüklenemedi, başka bir dosya dene." : "Couldn't load that image — try another file.");
    }
  };

  const expLabel = experience === "junior" ? t.expJunior : experience === "mid" ? t.expMid : t.expSenior;
  const roleLabel = getRoleLabel(roleId, lang);
  const regionLabel = region === "turkey" ? t.regionTurkey : region === "eastern" ? t.regionEastern : t.regionWestern;
  const regionLabelFor = (r: Region) => r === "turkey" ? t.regionTurkey : r === "eastern" ? t.regionEastern : t.regionWestern;
  const symbol = CUR_SYMBOL[currency];
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const allCategories = roleId ? getRoleCategories(roleId) : [];
  // Mecra'lı bir kategori mecrası seçilmemişse, alt-kalemli bir kategori hiç alt
  // kalem seçilmemişse (elle değiştirilmiş/eski URL) hesaba katılmaz.
  const isCategoryValid = (c: (typeof allCategories)[number]) => {
    if (c.variants) return c.variants.some((v) => v.id === variantIds[c.id]);
    if (c.subItems) return (subItemIds[c.id] ?? []).some((id) => c.subItems!.some((s) => s.id === id));
    return true;
  };
  const selectedCategories = allCategories.filter((c) => categoryIds.includes(c.id) && isCategoryValid(c));
  const resolvePrice = (cat: (typeof allCategories)[number], r: Region) => {
    if (cat.subItems) return resolveSubItemsPrice(cat.subItems, subItemIds[cat.id] ?? [], r, experience, currency);
    const table = cat.variants ? cat.variants.find((v) => v.id === variantIds[cat.id])!.price : cat.price!;
    return resolveCategoryPrice(table, r, experience, currency);
  };

  // Rol için henüz paket verisi eklenmemiş (data/packages'te kaydı yok).
  if (allCategories.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-5 pt-12 pb-20">
            <BackButton />
            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{[roleLabel, expLabel].filter(Boolean).join(" · ")}</p>
                <h2 className="text-2xl font-bold tracking-tight">{t.resultsTitle}</h2>
              </div>
              <button onClick={() => { clearHomeFormState(); navigate(HOME_PATH); }} className="text-sm px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors font-medium">{t.newCalc}</button>
            </div>
            <div className="p-7 border border-border rounded-2xl text-center">
              <p className="text-sm text-muted-foreground">{t.resultComingSoonDesc}</p>
            </div>
            <NoticeBanner spacing="mt-7" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // URL elle değiştirilmiş / eski bağlantı — kategori seçilmemiş.
  if (selectedCategories.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-5 pt-12 pb-20">
            <BackButton />
            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{[roleLabel, expLabel].filter(Boolean).join(" · ")}</p>
                <h2 className="text-2xl font-bold tracking-tight">{t.resultsTitle}</h2>
              </div>
              <button onClick={() => { clearHomeFormState(); navigate(HOME_PATH); }} className="text-sm px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors font-medium">{t.newCalc}</button>
            </div>
            <div className="p-7 border border-border rounded-2xl text-center">
              <p className="text-sm text-muted-foreground">{t.resultNoCategorySelected}</p>
            </div>
            <NoticeBanner spacing="mt-7" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const quote = calculatePackageQuote(
    selectedCategories.map((cat) => ({ categoryId: cat.id, price: resolvePrice(cat, region) })),
  );
  const categoryLabel = (id: string) => {
    const cat = selectedCategories.find((c) => c.id === id)!;
    const base = lang === "tr" ? cat.label : cat.labelEn;
    if (cat.variants) {
      const variant = cat.variants.find((v) => v.id === variantIds[id])!;
      return `${base} — ${lang === "tr" ? variant.label : variant.labelEn}`;
    }
    if (cat.subItems) {
      const count = (subItemIds[id] ?? []).filter((sid) => cat.subItems!.some((s) => s.id === sid)).length;
      return `${base} — ${lang === "tr" ? `${count} kalem` : `${count} items`}`;
    }
    return base;
  };
  const hasDiscount = quote.items.length > 1;

  const regions = REGION_KEYS.map((r) => {
    const rq = calculatePackageQuote(
      selectedCategories.map((cat) => ({ categoryId: cat.id, price: resolvePrice(cat, r) })),
    );
    return {
      key: r,
      name: regionLabelFor(r),
      rate: `${symbol}${Math.round(rq.total).toLocaleString(locale)}`,
      dim: r !== region,
    };
  });

  const totalSub = hasDiscount
    ? (lang === "tr" ? `${quote.items.length} kategori · %${Math.round(quote.totalDiscountPct * 100)} paket indirimi` : `${quote.items.length} categories · ${Math.round(quote.totalDiscountPct * 100)}% package discount`)
    : `${regionLabel} · ${expLabel}`;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-12 pb-20">
          <BackButton />
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{[roleLabel, expLabel].filter(Boolean).join(" · ")}</p>
              <h2 className="text-2xl font-bold tracking-tight">{t.resultsTitle}</h2>
            </div>
            <button onClick={() => { clearHomeFormState(); navigate(HOME_PATH); }} className="text-sm px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors font-medium">{t.newCalc}</button>
          </div>

          <div className="flex justify-end mb-4">
            <div className="flex gap-1.5">
              {(["TRY", "EUR", "GBP"] as Currency[]).map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition-all ${currency === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                  {CUR_SYMBOL[c]} {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-7">
            {regions.map((r) => (
              <div key={r.key} className={`p-3 sm:p-4 rounded-2xl border transition-all ${!r.dim ? "border-foreground bg-foreground text-background ring-2 ring-foreground/10" : "border-border"}`}>
                <p className={`text-[10px] uppercase tracking-wider mb-2 ${!r.dim ? "text-background/50" : "text-muted-foreground"}`}>{t.regionMedian}</p>
                <p className="text-lg sm:text-2xl font-bold leading-none">{r.rate}</p>
                <p className={`text-[11px] mt-2.5 font-medium ${!r.dim ? "text-background/70" : "text-muted-foreground"}`}>{r.name}</p>
              </div>
            ))}
          </div>

          <div className="mb-7 space-y-2">
            <p className="text-sm font-semibold mb-1.5">{t.resultCategoriesLabel}</p>
            {quote.items.map((item) => (
              <div key={item.categoryId} className="flex items-center justify-between gap-3 px-3.5 py-2.5 border border-border rounded-xl text-sm">
                <span className="font-medium">{categoryLabel(item.categoryId)}</span>
                <span className="font-semibold shrink-0">{symbol}{Math.round(item.fullPrice).toLocaleString(locale)}</span>
              </div>
            ))}
          </div>

          <div className="p-7 bg-foreground text-background rounded-2xl mb-5">
            {hasDiscount && (
              <div className="flex items-center justify-between text-sm text-background/60 mb-4 pb-4 border-b border-white/15">
                <span>{t.resultDiscountLabel}</span>
                <span>-{symbol}{Math.round(quote.subtotal - quote.total).toLocaleString(locale)}</span>
              </div>
            )}
            <p className="text-[10px] uppercase tracking-widest text-background/50 mb-2">{t.resultTotalLabel}</p>
            <p className="text-4xl font-bold tracking-tight mb-1">{symbol}{Math.round(quote.total).toLocaleString(locale)}</p>
            <p className="text-sm text-background/50">{totalSub}</p>
          </div>

          <div className="border-2 border-foreground rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shrink-0">
                <Download size={18} className="text-background" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-0.5">{t.pdfTitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.pdfDesc}</p>
              </div>
            </div>
            <button
              disabled={isDownloading}
              onClick={async () => {
                setIsDownloading(true);
                setPdfError(null);
                try {
                  await downloadResultsPdf({
                    lang, role: roleLabel, expLabel, regionLabel, symbol, locale, logo,
                    categories: quote.items.map((item) => ({ label: categoryLabel(item.categoryId), price: item.fullPrice })),
                    discount: hasDiscount ? quote.subtotal - quote.total : 0,
                    total: quote.total,
                    totalSub,
                    regions,
                  });
                } catch (err) {
                  console.error(err);
                  setPdfError(t.pdfError);
                } finally {
                  setIsDownloading(false);
                }
              }}
              className="mt-4 w-full py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-85 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              <Download size={15} />{isDownloading ? t.pdfDownloading : t.pdfBtn}
            </button>
            {pdfError && <p className="text-[11px] text-red-500 mt-2">{pdfError}</p>}

            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              {logo ? (
                <img src={logo.dataUrl} alt="" className="w-10 h-10 object-contain border border-border rounded-lg shrink-0 bg-background" />
              ) : (
                <div className="w-10 h-10 border border-dashed border-border rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{t.pdfLogoLabel}</p>
                <p className="text-[11px] text-muted-foreground">{t.pdfLogoSub}</p>
                {logoError && <p className="text-[11px] text-red-500 mt-0.5">{logoError}</p>}
              </div>
              <label className="text-xs font-medium px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0">
                {logo ? t.pdfLogoChange : t.pdfLogoUpload}
                <input type="file" accept="image/png,image/svg+xml" onChange={handleLogoChange} className="hidden" />
              </label>
              {logo && (
                <button onClick={() => { setLogo(null); setLogoError(null); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  {t.pdfLogoRemove}
                </button>
              )}
            </div>
          </div>
          <NoticeBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
