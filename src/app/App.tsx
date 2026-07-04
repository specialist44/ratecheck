import { useState, useMemo, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useSearchParams } from "react-router";
import { ArrowRight, Check, ChevronRight, Database, Download, FileText, Menu, Moon, Search, Sun, X } from "lucide-react";
import { jsPDF } from "jspdf";
import logoBlack from "../assets/rate-check-logotype-black-rgb.svg";
import logoWhite from "../assets/rate-check-logotype-white-rgb.svg";
import interRegularFontUrl from "../assets/fonts/Inter-Regular.ttf";
import interBoldFontUrl from "../assets/fonts/Inter-Bold.ttf";

import type { Lang, Currency, Experience, Region } from "./types";
import { LangCtx, useLang, useLangCtx } from "./i18n/LangContext";
import { ROLES_TR, ROLES_EN, CHIPS_TR, CHIPS_EN } from "./data/roles";
import { CATALOG } from "./data/catalog";
import type { CatalogJob } from "./data/catalog";
import { CUR_SYMBOL, formatPrice, hourlyRate, getDefaultHours, COUNTRY_REGION } from "./lib/pricing";
import type { CalcInput } from "./lib/pricing";
import { calcInputToSearchParams, calcInputFromSearchParams } from "./lib/calcInputQuery";
import { HOME_PATH, RESULTS_PATH, CATALOG_PATH, HOW_IT_WORKS_PATH, ABOUT_PATH } from "./routes";

const LANG_STORAGE_KEY = "ratecheck-lang";
const DARK_STORAGE_KEY = "ratecheck-dark";

// ─── Shared: Nav ──────────────────────────────────────────────────────────────

function Nav() {
  const t = useLang();
  const { lang, setLang, dark, toggleDark } = useLangCtx();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const link = (label: string, target: string) => (
    <button
      onClick={() => { navigate(target); setOpen(false); }}
      className={`text-sm whitespace-nowrap transition-colors ${pathname === target ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  const LangToggle = ({ mobile }: { mobile?: boolean }) => (
    <div className={`flex gap-1 ${mobile ? "" : ""}`}>
      {(["tr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold uppercase transition-all ${
            lang === l ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <button onClick={() => navigate(HOME_PATH)} className="select-none shrink-0">
          <img src={dark ? logoWhite : logoBlack} alt="RateCheck" className="h-6 w-auto" />
        </button>
        <div className="hidden md:flex items-center justify-center gap-5 flex-1 min-w-0">
          {link(t.navHome, HOME_PATH)}
          {link(t.navCatalog, CATALOG_PATH)}
          {link(t.navHow, HOW_IT_WORKS_PATH)}
          {link(t.navAbout, ABOUT_PATH)}
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LangToggle />
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <LangToggle mobile />
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-3">
          {link(t.navHome, HOME_PATH)}
          {link(t.navCatalog, CATALOG_PATH)}
          {link(t.navHow, HOW_IT_WORKS_PATH)}
          {link(t.navAbout, ABOUT_PATH)}
        </div>
      )}
    </nav>
  );
}

// ─── Shared: Back ─────────────────────────────────────────────────────────────

function BackButton() {
  const t = useLang();
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
      <ArrowRight size={14} className="rotate-180" />{t.back}
    </button>
  );
}

// ─── Shared: Footer ───────────────────────────────────────────────────────────

function Footer() {
  const t = useLang();
  const { dark } = useLangCtx();
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-5 pt-12 pb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <img src={dark ? logoWhite : logoBlack} alt="RateCheck" className="h-5 w-auto mb-1.5" />
          <p className="text-xs text-muted-foreground">{t.footerTagline}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t.footerCopy}</p>
        </div>
        <p className="text-xs text-muted-foreground">Instagram · Twitter · LinkedIn</p>
      </div>
    </footer>
  );
}

// ─── Shared: Notice ───────────────────────────────────────────────────────────

function NoticeBanner({ spacing = "mt-10" }: { spacing?: string }) {
  const t = useLang();
  return (
    <div className={`${spacing} p-4 bg-muted rounded-xl`}>
      <p className="text-xs text-muted-foreground">{t.notice}{" "}
        <span className="underline cursor-pointer text-foreground">{t.noticeLink}</span>
      </p>
    </div>
  );
}

// ─── Screen 1: Home ───────────────────────────────────────────────────────────

function HomeScreen() {
  const t = useLang();
  const { lang } = useLangCtx();
  const navigate = useNavigate();
  const roles = lang === "tr" ? ROLES_TR : ROLES_EN;
  const chips = lang === "tr" ? CHIPS_TR : CHIPS_EN;

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState<Experience>("mid");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [country, setCountry] = useState("Türkiye");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const toggleChip = (chip: string) =>
    setSelectedChips((p) => p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]);

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

            {/* Optional chips */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                {t.labelExtras} <span className="text-muted-foreground font-normal text-xs">{t.extrasSub}</span>
              </label>
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
                  </div>
                ))}
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
              onClick={() => {
                const input: CalcInput = { role, experience, currency, region: COUNTRY_REGION[country] ?? "eastern" };
                navigate(`${RESULTS_PATH}?${calcInputToSearchParams(input).toString()}`);
              }}
              className="w-full mb-8 py-3.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-85 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
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

// ─── PDF export ───────────────────────────────────────────────────────────────

// jsPDF's built-in "helvetica" is a standard PDF font restricted to WinAnsi
// encoding — it has no ı/İ/ğ/Ğ/ş/Ş glyphs, so those bytes render as tofu/garbage
// with broken spacing. Embedding a real Unicode TTF fixes both the glyphs and
// the metrics. Fonts are fetched lazily (only when a PDF is actually requested)
// and cached on the jsPDF font registry after the first embed.
let pdfFontsReady: Promise<void> | null = null;

async function arrayBufferToBase64(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function ensurePdfFontsLoaded(doc: jsPDF): Promise<void> {
  if (!pdfFontsReady) {
    pdfFontsReady = (async () => {
      const [regularBuf, boldBuf] = await Promise.all([
        fetch(interRegularFontUrl).then((r) => r.arrayBuffer()),
        fetch(interBoldFontUrl).then((r) => r.arrayBuffer()),
      ]);
      const [regularBase64, boldBase64] = await Promise.all([
        arrayBufferToBase64(regularBuf),
        arrayBufferToBase64(boldBuf),
      ]);
      doc.addFileToVFS("Inter-Regular.ttf", regularBase64);
      doc.addFont("Inter-Regular.ttf", "Inter", "normal");
      doc.addFileToVFS("Inter-Bold.ttf", boldBase64);
      doc.addFont("Inter-Bold.ttf", "Inter", "bold");
    })();
  }
  return pdfFontsReady;
}

// ─── PDF export: optional user logo ────────────────────────────────────────────

type PdfLogo = { dataUrl: string; ratio: number };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("file read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image decode failed"));
    img.src = src;
  });
}

function fitContain(boxW: number, boxH: number, ratio: number): { w: number; h: number } {
  let w = boxW;
  let h = boxW / ratio;
  if (h > boxH) {
    h = boxH;
    w = boxH * ratio;
  }
  return { w, h };
}

// Fixed slot the logo is placed into on the PDF page (see downloadResultsPdf) —
// shared here so the rasterization resolution is derived from the same box.
const PDF_LOGO_BOX_MM = { w: 30, h: 16 };
// ~300 DPI (roughly 3x the 96 DPI a CSS pixel maps to) is print-sharp for a
// logo this size; below that, jsPDF stretching a low-res raster over 30x16mm
// visibly pixelates.
const LOGO_TARGET_DPI = 300;
const MM_PER_INCH = 25.4;
// Safety ceiling so an oversized upload (e.g. a 6000px photo used as a "logo")
// doesn't balloon the PDF file size — far above what 300 DPI at this box size
// actually needs.
const LOGO_MAX_RASTER_DIM = 1200;

// Both PNG and SVG uploads are redrawn onto a canvas so the PDF only ever needs
// to embed a plain raster PNG (jsPDF's addImage has no native SVG support) and
// so we always know the pixel aspect ratio for a distortion-free fit.
async function rasterizeLogoFile(file: File): Promise<PdfLogo> {
  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(rawDataUrl);
  const naturalW = img.naturalWidth || img.width || 1;
  const naturalH = img.naturalHeight || img.height || 1;
  const ratio = naturalW / naturalH;
  const isVector = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);

  const target = fitContain(
    (PDF_LOGO_BOX_MM.w / MM_PER_INCH) * LOGO_TARGET_DPI,
    (PDF_LOGO_BOX_MM.h / MM_PER_INCH) * LOGO_TARGET_DPI,
    ratio,
  );

  let w: number;
  let h: number;
  if (isVector) {
    // SVG is resolution-independent — always rasterize straight at the sharp
    // target size instead of whatever (often tiny) intrinsic size it reports.
    w = Math.round(target.w);
    h = Math.round(target.h);
  } else {
    // Raster: upscale to the target only if the source is smaller than it
    // (never invent detail below native res), then clamp to the safety cap.
    const desiredW = Math.max(naturalW, target.w);
    const desiredH = Math.max(naturalH, target.h);
    const capScale = Math.min(1, LOGO_MAX_RASTER_DIM / Math.max(desiredW, desiredH));
    w = Math.round(desiredW * capScale);
    h = Math.round(desiredH * capScale);
  }
  w = Math.max(1, w);
  h = Math.max(1, h);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return { dataUrl: canvas.toDataURL("image/png"), ratio };
}

async function downloadResultsPdf(params: {
  lang: Lang;
  role: string;
  expLabel: string;
  regionLabel: string;
  symbol: string;
  rate: number;
  total: number;
  hourlySub: string;
  totalSub: string;
  regions: { key: Region; name: string; rate: string; dim: boolean }[];
  locale: string;
  logo: PdfLogo | null;
}) {
  const { lang, role, expLabel, regionLabel, symbol, rate, total, hourlySub, totalSub, regions, locale, logo } = params;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await ensurePdfFontsLoaded(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  let y = 24;

  if (logo) {
    const boxW = PDF_LOGO_BOX_MM.w;
    const boxH = PDF_LOGO_BOX_MM.h;
    const boxX = pageWidth - marginX - boxW;
    const boxY = 10;
    const { w, h } = fitContain(boxW, boxH, logo.ratio);
    doc.addImage(logo.dataUrl, "PNG", boxX + (boxW - w) / 2, boxY + (boxH - h) / 2, w, h);
  }

  doc.setFont("Inter", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20);
  doc.text("RateCheck", marginX, y);

  y += 7;
  doc.setFont("Inter", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(lang === "tr" ? "Ücret Raporu" : "Rate Report", marginX, y);
  doc.text(new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" }), pageWidth - marginX, y, { align: "right" });

  y += 6;
  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text(lang === "tr" ? "ROL" : "ROLE", marginX, y);
  doc.text(lang === "tr" ? "BÖLGE" : "REGION", marginX + 85, y);

  y += 6;
  doc.setFont("Inter", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text([role, expLabel].filter(Boolean).join(" · ") || "-", marginX, y);
  doc.text(regionLabel, marginX + 85, y);

  y += 14;
  doc.setFontSize(11);
  doc.text(lang === "tr" ? "Bölgesel Karşılaştırma (saatlik)" : "Regional Comparison (hourly)", marginX, y);

  y += 8;
  doc.setFontSize(10);
  regions.forEach((r) => {
    if (!r.dim) {
      doc.setFillColor(245, 245, 245);
      doc.rect(marginX - 3, y - 5.5, pageWidth - 2 * marginX + 6, 8, "F");
    }
    doc.setFont("Inter", r.dim ? "normal" : "bold");
    doc.setTextColor(r.dim ? 100 : 20);
    doc.text(r.name, marginX, y);
    doc.text(`${r.rate}/${lang === "tr" ? "sa" : "hr"}`, pageWidth - marginX, y, { align: "right" });
    y += 9;
  });

  y += 5;
  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 12;
  doc.setFont("Inter", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(lang === "tr" ? "Sonuç" : "Result", marginX, y);

  y += 9;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text(lang === "tr" ? "ÖNERİLEN SAATLİK ÜCRET" : "RECOMMENDED HOURLY RATE", marginX, y);
  y += 7;
  doc.setFont("Inter", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text(`${symbol}${Math.round(rate)}/${lang === "tr" ? "sa" : "hr"}`, marginX, y);
  y += 6;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text(hourlySub, marginX, y);

  y += 12;
  doc.text(lang === "tr" ? "TOPLAM ÜCRET" : "TOTAL FEE", marginX, y);
  y += 7;
  doc.setFont("Inter", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text(`${symbol}${Math.round(total).toLocaleString(locale)}`, marginX, y);
  y += 6;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text(totalSub, marginX, y);

  const footerLineY = pageHeight - 24;
  doc.setDrawColor(210);
  doc.line(marginX, footerLineY, pageWidth - marginX, footerLineY);

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150);
  const footerText = lang === "tr"
    ? "Bu rapor RateCheck ile oluşturulmuştur. Değerler güncel piyasa araştırmasından derlenen ortalama verilerdir."
    : "This report was generated with RateCheck. Values are average figures compiled from current market research.";
  const footerMaxWidth = pageWidth - 2 * marginX;
  let footerLines = doc.splitTextToSize(footerText, footerMaxWidth) as string[];
  if (footerLines.length > 2) {
    doc.setFontSize(7);
    footerLines = doc.splitTextToSize(footerText, footerMaxWidth) as string[];
  }
  const footerLineHeight = 4;
  footerLines.forEach((line, i) => {
    doc.text(line, marginX, footerLineY + 7 + i * footerLineHeight);
  });

  const TURKISH_ASCII: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  const safeRole = (role || (lang === "tr" ? "rapor" : "report"))
    .toLowerCase()
    .split("").map((ch) => TURKISH_ASCII[ch] ?? ch).join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  doc.save(`ratecheck-${safeRole}.pdf`);
}

// ─── Screen 2: Results ────────────────────────────────────────────────────────

function ResultsScreen() {
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

// ─── Screen 3: Catalog ────────────────────────────────────────────────────────

function CatalogScreen() {
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

// ─── Screen 4: How it Works ───────────────────────────────────────────────────

function HowItWorksScreen() {
  const t = useLang();
  const steps = [
    { num: "01", title: t.step1Title, desc: t.step1Desc },
    { num: "02", title: t.step2Title, desc: t.step2Desc },
    { num: "03", title: t.step3Title, desc: t.step3Desc },
  ];
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-16 pb-20">
          <BackButton />
          <div className="mb-16 max-w-xl">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{t.howLabel}</p>
            <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">{t.howTitle}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t.howSub}</p>
          </div>
          <div className="mb-16">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 pb-10 relative">
                {i < steps.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />}
                <div className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold shrink-0 bg-background z-10">{step.num}</div>
                <div className="pt-2">
                  <h3 className="font-semibold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-muted rounded-2xl">
              <Database size={18} className="mb-3 text-foreground" />
              <h4 className="font-semibold text-sm mb-2">{t.dataTitle}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.dataDesc}</p>
            </div>
            <a href="/seffaflik-raporu.pdf" download className="group p-6 bg-muted rounded-2xl block border border-transparent transition-all hover:bg-muted/70 hover:border-foreground/20 hover:shadow-md">
              <FileText size={18} className="mb-3 text-foreground" />
              <h4 className="font-semibold text-sm mb-2">{t.pdfInfoTitle}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.pdfInfoDesc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground min-h-[44px]">
                {t.pdfDownloadLink}
                <Download size={14} className="transition-transform group-hover:translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Screen 5: About ─────────────────────────────────────────────────────────

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdlydrl";

function AboutScreen() {
  const t = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "succeeded" : "error");
    } catch {
      setStatus("error");
    }
  };
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-5 pt-16 pb-20">
          <BackButton />
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{t.aboutLabel}</p>
              <h1 className="text-4xl font-bold tracking-tight mb-6">{t.aboutTitle}</h1>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>{t.aboutP1}</p><p>{t.aboutP2}</p><p>{t.aboutP3}</p>
              </div>
            </div>
            <div className="md:pt-16">
              <span className="text-xs text-muted-foreground block mb-1">{t.stat1}</span>
              <span className="font-bold text-3xl block mb-2">2026</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.aboutFoundedNote}</p>
            </div>
          </div>
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">{t.contactTitle}</h2>
            <p className="text-sm text-muted-foreground mb-8">{t.contactSub}</p>
            {status === "succeeded" ? (
              <div className="p-10 bg-muted rounded-2xl text-center">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4"><Check size={18} className="text-background" /></div>
                <p className="font-semibold mb-1">{t.sentTitle}</p>
                <p className="text-sm text-muted-foreground">{t.sentSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.labelName}</label>
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.namePh}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.labelEmail}</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t.emailPh}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.labelMessage}</label>
                  <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder={t.messagePh}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 resize-none transition-all" />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-500">{t.sendError}</p>
                )}
                <button type="submit" disabled={status === "submitting"}
                  className="px-8 py-3 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-85 disabled:opacity-60 transition-all flex items-center gap-2">
                  {status === "submitting" ? t.sendingBtn : t.sendBtn} <ChevronRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function readStoredLang(): Lang {
  return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "tr";
}
function readStoredDark(): boolean {
  return localStorage.getItem(DARK_STORAGE_KEY) === "1";
}

function AppShell() {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const [dark, setDark] = useState<boolean>(readStoredDark);
  const toggleDark = () => setDark((d) => !d);
  const { pathname } = useLocation();

  useEffect(() => { localStorage.setItem(LANG_STORAGE_KEY, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(DARK_STORAGE_KEY, dark ? "1" : "0"); }, [dark]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);

  return (
    <LangCtx.Provider value={{ lang, setLang, dark, toggleDark }}>
      <div className={`min-h-screen bg-background text-foreground antialiased${dark ? " dark" : ""}`}>
        <Nav />
        <Routes>
          <Route path={HOME_PATH} element={<HomeScreen />} />
          <Route path={RESULTS_PATH} element={<ResultsScreen />} />
          <Route path={CATALOG_PATH} element={<CatalogScreen />} />
          <Route path={HOW_IT_WORKS_PATH} element={<HowItWorksScreen />} />
          <Route path={ABOUT_PATH} element={<AboutScreen />} />
        </Routes>
      </div>
    </LangCtx.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
