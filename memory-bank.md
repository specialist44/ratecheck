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

---

## 4 Temmuz 2026 — Ana Sayfa hesaplayıcısı için yeni "paket fiyatlama" veri modeli (adım 1)

- Saatlik hesaplayıcı tamamen kaldırılıp yerine rol → üst kategori (checkbox) → kademeli indirimli
  paket fiyatı modeli gelecek. Bu oturumda sadece VERİ MODELİ + Grafik Tasarımcı test verisi
  eklendi; HomeScreen/ResultsScreen UI'ı henüz değişmedi (sıradaki adım).
- Yeni `src/app/data/packages/` klasörü: `types.ts` (`RoleCategoryDef`, `RoleCategorySet`,
  `PackagePriceTable` — region×experience bazlı EUR baseline), `graphicDesigner.ts` (4 kategori:
  Kurumsal Kimlik, Basılı Yayın/Editoryal, Ambalaj ve Promosyon, Statik Dijital Görseller),
  `index.ts` (roleId → kategori listesi registry, `getRoleCategories()`).
- Grafik Tasarımcı fiyatları kullanıcıdan TRY (Türkiye) ve USD (Doğu/Batı Avrupa) olarak geldi;
  EUR baseline'a çevrildi: TRY / 53.3 (mevcut `CUR_RATE`), USD / 1.08 (kullanıcı onaylı kur).
  Diğer 29 rol için registry'de kayıt yok, `getRoleCategories()` boş dizi döner (placeholder).
- `src/app/data/roles.ts`'e `ROLE_IDS` (ROLES_TR/EN ile index-hizalı, dilden bağımsız stabil slug)
  ve `getRoleId()` eklendi — packages verisi bu slug'larla anahtarlanıyor.
- Yeni `src/app/lib/packagePricing.ts`: `resolveCategoryPrice()` (tablo + para birimi çevrimi) ve
  `calculatePackageQuote()` (fiyata göre azalan sırada kademeli indirim: 2. kategori -%5, 3. -%10,
  4. -%15, toplam indirim %30'u geçerse orantılı küçültülüyor). Kullanıcıyla netleştirilen karar:
  indirim sırası tıklama sırası değil, **fiyata göre azalan** (deterministik, oyuna kapalı).
- Eski saatlik kod (`BASE_HOURLY_EUR`, `hourlyRate()`, `getDefaultHours()`, `CHIPS_TR/EN`,
  `TOOLS_BY_CATEGORY`, `ROLE_DEFAULT_HOURS`) BİLEREK silinmedi — HomeScreen/ResultsScreen yeni
  akışa geçince ayrı bir adımda temizlenecek.
- `npm run build` hatasız geçti (proje `tsc` içermiyor, tip kontrolü sadece `vite build` üzerinden).
- Sıradaki adımlar (onay bekliyor): (2) HomeScreen'de rol/deneyim/bölge sonrası kategori checkbox
  akışı, (3) ResultsScreen + PDF'in kategori listesi + kademeli indirimli toplamı göstermesi.

---

## 4 Temmuz 2026 — HomeScreen'de kategori checkbox akışı (adım 2)

- HomeScreen'e, rol seçilince o rolün paket kategorilerini (şu an sadece Grafik Tasarımcı, 4
  kategori) checkbox listesi olarak gösteren yeni bölüm eklendi (Deneyim'den hemen sonra).
  Kategorisi olmayan roller (diğer 29 rol) için bölüm hiç render edilmiyor — eski davranış
  (sadece rol seçmek yeterli) korunuyor.
- `Hesapla` butonu: rolün paket kategorisi VARSA en az 1 kategori işaretlenmeden aktif olmuyor;
  kategorisi olmayan rollerde eskisi gibi sadece rol seçimi yeterli.
- Rol değişince eski kategori seçimleri otomatik temizleniyor (farklı rolün kategori id'leri
  farklı, stale seçim kalmasın diye).
- Seçim kayboLmasın diye ufak bir kapsam genişletmesi yapıldı (istenenin ötesinde ama gerekliydi):
  `CalcInput` tipine `categoryIds: string[]` eklendi, `calcInputQuery.ts` bunu URL'de
  `categories=id1,id2` olarak taşıyor, `homeFormState.ts` da `selectedCategoryIds`'i sayfa
  hafızasında saklıyor. ResultsScreen bu alanı henüz OKUMUYOR (adım 3'te kullanılacak) — şu an
  sadece sessizce yok olmasını engelliyor.
- Yeni i18n anahtarları: `labelCategories`, `categoriesSub` (TR + EN).
- `npm run build` hatasız geçti.
- Sıradaki adım (onay bekliyor): (3) ResultsScreen + PDF'in seçilen kategori listesini ve
  `calculatePackageQuote()` ile hesaplanan kademeli indirimli toplamı göstermesi (eski
  saatlik/hours bloklarının yerine).

---

## 4 Temmuz 2026 — Kategori checkbox'larına açıklama + "Detaylar" modalı

- `data/packages/types.ts`: `RoleCategoryDef`'e `items`/`itemsEn: string[]` eklendi (kategorinin
  alt kalemleri). Ayrı bir "description" alanı YOK — kısa açıklama satırı bu listeden
  (`items.join(", ")`) türetiliyor, tek kaynak korunuyor.
- `data/packages/graphicDesigner.ts`: 4 kategorinin hepsine kullanıcının verdiği alt kalem
  listeleri (TR) + İngilizce çevirileri eklendi.
- `pages/HomeScreen.tsx`: kategori satırı artık `<button>` değil `role="checkbox"` bir `<div>`
  (klavye erişimi Enter/Space ile korunuyor) — içine gerçek bir `<button>` (Dialog trigger)
  nested edilebilsin diye. Satırın altında soluk renkli kısa açıklama satırı var. Sağda
  altı çizili, hover'da renk değişen "Detaylar" linki (`min-h-11` = 44px dokunma alanı) — tıklanınca
  `stopPropagation` ile checkbox toggle'ını tetiklemeden bir Dialog (shadcn `ui/dialog.tsx`, zaten
  responsive/mobilde taşmayan) açılıyor, tam alt kalem listesini gösteriyor.
- Yeni i18n anahtarları: `categoryDetailsLink`, `categoryDetailsTitle` (TR + EN).
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.
- Checkbox işaretleme/fiyat mantığına dokunulmadı, diğer sayfalar değişmedi.

---

## 5 Temmuz 2026 — Sektör ve Araçlar grupları zorunlu hale getirildi

- `pages/HomeScreen.tsx`: "Ek bilgiler (isteğe bağlı)" başlığındaki "(isteğe bağlı)" kaldırıldı,
  Sektör ve Araçlar grupları artık zorunlu. `sectorSelected`/`toolsSelected` türetildi (chips
  grubundaki item'lardan/role bağlı tools listesinden en az 1 seçili mi kontrolü). `Hesapla`
  butonu artık kategori şartına ek olarak bu ikisi de sağlanmadan aktif olmuyor.
  Boş kalan grubun altında kırmızı uyarı satırı (`t.requiredFieldWarning`) beliriyor.
- `i18n/tr.ts` / `en.ts`: `extrasSub` ("isteğe bağlı"/"optional") kaldırıldı (artık kullanılmıyor,
  kaldırılması zaten bu görevin parçasıydı), yerine `requiredFieldWarning` eklendi.
- Kategori checkbox grubunun kendi mantığına (açıklama satırları, Detaylar modalı), fiyat
  hesaplamaya, diğer sayfalara dokunulmadı.
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — Zorunluluk uyarısı: sayfa açılışında değil, "Hesapla" denemesinde göster

- `pages/HomeScreen.tsx`: yeni `attemptedSubmit` state. Sektör/Araçlar/Kategori gruplarındaki
  kırmızı uyarı artık sayfa ilk açıldığında görünmüyor — kullanıcı tercih ettiği gibi (`tercihen
  görünmesin`) boş gruplarda hiçbir şey yok. Sadece kullanıcı `Hesapla` butonuna basıp da hâlâ
  eksik alan varsa `attemptedSubmit` true olup ilgili boş grup(lar)ın altında kırmızı uyarı
  beliriyor; alan doldurulunca o gruba özel uyarı kayboluyor (koşullar canlı, state'e bağlı).
  Kategori grubuna da aynı uyarı eklendi (önceden yoktu, kendi mantığına dokunulmadı — sadece bu
  proje-geneli uyarı deseni eklendi).
- Bunu yapabilmek için CTA butonu native `disabled` yerine `aria-disabled` + manuel `onClick`
  guard'ına geçti (native disabled buton hiç click event'i ateşlemiyor, "tıklama denemesi"
  yakalanamıyordu). Görsel/davranışsal sonuç aynı: `canCalculate` false iken opacity düşük,
  cursor-not-allowed, gerçek submit/navigate tetiklenmiyor — sadece `attemptedSubmit(true)`
  set ediliyor.
- `canCalculate` mevcut role/kategori/sektör/araç şartlarının aynısı (mantık değişmedi).
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — 30 rol → 12 meslek grubuna konsolidasyon

- `data/roles.ts` tamamen yeniden yazıldı: `ROLES_TR`, `ROLES_EN`, `ROLE_IDS`, `ROLE_DEFAULT_HOURS`
  30'dan 12 elemana indi, hepsi aynı sırada (Grafik Tasarımcı, Marka Tasarımcısı, UI/UX ve Ürün
  Tasarımcısı, İllüstrasyon, Konsept Sanatı, Animatör, Motion Tasarımcı ve VFX, Web Geliştirici,
  Mobil Uygulama Geliştirici, Yazarlık ve İçerik, Dijital Pazarlama, Prodüksiyon ve Medya).
  `graphic-designer` roleId ve saat değeri (25) korundu — `data/packages/graphicDesigner.ts`'e
  dokunulmadı.
- `RoleCategory` enum + `ROLE_CATEGORIES` + `TOOLS_BY_CATEGORY` + `getRoleCategory()` katmanı
  kaldırıldı, yerine roleId'ye direkt bağlı `TOOLS_BY_ROLE_ID: Record<string,string[]>` geldi
  (12 elemanda dolaylı kategori katmanına gerek kalmadı; "Dijital Pazarlama" da eski 6 kategoriden
  hiçbirine oturmadığı için bu değişiklik onu da doğal şekilde çözdü).
- `pages/HomeScreen.tsx`: `getRoleCategory`/`TOOLS_BY_CATEGORY` importu kaldırıldı,
  `tools` artık `TOOLS_BY_ROLE_ID[roleId]`'den türetiliyor, chip-reset `useEffect`'i `category`
  yerine `roleId`'ye bağlandı. Checkbox/zorunluluk davranışı (Sektör/Araçlar/Kategori mantığı)
  DEĞİŞMEDİ, sadece veri kaynağı değişti.
- `CatalogScreen.tsx`'e hiç dokunulmadı (zaten `ROLES_TR/EN` kullanmıyordu, bağımsızlığı teyit
  edilmişti).
- `calcInputQuery.ts`/`homeFormState.ts`'in role'ü string olarak taşıma mantığı değişmedi.
- "Dijital Pazarlama" listede var ama `data/packages/`'de kendi paket verisi YOK (bilinçli
  placeholder — `getRoleCategories()` boş dizi döner, mevcut fallback zaten bunu karşılıyor).
  Ayrıca araştırılıp veri eklenecek.
- Index hizası elle doğrulandı: 4 dizi de 12'şer eleman, aynı sırada (dosya içeriği okunarak
  teyit edildi).
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — UI/UX ve Ürün Tasarımcısı paket verisi eklendi (3. rol)

- Kullanıcı `roleId: "ui-ux-designer"` önerdi ama `roles.ts`'teki gerçek slug
  `"ui-ux-product-designer"` (ROLE_IDS index 2, ROLES_TR "UI/UX ve Ürün Tasarımcısı") — doğru
  slug kullanıldı.
- Yeni `data/packages/uiUxDesigner.ts`: 4 kategori — UX Araştırma ve Analiz, Bilgi Mimarisi ve
  İskelet, UI Tasarımı, Prototipleme ve Handoff — her biri 3 bölge × 3 deneyim = 9 veri noktası,
  toplam 36. Veri doğrudan EUR verildi (TRY/USD çevrimi gerekmedi).
- `data/packages/index.ts` registry'sine `"ui-ux-product-designer": UI_UX_DESIGNER_CATEGORIES`
  eklendi.
- 36 veri noktasının hepsi elle kontrol edildi: her kategoride junior<orta<uzman VE
  Türkiye<Doğu Avrupa<Batı Avrupa sıralaması tutarlı, anomali yok.
- `graphicDesigner.ts`, `brandDesigner.ts`, `roles.ts`, HomeScreen/ResultsScreen/PDF koduna
  dokunulmadı.
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — Dil değiştirince seçimlerin kaybolması düzeltildi

- Kök sebep remount/key sorunu DEĞİLDİ (App.tsx'te `key={lang}` yok, route değişmiyor).
  Gerçek sebep: `role` state'i (HomeScreen) ve `CalcInput.role` (URL) o an aktif DİLDEKİ görünen
  etiketi ("Grafik Tasarımcı" / "Graphic Designer") ham string olarak saklıyordu. Dil değişince
  `ROLES_TR`/`ROLES_EN` dizisi değiştiği için eski string yeni dizide bulunamıyordu
  (`getRoleId`'nin `indexOf` çağrısı -1 dönüyordu) → `roleId` `null` oluyordu → ona bağlı
  kategori/araç listeleri boşalıyordu → kategori/araç seçimleri de zincirleme siliniyordu.
  Ayrıca Sektör chip'leri de ("Teknoloji"/"Tech") dil bazlı çevrilmiş ham string olarak
  saklandığı için aynı şekilde kırılıyordu.
- Kalıcı çözüm: seçim state'lerini dilden bağımsız STABİL kimliklerle tutmaya geçirdim.
  - `lib/pricing.ts`: `CalcInput.role: string` → `CalcInput.roleId: string`.
  - `lib/calcInputQuery.ts`: URL parametresi `role` → `roleId`.
  - `lib/homeFormState.ts`: `HomeFormState.role` → `roleId`.
  - `data/roles.ts`: `getRoleId()` (string→id, kırılgan) kaldırıldı, yerine `getRoleLabel(roleId,
    lang)` geldi (id→string, güvenli — her render'da güncel dille yeniden hesaplanır). `CHIPS_TR`/
    `CHIPS_EN` artık `{id, label}` çiftleri taşıyor (id'ler: tech/ecommerce/health/education/
    finance/media/startup/enterprise, dilden bağımsız); çeviri METİNLERİ değişmedi.
  - `pages/HomeScreen.tsx`: `role` state'i `roleId` oldu, `<select>` artık `ROLE_IDS`'ten değer
    alıp o an aktif dilin etiketini gösteriyor. Sektör chip toggle'ı artık `chip.id` üzerinden.
  - `pages/ResultsScreen.tsx`: URL'den `roleId` okunuyor, ekranda gösterilecek `roleLabel` her
    render'da `getRoleLabel(roleId, lang)` ile taze hesaplanıyor — dil değişince SADECE bu metin
    güncelleniyor, `roleId`/kategori seçimleri/hesaplama hiç etkilenmiyor.
- Kategori seçimleri (`selectedCategoryIds`) zaten `cat.id` gibi stabil id kullanıyordu, araç
  chip'leri de (tool adları) zaten dilden bağımsızdı — ikisi de bu bug'dan doğrudan etkilenmiyordu,
  sadece rol kırılınca zincirleme sıfırlanıyorlardı; role/roleId düzeltilince onlar da düzeldi.
- Kategori/fiyat hesaplama mantığına, çeviri metinlerinin kendisine dokunulmadı.
- `npm run build` hatasız geçti; `getRoleId` için repo genelinde kalan referans kalmadığı
  grep ile doğrulandı. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — Marka Tasarımcısı paket verisi eklendi (2. rol)

- Yeni `data/packages/brandDesigner.ts`: `roleId: "brand-designer"` (roles.ts'teki `ROLE_IDS`
  slug'ıyla teyit edildi), 3 kategori — Strateji ve İsimlendirme, Ana Kimlik İnşası, Kılavuzlama —
  her biri 3 bölge × 3 deneyim = 9 veri noktası, toplam 27. Veri doğrudan EUR olarak verildiği
  için (Grafik Tasarımcı'daki gibi TRY/USD çevrimi gerekmedi) dosyanın üst yorumu buna göre yazıldı.
  Kullanıcının verdiği örnek TL geri-çevrim rakamları tutarsızdı (junior<mid<senior sıralamasına
  uymuyordu) — uydurma/yanlış bir yorum eklemek yerine atlandı, sadece "EUR baseline olarak
  verildi" notu bırakıldı.
- `data/packages/index.ts` registry'sine `"brand-designer": BRAND_DESIGNER_CATEGORIES` eklendi.
- 27 veri noktasının hepsi elle kontrol edildi: her kategoride junior<orta<uzman VE
  Türkiye<Doğu Avrupa<Batı Avrupa sıralaması tutarlı, anomali yok.
- `graphicDesigner.ts`, `roles.ts`, HomeScreen/ResultsScreen/PDF koduna dokunulmadı (zaten
  role-agnostic, roleId üzerinden otomatik bu yeni veriyi kullanıyor).
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — ResultsScreen'e para birimi seçici eklendi (kök sebep: hiç yoktu)

- Kullanıcı "para birimi butonu tıklanıyor ama değişmiyor" dedi; kod incelemesinde ResultsScreen'de
  o butonun HİÇ VAR OLMADIĞI ortaya çıktı (currency sadece URL'den okunuyordu, setCurrency/buton
  yoktu, Nav'da da global bir toggle yok). Bug değil, eksik özellikmiş — kullanıcıya sorup
  netleştirdim, CatalogScreen'dekine benzer bağımsız bir seçici eklenmesini istedi.
- `pages/ResultsScreen.tsx`: `currency` artık `useState` (`initialCurrency` = URL'den ilk değer,
  sonrası kullanıcı seçimiyle değişir). Header'ın altına TRY/EUR/GBP toggle eklendi
  (CatalogScreen'le aynı buton stili). Tüm fiyat hesaplamaları (`quote`, `regions`, PDF'e giden
  `symbol`/`categories`/`total`) zaten bu `currency` state'ini okuyordu — state'i eklemek tek
  başına tüm ekranı ve PDF'i doğru para biriminde güncellemeye yetti, ayrıca dokunmaya gerek
  kalmadı.
- Kategori seçim mantığına, kademeli indirim formülüne, HomeScreen'in currency seçimine,
  `lib/pdf.ts`'e dokunulmadı.
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — ResultsScreen + PDF paket fiyatlama sistemine geçti

- `pages/ResultsScreen.tsx` tamamen yeniden yazıldı: URL'den `categoryIds` de okunuyor,
  `getRoleId()` + `getRoleCategories()` ile rolün paket kategorileri, `resolveCategoryPrice()` +
  `calculatePackageQuote()` ile seçilen kategorilerin fiyatı ve kademeli indirimli toplamı
  hesaplanıyor. Eski saatlik ücret/proje süresi blokları kaldırıldı, yerine: seçilen her
  kategori kendi (indirim öncesi) fiyatıyla listeleniyor, altta (>1 kategori seçiliyse) "Paket
  indirimi: -X" satırı, en altta büyük "Talep Edilmesi Gereken Ücret" toplamı. 3 bölge kutusu
  artık her bölgedeki aynı kategori seçiminin PAKET TOPLAMINI gösteriyor (saatlik değil).
- İki çökme-önleyici fallback eklendi: (1) rolün `data/packages`'te hiç kaydı yoksa (henüz
  eklenmemiş 11 rolden biri) → "Bu rol için detaylı fiyatlandırma yakında eklenecek" kartı;
  (2) kategori tanımlı ama `categoryIds` boşsa (elle değiştirilmiş URL/eski link) → "En az bir
  kategori seçilmedi" kartı. İkisinde de fiyat/PDF bloğu hiç render edilmiyor, çökme yok.
- `lib/pdf.ts`: `downloadResultsPdf()` imzası değişti — `rate`/`hourlySub` parametreleri
  kaldırıldı, yerine `categories: {label,price}[]` ve `discount: number` geldi. PDF içeriği
  ekranla birebir: kategori listesi + (varsa) indirim satırı + toplam. `categories.length===0`
  durumunda PDF de çökmüyor, "yakında eklenecek" mesajı yazıp erken çıkıyor. Bölgesel
  karşılaştırma bloğu "(saatlik)"ten "paket toplamı"na, `/sa` son ekinden arındırıldı.
- `i18n/tr.ts` + `en.ts`: `labelHours`, `hoursNote`, `resultHourlyLabel`, `resultHourlySub`,
  `resultTotalSub` kaldırıldı (ikisi zaten hiç kullanılmıyordu, üçü bu değişiklikle kullanılmaz
  hale geldi). Yeni: `resultCategoriesLabel`, `resultDiscountLabel`, `resultComingSoonDesc`,
  `resultNoCategorySelected`. `regionMedian` "Ortalama"/"Average" → "Toplam"/"Total" oldu,
  `resultTotalLabel` "...Toplam Ücret" → "...Ücret" (kullanıcının istediği tam ifade).
- Eski saatlik kod (`hourlyRate`, `getDefaultHours`, `BASE_HOURLY_EUR`, `pricing.ts` içinde)
  SİLİNMEDİ, sadece artık hiçbir yerden çağrılmıyor (grep ile doğrulandı — tek referans
  `pricing.ts`'in kendi tanımı). `data/roles.ts`, `TOOLS_BY_ROLE_ID`, `HomeScreen.tsx`'in
  checkbox akışı, `public/seffaflik-raporu.pdf`'e dokunulmadı.
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — İllüstrasyon paket verisi eklendi (4. rol)

- Önce `graphicDesigner.ts`/`brandDesigner.ts`/`uiUxDesigner.ts` karşılaştırmalı analiz edildi:
  her ikisi de 3-4 kategori × 9 veri noktası, Junior/Orta ~0.62 ve Uzman/Orta ~1.43 çarpanı
  istisnasız, Türkiye<Doğu Avrupa<Batı Avrupa sıralaması istisnasız — bu, yeni rol eklerken
  referans alınan "minimum veri kalite standardı" oldu.
- Yeni `data/packages/illustrator.ts`: `roleId: "illustration"` (ROLE_IDS index 3 ile teyit
  edildi, tahmin edilmedi). 3 kategori — Çocuk Kitabı İllüstrasyonu, Çizgi Roman/Panel
  İllüstrasyonu, Dijital Ressam — her biri 3 bölge × 3 deneyim = 9 veri noktası, toplam 27.
  Veri doğrudan EUR verildi.
- Dosyanın üst yorumunda GÜVEN NOTU var: Türkiye rakamları için somut kaynak bulunamadı,
  genel grafik tasarım oranlarından tahmin edildi (düşük güven); Doğu/Batı Avrupa rakamları
  uluslararası kaynaklardan (voxillustration.com, Fiverr/Truelancer) geldi (daha güvenilir).
- `data/packages/index.ts` registry'sine `"illustration": ILLUSTRATOR_CATEGORIES` eklendi.
- 27 veri noktasının hepsi elle kontrol edildi: her kategoride junior<orta<uzman VE
  Türkiye<Doğu Avrupa<Batı Avrupa sıralaması tutarlı, çarpanlar (~0.62/~1.43) diğer rollerle
  aynı aralıkta, anomali yok.
- `graphicDesigner.ts`, `brandDesigner.ts`, `uiUxDesigner.ts`, `roles.ts`, HomeScreen/
  ResultsScreen/PDF koduna dokunulmadı.
- `npm run build` hatasız geçti. Tarayıcı testi kullanıcıya bırakıldı.

---

## 5 Temmuz 2026 — İllüstrasyon: kategori adı değişikliği + Geleneksel/Dijital araç ayrımı

- `data/packages/illustrator.ts`: "Dijital Ressam" kategorisi "Özel Sipariş"/"Custom Commission"
  oldu (label/labelEn), fiyat ve items listesi değişmedi.
- `data/roles.ts`: yeni `ILLUSTRATION_TOOL_GROUPS` (id: "digital"/"traditional", her biri
  label/labelEn + tools listesi, tools stabil id + label/labelEn + opsiyonel tooltip/tooltipEn).
  Dijital: Adobe Suite (tooltip'li), Clip Studio Paint, Procreate, Krita, Inkscape, Autodesk
  Sketchbook. Geleneksel: Mürekkepli kalem/Ink pen, Renkli marker/Colored marker, Suluboya/
  Watercolor, Guaj/Gouache, Akrilik/Acrylic, Yağlı boya/Oil paint. `TOOLS_BY_ROLE_ID["illustration"]`
  artık bu grupların düz (flat) id listesinden türetiliyor — eski `["Procreate","Adobe
  Illustrator","Photoshop","Clip Studio Paint"]` listesi kaldırıldı, `toolsSelected`/`ALL_TOOLS`
  mantığı grup ayrımından habersiz, sadece "en az bir araç id'si seçili mi" kontrolü yapmaya
  devam ediyor.
- `pages/HomeScreen.tsx`: yeni `toolGroupId` state (`"digital" | "traditional" | null`), rol
  değişince (İllüstrasyon'dan çıkılınca) sıfırlanıyor. Araçlar grubu artık `roleId ===
  "illustration"` ise: önce Geleneksel/Dijital toggle butonları, seçilince altında o gruba ait
  checkbox'lar. Diğer 10 rolde eski düz liste davranışı DEĞİŞMEDİ (ayrı kod dalı, `isIllustration
  ? ... : tools.length > 0 && ...`).
  - Adobe Suite chip'i `components/ui/tooltip.tsx` (mevcut shadcn Radix tooltip) ile sarıldı,
    hover'da "Photoshop, Illustrator, InDesign ve diğer Adobe uygulamaları" gösteriyor. Diğer
    araçlara tooltip eklenmedi (kullanıcı isteği).
- Sektör grubu, kategori checkbox mantığı, fiyat hesaplama, diğer rollerin Araçlar görünümü
  değişmedi.
- `npm run build` hatasız geçti. Tarayıcı testi (masaüstü + mobil) kullanıcıya bırakıldı — not:
  Radix Tooltip hover-tabanlı, mobilde dokunmatik davranışı kullanıcı test edecek.
