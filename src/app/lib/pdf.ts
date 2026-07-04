import { jsPDF } from "jspdf";
import interRegularFontUrl from "../../assets/fonts/Inter-Regular.ttf";
import interBoldFontUrl from "../../assets/fonts/Inter-Bold.ttf";
import type { Lang, Region } from "../types";

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

export type PdfLogo = { dataUrl: string; ratio: number };

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
export async function rasterizeLogoFile(file: File): Promise<PdfLogo> {
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

export async function downloadResultsPdf(params: {
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
