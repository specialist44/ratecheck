# RateCheck — Claude Code Kuralları (guidelines.md)

Bu dosya, Claude Code'un RateCheck üzerinde çalışırken HER ZAMAN uyması gereken kurallardır.
Yeni bir oturuma her başladığında bu dosyayı oku ve kurallara sadık kal.

## 1. Ürün ne, ne değil

RateCheck; freelancer'ların (özellikle tasarım/motion/video/yazılım alanında) "bu iş için ne kadar
istemeliyim" sorusuna, gerçek anket verisine dayalı bir yanıt veren, ücretsiz + reklam destekli bir
web aracıdır. Kurumsal/B2B bir "market intelligence" platformu DEĞİLDİR. Basit, tek işi iyi yapan bir
araç olarak kalmalı.

## 2. Kesinlikle yasak olanlar

- **Runtime'da (kullanıcı siteyi kullanırken) hiçbir canlı AI/LLM çağrısı yapılmayacak.** Ne fiyat
  tahmini, ne e-posta metni, ne kategori önerisi — hiçbiri anlık AI ile üretilmeyecek. Tüm veri ve
  metinler önceden hazırlanmış, sabit (statik) içerik olacak.
- Kullanıcı hesabı, üyelik, login sistemi eklenmeyecek.
- Ödeme altyapısı (kredi kartı, Stripe/iyzico vb.) eklenmeyecek. "Bizi destekle" bağış linki dışında
  hiçbir ödeme akışı yok.
- Sunucu tarafında veritabanı (backend + DB) kurulmayacak. Proje tamamen frontend (React + Vite)
  olarak kalacak. Fiyat verisi bir TypeScript/JSON dosyasında statik olarak tutulacak.
- E-posta/müzakere şablonlarını AI'a YAZDIRMA. Bu özellik kapsam dışı bırakıldı.
- Kullanıcıdan toplanan hiçbir veri (form, dosya) sunucuya gönderilmeyecek — PDF üretimi ve logo
  ekleme tamamen tarayıcı içinde (client-side) çalışacak.

## 3. Kod düzeni kuralları

- Hiçbir dosya 800 satırı geçmesin. `App.tsx` büyüdükçe ekranları ve yardımcı fonksiyonları ayrı
  dosyalara böl: örn. `src/app/screens/HomeScreen.tsx`, `src/app/data/catalog.ts`,
  `src/app/lib/calculate.ts` gibi.
- Yeni bir özellik eklerken önce mevcut kod yapısını (App.tsx içindeki mevcut ekranlar, i18n sistemi,
  CATALOG verisi) oku ve onunla tutarlı ilerle — sıfırdan yeniden yazma.
- Kullanılmayan/ölü kodu (örn. hiçbir yerden çağrılmayan ekranlar) fark edersen bana söyle, ben onay
  vermeden silme.
- Component mantığını koru: bir buton/kart stilini bir kere tasarla, tekrar tekrar kopyalama.
- Renkler, spacing gibi tasarım değerlerini (design tokens) tek bir yerden (CSS değişkenleri /
  theme dosyası) yönet.

## 4. Çalışma şekli — küçük adımlar

- Tek seferde "her şeyi yap" isteği gelse bile, işi küçük, test edilebilir parçalara böl ve bana
  hangi sırayla ilerleyeceğini söyle.
- Her özelliği bitirdiğinde bana ne değiştiğini kısaca özetle ve tarayıcıda test etmemi iste.
- Bir hata/belirsizlik varsa tahmin yürütüp devam etme, bana sor.
- Her oturumun sonunda `memory-bank.md` dosyasına o oturumda ne yaptığını kısaca ekle.
- Kod değişikliklerini doğrularken kendi kendine tarayıcı açma, ekran görüntüsü alma,
  Playwright/chromium-cli gibi araçlarla görsel test yapmaya ÇALIŞMA. `npm run build` ile derleme
  kontrolü yeterli — görsel/işlevsel testi kullanıcı kendi tarayıcısında yapacak.

## 5. Dil ve tasarım

- Şu an sadece Türkçe (TR) ve İngilizce (EN) var. Yapıyı, ileride üçüncü bir dil eklemek kolay
  olacak şekilde kur (mevcut TR/EN obje yapısını koru).
- Tasarım dili monokrom (siyah-beyaz ağırlıklı), hem Dark hem Light mode çalışır durumda kalmalı.
- Mobil ekranlarda da düzgün görünmesi (responsive) her özellik için zorunlu.

## 6. Veri güncelleme

- Fiyat/piyasa verisi (CATALOG ve saatlik ücret çarpanları) elle, periyodik olarak güncellenecek.
  Uygulama içinde otomatik/canlı veri toplama YOK.
