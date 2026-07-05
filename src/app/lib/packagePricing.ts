import type { Currency, Experience, Region } from "../types";
import { CUR_RATE } from "./pricing";
import type { PackagePriceTable } from "../data/packages/types";

export function resolveCategoryPrice(priceTable: PackagePriceTable, region: Region, exp: Experience, currency: Currency): number {
  return priceTable[region][exp] * CUR_RATE[currency];
}

// Pozisyon 0 = en pahalı kategori, tam fiyat. Sonraki pozisyonlar kademeli indirimli.
const MARGINAL_DISCOUNT = [0, 0.05, 0.10, 0.15];
const MAX_TOTAL_DISCOUNT = 0.30; // blended indirim bu tavanı aşarsa orantılı küçültülür

export interface PackageLineItem {
  categoryId: string;
  fullPrice: number;
  discountPct: number;
  discountedPrice: number;
}

export interface PackageQuote {
  items: PackageLineItem[];
  subtotal: number;
  total: number;
  totalDiscountPct: number;
}

export function calculatePackageQuote(selected: { categoryId: string; price: number }[]): PackageQuote {
  if (selected.length === 0) return { items: [], subtotal: 0, total: 0, totalDiscountPct: 0 };

  const sorted = [...selected].sort((a, b) => b.price - a.price); // pahalıdan ucuza
  const subtotal = sorted.reduce((sum, x) => sum + x.price, 0);

  let items: PackageLineItem[] = sorted.map((x, i) => {
    const pct = MARGINAL_DISCOUNT[Math.min(i, MARGINAL_DISCOUNT.length - 1)];
    return { categoryId: x.categoryId, fullPrice: x.price, discountPct: pct, discountedPrice: x.price * (1 - pct) };
  });

  let total = items.reduce((sum, x) => sum + x.discountedPrice, 0);
  const blendedDiscount = 1 - total / subtotal;

  if (blendedDiscount > MAX_TOTAL_DISCOUNT) {
    const totalOff = subtotal - total;
    const scale = (MAX_TOTAL_DISCOUNT * subtotal) / totalOff;
    items = items.map((x) => {
      const pct = x.discountPct * scale;
      return { ...x, discountPct: pct, discountedPrice: x.fullPrice * (1 - pct) };
    });
    total = items.reduce((sum, x) => sum + x.discountedPrice, 0);
  }

  return { items, subtotal, total, totalDiscountPct: 1 - total / subtotal };
}
