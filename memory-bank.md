# RateCheck — Memory Bank

Bu dosya, Claude Code'un projede yaptığı her önemli değişikliğin kısa özetini tutar. Yeni bir oturuma
başladığında önce bu dosyayı oku, en sona da yeni bir kayıt ekle. Amaç: her seferinde baştan
anlatmak zorunda kalmamak.

Format: her kayıt `## [tarih] — Başlık` ile başlar, altına 2-4 madde ile ne yapıldığını yazar.

---

## Başlangıç durumu — proje devralındığında (1 Temmuz 2026)

Bu proje sıfırdan başlamıyor. Figma'da tasarlanan final tasarım, Figma Make aracıyla çalışan bir
React + TypeScript + Vite koduna dönüştürülmüş halde teslim alındı. Devralma anındaki durum:

**Var olan ve çalışan kısımlar:**
- 6 ekran tanımlı: Home (saatlik form), Results (sonuç), Packages (kullanılmıyor — bkz. aşağı),
  Catalog (küçük iş kataloğu), How It Works, About/İletişim.
- TR/EN dil sistemi (i18n) çalışıyor, tüm metinler `TR` ve `EN` objelerinde tanımlı.
- Dark/Light mode context'i (`LangCtx`) kurulu.
- `CATALOG` verisi (50+ iş türü, kategori, açıklama, EUR fiyat aralığı) tanımlı ve `formatPrice()`
  fonksiyonu bölge (`REGION_MULT`) ve deneyim (`EXP_MULT`) çarpanlarına göre GERÇEKTEN hesaplama
  yapıyor. Catalog ekranı işlevsel.
- Para birimi çevrimi (EUR/TRY/GBP) `CUR_RATE` ile yapılıyor.

**Eksik / yarım kalan kısımlar (öncelik sırasına yakın):**
1. `ResultsScreen` (saatlik hesaplama sonucu) SABİT/SAHTE değerler gösteriyor (€52, €32, €78,
   €2.080) — kullanıcının Home ekranında seçtiği rol/deneyim/bölge/saat GERÇEKTE hesaba
   katılmıyor. Bu en kritik eksik.
2. "PDF olarak indir" butonu sadece görsel, tıklanınca hiçbir şey üretmiyor.
3. Markalı (logo ekleme) dışa aktarım hiç yok.
4. "Nasıl Çalışır?" sayfasındaki "indirilebilir araştırma raporu" linki henüz eklenmedi.
5. İletişim formu (`AboutScreen`) gönderiliyormuş gibi davranıyor ama hiçbir yere veri gitmiyor.
6. `PackagesScreen` eski bir taslak — hiçbir yerden `navigate("packages")` çağrısı yok, yani
   kullanıcı bu ekranı hiç göremiyor. Güncel Figma tasarımıyla da uyuşmuyor (placeholder metinler
   içeriyor: "Alfis kurucusu" vb.). Temizlenmesi/silinmesi gerekiyor.
7. `guidelines/Guidelines.md` boş şablon haldeydi, gerçek kurallarla güncellendi (bkz. guidelines.md).
8. `index.html` içinde `<meta name="robots" content="noindex, nofollow">` var — yayına alınırken
   kaldırılmalı, yoksa arama motorları siteyi indexlemez.
9. `src/imports/` klasöründe iki adet aynı, ~22MB'lık PNG dosyası var (referans görsel, kodda
   kullanılmıyor) — proje boyutunu şişiriyor, silinebilir.

**Karar altına alınmış ürün kuralları:** bkz. `project-goals.md` ve `guidelines.md`.

---

## 1 Temmuz 2026 — Results ekranı gerçek hesaplamaya bağlandı

- Home ekranındaki seçimler (rol, deneyim, ülke→bölge, para birimi) artık `CalcInput` tipiyle
  `App` kökünde tutuluyor ve `navigate`'e ek olarak yeni bir `calculate()` fonksiyonuyla
  Results ekranına taşınıyor. Önceden `navigate(screen)` sadece ekran adı taşıyordu, veri hiç
  aktarılmıyordu.
- Home'a eksik olan **proje süresi (saat)** input'u eklendi (sayı girişi, varsayılan 40).
- Yeni `BASE_HOURLY_EUR` (52, Doğu Avrupa/orta düzey baz değeri) + `hourlyRate()` fonksiyonu,
  Catalog'daki `REGION_MULT`/`EXP_MULT`/`CUR_RATE` ile aynı mantığı kullanıyor. Not: rol şu an
  sadece etiket olarak gösteriliyor, sayıyı etkilemiyor — rol bazlı gerçek anket verisi
  eklenene kadar bilinçli bir sadeleştirme (kullanıcıyla onaylandı).
  - `Ülke → Bölge` eşlemesi: Türkiye→turkey, Polonya→eastern, Almanya/İngiltere/Fransa→western.
- Results ekranındaki 3 bölge kartı, saatlik/toplam ücret ve alt metinler artık gerçek
  girdilerden hesaplanıyor; sabit €32/€52/€78/€2.080 kaldırıldı.
- Dosya bölme/temizlik (App.tsx 800 satır sınırı, PackagesScreen ölü kod, vb.) bilinçli olarak
  bu oturuma dahil edilmedi — kullanıcı isteğiyle sonraya bırakıldı.
- Node/npm bu ortamda kurulu değildi, bu yüzden `tsc`/dev server ile otomatik test yapılamadı;
  kullanıcı tarayıcıda manuel test edecek.
