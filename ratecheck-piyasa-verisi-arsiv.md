# RateCheck — Piyasa Araştırması Veri Tabloları
**Tarih:** 4 Temmuz 2026 · **Kapsam:** Son 12-18 ay içindeki halka açık kaynaklar · **Hazırlayan:** Claude (AI destekli tarama, insan anketi değil)

---

## ⚠️ ÖNCE BUNU OKU: Kritik / acil bulgu

Araştırma sırasında sitenin fiyat mantığıyla hiç ilgisi olmayan ama **her TL fiyatını ~%48 yanlış gösteren** bir sorun bulundu:

| Parametre | Koddaki değer | Güncel piyasa değeri (4 Temmuz 2026) | Kaynak |
|---|---|---|---|
| `TRY` çevrim oranı | 36 | **~53.3** | ECB / Wise / XE / Investing.com (çapraz doğrulandı) |
| `GBP` çevrim oranı | 0.86 | ~0.856 | Aynı kaynaklar — **fark yok, dokunmaya gerek yok** |

TRY 36 iken sistem 1 EUR'luk bir işi TL'ye çevirirken olması gerekenden çok daha düşük bir TL rakamı üretiyor (örnek: 100 EUR'luk iş → kodda 3.600 TL görünürken, gerçek kur karşılığı ~5.330 TL). Bu, aşağıdaki tüm tablolardan bağımsız, tek satırlık bir düzeltme. TRY kurunun ne sıklıkla oynadığını göz önünde bulundurarak statik bir sayı yerine ileride bir döviz API'sine bağlanmayı düşünebilirsin — ama en azından bu değeri şimdilik 53'e çek.

---

## Metodoloji notu (kod tarafı için)

30 rolün ve 59 katalog kaleminin her biri için ayrı ayrı, bağımsız kaynaklı bir rakam bulmak halka açık verilerle mümkün değildi — bu ölçekte (~450 veri noktası) o kadar granüler, güvenilir, halka açık bir kaynak seti yok. Bunun yerine:

1. **6 kategori** (Tasarım, İllüstrasyon, Animasyon, Geliştirici, İçerik, Video&Foto) için bölge×deneyim bantları **doğrudan kaynaklardan** çıkarıldı.
2. Bir kategori içindeki roller (örn. "UI/UX Tasarımcı" ve "Marka Tasarımcısı") **aynı kategori bandını** kullanıyor, çünkü rol-özel ayrım için güvenilir veri yoktu. Bu senin kendi kuralına uygun bir enterpolasyondur ve aşağıda her yerde **"ENTERPOLASYON"** etiketiyle işaretlendi.
3. Doğrudan kaynak bulunan satırlar **"DOĞRUDAN KAYNAK"** etiketiyle, kaynak sayısı ve güven seviyesiyle birlikte verildi.
4. Tüm rakamlar USD/GBP'den EUR'a yaklaşık ~0.92 (USD→EUR) ve ~1.16 (GBP→EUR) oranıyla çevrildi; orijinal para birimi de parantez içinde belirtildi.

---

## A) SAATLİK ÜCRETLER — Kategori bazlı bantlar

### A.1 GELİŞTİRİCİ (Web/Frontend/Backend/Fullstack/Mobil) — **en güçlü kaynaklı kategori**

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak (kaç farklı kaynak) |
|---|---|---|---|---|
| Doğu Avrupa | 23-37 EUR | 37-60 EUR | 55-83 EUR | index.dev "Freelance Developer Rates 2025" (ana kaynak); freelancermap Almanya raporu ile çapraz doğrulandı → **2 kaynak, orta-yüksek güven** |
| Batı Avrupa | 32-51 EUR | 64-101 EUR | 74-138 EUR | index.dev (Batı Avrupa $70-110 mid, $80-120 senior) + freelancermap Almanya 2025 Freelancer-Kompass (3.210 katılımcı, ortalama **104 EUR/sa**, üst dilim daha yüksek) → **2 kaynak, yüksek güven** |
| Türkiye | veri bulunamadı (uluslararası pazar için) | veri bulunamadı | 28-55 EUR | meslekmaas.com, Türk tasarımcı/yazılımcıların Upwork'te 30-60 USD/sa aldığına dair tek kaynak → **1 kaynak, düşük-orta güven**. Junior/orta için TL bazlı yerel kaynaklar (gksoft.com.tr, eleman.net) bulundu ama bunlar iç piyasa (TL müşteri) verisi — döviz bazlı dış piyasa ile karıştırılmamalı, **ENTERPOLASYON** öneriliyor: mevcut formülle (52 × 0.55 × EXP_MULT) hesapla. |

**Not:** Web Geliştirici, Frontend, Backend, Fullstack ve Mobil Uygulama Geliştirici rolleri arasında ayrım yapan güvenilir bir kaynak bulunamadı — hepsi bu bandı paylaşıyor (**ENTERPOLASYON**). Tek istisna: index.dev'e göre AI/ML ve blockchain uzmanlığı olan geliştiriciler %40-60 daha fazla kazanıyor; RateCheck'te bu ayrım yok, eklenmesi düşünülebilir.

### A.2 TASARIM (UI/UX, Grafik, Marka, Ürün Tasarımcı)

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak |
|---|---|---|---|---|
| Doğu Avrupa | veri bulunamadı | veri bulunamadı | veri bulunamadı | Bu tur taramada bölgeye özel, tasarım-spesifik saatlik ücret kaynağı bulunamadı. |
| Batı Avrupa | veri bulunamadı | veri bulunamadı | veri bulunamadı | Aynı — Geliştirici kategorisi kadar güçlü, tasarıma özel bir Avrupa raporuna bu turda ulaşılamadı. |
| Türkiye | veri bulunamadı | veri bulunamadı | 28-55 EUR | meslekmaas.com: deneyimli Türk grafik tasarımcının Upwork/danışmanlık saatlik ücreti 30-60 USD → **1 kaynak, düşük-orta güven** |
| Genel (bölgesiz) | 14-140 EUR (geniş) | — | — | Upwork resmi verisi: grafik tasarımcılar 15-150 USD/sa arasında (çok geniş, platform geneli) → **3 kaynak (Upwork, DemandSage, TechRT — hepsi aynı Upwork verisine dayanıyor, tek birincil kaynak sayılmalı)** |

**Dürüst değerlendirme:** Bu kategori için net bir bölge×deneyim tablosu **kuramadım**. Önerim: (a) UI/UX'in grafik tasarımdan %10-30 daha yüksek fiyatlandığına dair genel bir sinyal var (RemotePass sentezi) — bu oranı Geliştirici bandına uygulayarak kaba bir enterpolasyon yapılabilir, ya da (b) bu kategori için ayrı, hedefli bir araştırma turu (Toptal, 99designs designer marketplace, Adobe/Behance freelance survey gibi kaynaklara odaklanarak) yapılmalı. Şu anki RateCheck formülü (52 × REGION_MULT × EXP_MULT, Geliştirici ile aynı baz) kullanılmaya devam edilebilir ama bunun **doğrudan kaynaklı değil, varsayım olduğu** bilinmeli.

### A.3 İLLÜSTRASYON (İllüstratör, Karakter Tasarımcısı, Konsept Sanatçısı, Çizgi Roman Sanatçısı, Çocuk Kitabı İllüstratörü, Dijital Ressam, Storyboard Sanatçısı)

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak |
|---|---|---|---|---|
| Almanya (Batı Avrupa proxy) | — | ~20 EUR (PayScale) | — | PayScale Almanya: illüstratör saatlik 21.80 EUR → **1 kaynak, düşük güven** (bu maaşlı/istihdam verisi, freelance piyasa fiyatını muhtemelen olduğundan düşük gösteriyor) |
| ABD (referans, bölge değil) | 15-28 EUR | ~44 EUR (ort.) | 28-122 EUR | ZipRecruiter: 14.90-132.21 USD aralığı, ort. 47.71 USD → **1 kaynak** |
| Doğu Avrupa / Türkiye | veri bulunamadı | veri bulunamadı | veri bulunamadı | Bu turda bulunamadı. |

**Dürüst değerlendirme:** İllüstrasyon kategorisi için güvenilir, bölgeye özel saatlik veri neredeyse yok — bulunanlar ya maaşlı istihdam verisi (düşük güven, freelance'i yansıtmıyor) ya da sadece ABD'ye ait. **ENTERPOLASYON öneriliyor:** Geliştirici bandının ~%60-70'i (illüstrasyonun genel olarak grafik tasarımla benzer, geliştiriciden biraz daha düşük fiyatlandığı yönündeki piyasa gözlemine dayanarak) — ama bu kaba bir tahmin, kesin rakam değil.

### A.4 ANİMASYON (2D/3D Animatör, Motion Tasarımcı, Kare-Kare Animatör, Karakter Animatörü, VFX Sanatçısı, Stop Motion Animatör)

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak |
|---|---|---|---|---|
| Avrupa (genel, bölge ayrımı yok) | — | ~53 EUR (460 USD/gün ÷ 8 sa) | — | dayrates.org, "Mid-Level Motion Designer Day-Rate in EU", 185 veri noktası, haftalık güncelleniyor → **1 kaynak, orta güven** (crowd-sourced, metodolojisi tam şeffaf değil) |
| Doğu/Batı Avrupa ayrı ayrı, Türkiye | veri bulunamadı | veri bulunamadı | veri bulunamadı | Bulunamadı. |

**Dürüst değerlendirme:** Sadece Motion Tasarımcı için, sadece orta seviye için, sadece "Avrupa geneli" (Doğu/Batı ayrımı yok) tek bir rakam bulundu. Diğer 6 rol (2D/3D Animatör, Kare-Kare, Karakter Animatörü, VFX, Stop Motion) ve diğer tüm bölge/deneyim kombinasyonları için veri yok. **ENTERPOLASYON öneriliyor**, güven seviyesi düşük.

### A.5 İÇERİK (Metin Yazarı, İçerik Üreticisi, Sosyal Medya Uzmanı, SEO Uzmanı)

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak |
|---|---|---|---|---|
| Batı Avrupa (UK proxy) | 15-17 EUR | 35-45 EUR | 58-88 EUR | TJ Creative + Amelie Pollak (UK piyasası, deneyimli copywriter 50-75 GBP/sa, üst dilim 89 GBP/sa) + Wise/Indeed (giriş seviyesi 14-15 GBP/sa) → **3 kaynak, orta-yüksek güven** (UK verisi, tüm Batı Avrupa için temsili kabul edildi) |
| Dünya geneli (referans) | — | ~66 EUR (72 USD ort.) | — | contractrates.fyi (crowd-sourced) → **1 kaynak, düşük güven** |
| Doğu Avrupa / Türkiye | veri bulunamadı | veri bulunamadı | veri bulunamadı | Bulunamadı. |

**Not:** Metin Yazarı için bulunan bu bant en çok "copywriter" rolüne uyuyor; İçerik Üreticisi, Sosyal Medya Uzmanı ve SEO Uzmanı için ayrı kaynak yok — aynı bandı paylaşıyorlar (**ENTERPOLASYON**), ama gerçekte SEO uzmanlığının farklı fiyatlandığı biliniyor (genel piyasa bilgisi, bu taramada doğrulanmadı).

### A.6 VİDEO & FOTO (Video Editör, Fotoğrafçı, Podcast Yapımcısı) — **ikinci en güçlü kaynaklı kategori**

| Bölge | Yeni başlayan | Orta düzey | Uzman | Kaynak |
|---|---|---|---|---|
| Doğu Avrupa | 14-23 EUR (25-25$ alt sınır) | 23-37 EUR (25-60$) | — | Cutjamm 2025 Salary & Rates Survey: Doğu Avrupa 25-60 USD/sa → **1 birincil kaynak**, Upwork'ün genel video editör medyanı (35 USD) ile tutarlı → **2. kaynak olarak çapraz doğrulandı** |
| Batı Avrupa | — | 37-92 EUR (40-100$) | 92-110+ EUR (100-120+$) | Cutjamm: Batı Avrupa 40-120 USD/sa → **1 birincil kaynak + Upwork genel tier verisiyle çapraz (entry 15-30, mid 30-60, expert 60-150$) — 3 kaynak toplamda aynı yöne işaret ediyor, yüksek güven** |
| Türkiye | veri bulunamadı | veri bulunamadı | veri bulunamadı | Bulunamadı — mevcut formülle (Doğu Avrupa × 0.55) enterpolasyon önerilir. |

**Not:** Fotoğrafçı ve Podcast Yapımcısı için ayrı kaynak yok, Video Editör bandını paylaşıyor (**ENTERPOLASYON**).

---

## B) BÖLGE VE DENEYİM ÇARPANLARI — Doğrulama

Mevcut formül: `saatlik ücret = 52 × REGION_MULT × EXP_MULT`, baz = Doğu Avrupa / Orta düzey = 52 EUR.

Bu, en güçlü kaynaklı kategori olan **Geliştirici** verisiyle test edildi:

| Hücre | Mevcut formülün ürettiği değer | Bulunan piyasa aralığı | Değerlendirme |
|---|---|---|---|
| Doğu Avrupa / Orta düzey (baz) | 52 EUR | 37-60 EUR | Bandın içinde, makul ✅ |
| Batı Avrupa / Orta düzey | 52 × 1.52 = **79 EUR** | 64-101 EUR | Bandın tam ortasında, iyi kalibre edilmiş ✅ |
| Doğu Avrupa / Uzman | 52 × 1.42 = **74 EUR** | 55-83 EUR | Bandın içinde ✅ |
| Batı Avrupa / Uzman | 52 × 1.52 × 1.42 = **112 EUR** | 74-138 EUR | Bandın içinde, üst-orta bölgede ✅ |
| Doğu Avrupa / Yeni başlayan | 52 × 0.70 = **36 EUR** | 23-37 EUR | Bandın tam üst sınırında — biraz yüksek ama kabul edilebilir ⚠️ |
| Batı Avrupa / Yeni başlayan | 52 × 1.52 × 0.70 = **55 EUR** | 32-51 EUR | **Bulunan aralığın üzerinde** — formül burada olması gerekenden ~%8-10 yüksek çıkıyor ⚠️ |
| Türkiye / Uzman | 52 × 0.55 × 1.42 = **41 EUR** | 28-55 EUR | Bandın içinde ✅ (tek kaynak, dikkatli yorumla) |

**Sonuç:** REGION_MULT (0.55 / 1.0 / 1.52) ve EXP_MULT (1.0 / 1.42) genel olarak gerçekçi görünüyor — özellikle Batı Avrupa çarpanı (1.52) çok iyi kalibre edilmiş. Tek dikkat noktası: **EXP_MULT'un "yeni başlayan" değeri (0.70)**, Batı Avrupa ile çarpıldığında bulunan piyasa üst sınırının biraz üzerine çıkıyor. 0.70 yerine ~0.62-0.65 gibi bir değer, Batı Avrupa junior verisiyle daha iyi örtüşür — ama bu tek kategori (Geliştirici) üzerinden yapılmış bir gözlem, kesin bir öneri değil.

Türkiye çarpanı (0.55) için sadece "uzman/deneyimli, döviz bazlı çalışan" segmentte veri var; junior/orta seviye Türk freelancer'ların uluslararası piyasadaki fiyatlandırması için güvenilir kaynak bulunamadı — bu boşluk ayrı not edilmeli.

---

## C) VARSAYILAN PROJE SÜRELERİ — Kapsamlı veri bulunamadı

Bu, araştırmanın en zayıf kısmı oldu: rol bazında "tipik proje süresi (saat)" için halka açık, sistematik bir kaynak **bulunamadı**. Bulunanlar dolaylı ve parçalı:

- Video editörlük için: "bir dakikalık kurgulanmış video için 1-4 saat ham çekim işleme" (Upwork resmi rehberi) — bu tek somut, kaynaklı veri noktası.
- Blog yazısı için: ortalama 3.5 saat/1000 kelime (optinmonster.com, dolaylı kaynak, düşük güven).
- SEO landing page metni: 2-6 saat (TJ Creative) — İçerik kategorisi için kullanılabilir.

30 rolün geri kalanı için (özellikle tasarım, illüstrasyon, animasyon, geliştirici) mevcut RateCheck değerlerini (40, 25, 45, 50 saat vb.) doğrulayacak ya da çürütecek bağımsız bir kaynak bulunamadı. **Bu değerler muhtemelen sektör deneyimine/varsayıma dayanan makul tahminler olarak kalmalı** — "piyasa araştırmasından" değil. Eğer bu alan koda "araştırılmış" olarak yansıtılacaksa, dürüst olmak adına bu satırın istisna tutulması ya da ayrı, odaklı bir ikinci tur (ör. agency/freelance proje yönetimi forumları, Clockify/Toggl'ın yayınladığı "görev başına ortalama süre" raporları) önerilir.

---

## D) KATALOG KALEMLERİ — Bulunan veriler ve enterpolasyon

### D.1 Tasarım — Logo tasarımı (en çok veri bulunan kalem)

| Kalem | Bölge | Aralık | Kaynak |
|---|---|---|---|
| Logo tasarımı | Batı Avrupa (UK proxy) | 174-580 EUR (150-500 GBP) | Inkbot Design 2026: pazaryeri-tipi (Fiverr/99designs/DesignCrowd) profesyonel serbest tasarımcı aralığı 150-500 GBP; deneyimli serbest tasarımcı doğrudan çalışınca 400-500 GBP → **3 kaynak (Inkbot, Looka, Fiverr resmi rehberi) aynı bandı destekliyor, orta-yüksek güven** |
| Logo tasarımı | Genel pazaryeri (Fiverr) | 32-92 EUR (35-100 USD) basit paket | Looka: Fiverr paketleri 35-100 USD basit logo için → **2 kaynak** |
| Logo tasarımı (contest modeli, 99designs) | — | 274-1209 EUR (298-1314 USD) | Looka → **1 kaynak** — bu modelin RateCheck'in "tek fiyat" mantığına uymadığı not edilmeli |

**Değerlendirme:** Mevcut RateCheck aralığı (Doğu Avrupa/orta baz: 200-500 EUR) bulunan Batı Avrupa profesyonel-serbest-tasarımcı bandıyla (174-580 EUR) **iyi örtüşüyor** — REGION_MULT ile Doğu Avrupa'ya indirgendiğinde de makul kalıyor. Bu kalem için formül **doğrulandı** ✅.

### D.2 Video & Animasyon — Video kurgu (dolaylı, saatlik veriden türetildi)

Doğrudan "kısa video kurgusu sabit fiyat" verisi bulunamadı, ama saatlik veri (bkz. A.6) + tipik süre tahminleri (bkz. C, zayıf) üzerinden **enterpolasyon** yapılabilir. Cutjamm ve Pixflow kaynaklarında paket bazlı örnekler var:
- Kısa sosyal medya videoları paketi (3-5 adet): 276-1104 EUR (300-1200 USD) (Twine/Creati) → **1 kaynak, orta güven** — ama bu "3-5 video" için, RateCheck'in tekli "kısa video (≤60sn)" kalemiyle bire bir eşleşmiyor.

**Değerlendirme:** Bu kategori için kod tarafına doğrudan aktarılabilecek, güvenilir bir "tek video" sabit fiyat verisi bulunamadı. Mevcut RateCheck değeri (150-400 EUR) mantıksal olarak makul duruyor (saatlik veriyle çelişmiyor) ama **doğrudan doğrulanamadı**.

### D.3 Diğer 57 katalog kalemi — genel değerlendirme

Metin & İçerik, Web & Kod, Fotoğraf & Görsel, İllüstrasyon ve İleri Animasyon kategorilerindeki kalemlerin büyük çoğunluğu için (poster, sosyal medya görseli, banner, sunum tasarımı, blog yazısı, landing page, arkaplan kaldırma, karakter tasarımı, 2D kare animasyon, rig'li karakter animasyonu, vb.) **bu tur taramada kalem-özel, sabit-fiyat kaynağı bulunamadı**. Bunun nedeni: bu tür sabit fiyatlar büyük ölçüde Fiverr/99designs gibi platformların iç arama sonuçlarına gömülü, halka açık toplu rapor olarak yayınlanmıyor.

**Dürüst öneri:** Bu 57 kalem için üç seçenek var:
1. **Enterpolasyon:** Mevcut formülü (min/max × REGION_MULT × EXP_MULT) koru, çünkü D.1'de test edilen logo kalemi formülün genel olarak makul sonuç ürettiğini gösterdi.
2. **İkinci araştırma turu:** Fiverr'in kendi "gig" arama sonuçlarından (API ya da manuel örnekleme) kategori bazlı medyan fiyat çekmek — bu, bu taramanın kapsamı dışında kaldı.
3. **Kullanıcı/pazar testi:** RateCheck'in kendi kullanıcılarından (Dünya Deniz Baş'ın da dahil olabileceği bir geri bildirim döngüsüyle) gerçek teklif verisi toplamak — uzun vadede en güvenilir yöntem.

---

## Özet: Ne kadarı gerçekten "araştırıldı", ne kadarı enterpolasyon?

| Kategori | Doğrudan kaynaklı | Enterpolasyon/veri yok |
|---|---|---|
| Geliştirici saatlik ücret | ✅ Güçlü (2-3 kaynak/hücre) | Sadece Türkiye junior/orta |
| Video & Foto saatlik ücret | ✅ Güçlü (2-3 kaynak/hücre) | Sadece Türkiye |
| İçerik saatlik ücret | ⚠️ Orta (Batı Avrupa için 3 kaynak) | Doğu Avrupa, Türkiye |
| Animasyon saatlik ücret | ⚠️ Zayıf (1 kaynak, tek hücre) | Neredeyse tamamı |
| Tasarım saatlik ücret | ❌ Zayıf (sadece Türkiye, 1 kaynak) | Neredeyse tamamı |
| İllüstrasyon saatlik ücret | ❌ Zayıf (düşük güvenli kaynaklar) | Neredeyse tamamı |
| Bölge/deneyim çarpanları | ✅ Geliştirici verisiyle doğrulandı | — |
| Proje süreleri | ❌ Neredeyse hiç yok | Neredeyse tamamı |
| Katalog kalemleri | ⚠️ Sadece logo (1/59) güçlü | 58/59 kalem |

**Genel tavsiye:** Bu rapor, koda "her rakam sıfırdan doğrulandı" diye yansıtılmamalı. Gerçekçi bir sonraki adım: (1) TRY kur düzeltmesini hemen yap, (2) Geliştirici ve Video&Foto kategorilerindeki güncellenmiş bantları koda yansıt, (3) Tasarım/İllüstrasyon/Animasyon/katalog kalemleri için formülü şimdilik koru ama "doğrulanmadı" olarak işaretle, (4) zaman bulduğunda ikinci bir tur ile bu boşlukları kapat.
