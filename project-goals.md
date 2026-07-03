# RateCheck — Proje Amacı ve Kapsam (project-goals.md)

## Ne için var

Freelancer'ların (ağırlıklı tasarım/motion/video/arayüz, ama herkese açık) bir iş için ne kadar
ücret istemesi gerektiğini, gerçek anket verisine dayanarak, saniyeler içinde, ücretsiz öğrenmesini
sağlamak.

## Hedef kullanıcı

Dünya çapında, her para biriminde çalışabilen freelancer'lar ve küçük ajanslar. Ağırlık tasarım/
motion/video/arayüz alanında.

## Gelir modeli

Tamamen ücretsiz + reklam destekli. Reklamsız kullanmak isteyenler için gönüllü, opsiyonel bir
"bizi destekle" bağış seçeneği var. Zorunlu ücretli katman YOK.

## Çekirdek özellikler (MVP kapsamı — bunlar olacak)

1. **Saatlik hesaplama modu**: Rol + deneyim seviyesi + bölge + (opsiyonel) sektör/araç seçimi →
   min/ortalama/maks saatlik ücret + proje saatine göre toplam teklif tutarı, seçilen para
   biriminde (TRY/EUR/GBP).
2. **Küçük iş kataloğu modu**: Poster, reels, logo vb. iş türleri için, saatlik hesaba gerek
   kalmadan, bölge ve deneyime göre filtrelenebilir sabit fiyat aralıkları.
3. **PDF teklif çıktısı**: Hesaplanan sonucu (rol, bölge, min/ort/maks, toplam) sabit bir PDF
   şablonuna döken, tamamen tarayıcıda (client-side) çalışan, sunucuya veri göndermeyen bir
   dışa aktarma özelliği.
4. **Markalı (white-label) dışa aktarım**: Kullanıcının kendi logosunu yükleyip PDF'in üst
   köşesine otomatik yerleştirebilmesi. Ücretsiz, deterministik (sabit boyut/konum kuralları),
   AI karar vermiyor.
5. **"Nasıl Çalışır?" sayfası**: Verinin nereden geldiğinin şeffaf açıklaması + indirilebilir,
   bandrollu bir araştırma raporu PDF'i.
6. **İletişim / Hakkımızda sayfası**: Kısa "biz kimiz" metni + istek/öneri formu.
7. **TR/EN dil desteği**, **Dark/Light mode**, tam **mobil uyumluluk**.

## Kapsam dışı bırakılanlar (bilinçli olarak YOK — geri eklenmesi istenmedikçe önerilmeyecek)

- ❌ Kullanıcı hesabı / login / üyelik sistemi
- ❌ Herhangi bir ödeme altyapısı (kredi kartı vb.)
- ❌ Runtime'da çalışan canlı AI (fiyat tahmini, kategori önerisi, e-posta yazımı — hiçbiri)
- ❌ E-posta/müzakere şablonları (AI ile üretilen içerik) — tamamen elendi
- ❌ 40+ rol × 12+ bölge kapsamında "B2B Market Intelligence Platform" — bu, 2 kişilik ekibin
  kapasitesinin çok üzerinde, ayrı ve çok daha büyük bir girişim. Şu anki hedef değil.
- ❌ Kurumsal/holding satışı, sales cycle gerektiren B2B modeli
- ❌ Sunucu tarafı veritabanı / backend

## Veri felsefesi

Fiyat verisi **statik**: haftalık/aylık olarak elle (isteğe göre AI destekli araştırmayla, ama
insan onayıyla) güncellenen bir tabloya/dosyaya yazılır. Kullanıcı sorgu yaptığında canlı arama
yapılmaz — hazır tablodan anlık, tutarlı, ücretsiz cevap döner. Bu; hız, maliyet (sıfıra yakın) ve
tutarlılık (herkese aynı rakam) sağlar.

## Teknik yığın (stack)

- Tasarım: Figma
- Geliştirme: Claude Code (vibe coding) — React + TypeScript + Vite (Figma Make çıktısı temel
  alınıyor)
- Barındırma: Vercel (ücretsiz katman yeterli, MVP için)
- Domain: .com, yıllık ~$15
- Rive / Framer / n8n: bu proje için gerekli DEĞİL (başka projeler için ayrı tutuluyor)

## Ekip

2 kişi: Ali Özel (tasarım + vibe coding yönlendirmesi) ve Dünya Deniz Baş (ürün fikri + tasarım).
