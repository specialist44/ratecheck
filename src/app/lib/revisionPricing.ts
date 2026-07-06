// İlk N revizyon ücretsiz kabul edilir (bilgi amaçlı, varsayılan durum) —
// kullanıcı bunu ResultsScreen'de bir toggle ile kapatıp TÜM revizyonları
// (1'den itibaren) ücretli hale getirebilir. Sonraki/toplam her revizyon,
// o anki (indirim uygulanmış) toplam fiyatın belirli bir yüzdesi kadar ek
// ücret olarak eklenir. 12 rolün de paylaştığı genel bir katman —
// kategori/indirim mantığına (bkz. packagePricing.ts) dokunmaz.
export const FREE_REVISIONS = 2;
export const REVISION_FEE_PCT = 0.12;

// revisionCount, ResultsScreen'den her zaman stepper'ın gösterdiği ham
// (toplam) sayı olarak gelir. firstTwoFree açıkken ilk FREE_REVISIONS
// tanesi burada düşülüp faturalanabilir sayı bulunur; kapalıyken tamamı
// faturalanır. Ücret = Toplam × %12 × faturalanacak revizyon sayısı.
export function calculateRevisionFee(total: number, revisionCount: number, firstTwoFree: boolean): number {
  const billableCount = firstTwoFree ? Math.max(0, revisionCount - FREE_REVISIONS) : Math.max(0, revisionCount);
  return total * REVISION_FEE_PCT * billableCount;
}
