import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Download } from "lucide-react";
import type { Region } from "../types";
import { useLang, useLangCtx } from "../i18n/LangContext";
import { CUR_SYMBOL, hourlyRate, getDefaultHours } from "../lib/pricing";
import { calcInputFromSearchParams } from "../lib/calcInputQuery";
import { downloadResultsPdf, rasterizeLogoFile } from "../lib/pdf";
import type { PdfLogo } from "../lib/pdf";
import { HOME_PATH } from "../routes";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";
import { NoticeBanner } from "../components/NoticeBanner";

export function ResultsScreen() {
  const t = useLang();
  const { lang } = useLangCtx();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, experience, region, currency } = calcInputFromSearchParams(searchParams);
  const hours = getDefaultHours(role, lang);
  const [logo, setLogo] = useState<PdfLogo | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

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
  const regionLabel = region === "turkey" ? t.regionTurkey : region === "eastern" ? t.regionEastern : t.regionWestern;
  const symbol = CUR_SYMBOL[currency];
  const rate = hourlyRate(region, experience, currency);
  const total = rate * hours;
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const regions = (["turkey", "eastern", "western"] as Region[]).map((r) => ({
    key: r,
    name: r === "turkey" ? t.regionTurkey : r === "eastern" ? t.regionEastern : t.regionWestern,
    rate: `${symbol}${Math.round(hourlyRate(r, experience, currency))}`,
    dim: r !== region,
  }));

  const hourlySub = lang === "tr" ? `${regionLabel} ortalaması · ${expLabel}` : `${regionLabel} average · ${expLabel}`;
  const totalSub = lang === "tr"
    ? `${hours} saatlik proje · ${symbol}${Math.round(rate)}/sa ortalaması`
    : `${hours}-hour project · ${symbol}${Math.round(rate)}/hr average`;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-12 pb-20">
          <BackButton />
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{[role, expLabel].filter(Boolean).join(" · ")}</p>
              <h2 className="text-2xl font-bold tracking-tight">{t.resultsTitle}</h2>
            </div>
            <button onClick={() => navigate(HOME_PATH)} className="text-sm px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors font-medium">{t.newCalc}</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-7">
            {regions.map((r) => (
              <div key={r.key} className={`p-4 rounded-2xl border transition-all ${!r.dim ? "border-foreground bg-foreground text-background ring-2 ring-foreground/10" : "border-border"}`}>
                <p className={`text-[10px] uppercase tracking-wider mb-2 ${!r.dim ? "text-background/50" : "text-muted-foreground"}`}>{t.regionMedian}</p>
                <p className="text-2xl font-bold leading-none">{r.rate}<span className={`text-xs font-normal ${!r.dim ? "text-background/60" : "text-muted-foreground"}`}>/sa</span></p>
                <p className={`text-[11px] mt-2.5 font-medium ${!r.dim ? "text-background/70" : "text-muted-foreground"}`}>{r.name}</p>
              </div>
            ))}
          </div>

          <div className="mb-7">
            <p className="block text-sm font-semibold mb-1.5">{t.labelHours}</p>
            <div className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-muted/50 text-foreground">
              {hours} {lang === "tr" ? "saat" : "hours"}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{t.hoursNote}</p>
          </div>

          <div className="p-7 bg-foreground text-background rounded-2xl mb-5">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-background/50 mb-2">{t.resultHourlyLabel}</p>
              <p className="text-5xl font-bold tracking-tight mb-1">{symbol}{Math.round(rate)}<span className="text-2xl font-normal text-background/60">/sa</span></p>
              <p className="text-sm text-background/50">{hourlySub}</p>
            </div>
            <div className="pt-6 border-t border-white/15">
              <p className="text-[10px] uppercase tracking-widest text-background/50 mb-2">{t.resultTotalLabel}</p>
              <p className="text-4xl font-bold tracking-tight mb-1">{symbol}{Math.round(total).toLocaleString(locale)}</p>
              <p className="text-sm text-background/50">{totalSub}</p>
            </div>
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
              onClick={() => { downloadResultsPdf({ lang, role, expLabel, regionLabel, symbol, rate, total, hourlySub, totalSub, regions, locale, logo }).catch(console.error); }}
              className="mt-4 w-full py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-85 transition-all flex items-center justify-center gap-2">
              <Download size={15} />{t.pdfBtn}
            </button>

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
