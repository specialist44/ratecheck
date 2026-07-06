// Animatör ve Motion Tasarımcı/VFX rolleri için proje süresi (saniye) fiyat
// çarpanı. Diğer 10 rol bu dosyayı hiç kullanmaz — DURATION_PRICED_ROLE_IDS
// dışındaki rollerde çarpan uygulanmamalı (bkz. ResultsScreen resolvePrice).
// Taban: 10sn = 1.0x. Ekonomik ölçek (uzun süre arttıkça birim maliyet düşer)
// piyasa araştırmasıyla doğrulandı: 60sn/30sn oranı ~1.78x (hedef 1.70-1.85).
export const DURATION_PRESET_SECONDS = [5, 10, 15, 30, 60] as const;
export const DEFAULT_DURATION_SECONDS = 10;
export const MIN_DURATION_SECONDS = 1;
export const MAX_DURATION_SECONDS = 300;

export const DURATION_PRICED_ROLE_IDS = ["animator", "motion-vfx"];

export function isDurationPricedRole(roleId: string): boolean {
  return DURATION_PRICED_ROLE_IDS.includes(roleId);
}

// Elle bozulmuş URL/storage değerlerine karşı: NaN/Infinity → varsayılana,
// aralık dışı değerler [MIN,MAX]'a kırpılır, ondalık saniye tam sayıya yuvarlanır.
export function clampDurationSeconds(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_DURATION_SECONDS;
  return Math.min(MAX_DURATION_SECONDS, Math.max(MIN_DURATION_SECONDS, Math.round(n)));
}

export function durationMultiplier(seconds: number): number {
  return Math.pow(seconds / DEFAULT_DURATION_SECONDS, 0.83);
}
