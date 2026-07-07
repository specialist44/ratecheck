import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
// Bu rol diğerlerinden farklı bir desen kullanıyor: kategori tek sabit fiyat
// veya tekli mecra seçimi değil, ÇOKLU SEÇİLEBİLEN alt kalemler (subItems)
// taşıyor — kullanıcı bir kategoriden istediği kadar alt kalem seçer, seçilen
// alt kalemlerin fiyatları toplanıp kategori toplamı olur (bkz. types.ts
// RoleCategorySubItem, lib/packagePricing.ts resolveSubItemsPrice).
export const MOTION_VFX_ARTIST_CATEGORIES: RoleCategorySet = {
  roleId: "motion-vfx",
  categories: [
    {
      id: "motion-designer",
      label: "Motion Tasarımcı",
      labelEn: "Motion Designer",
      items: ["Kinetik Tipografi: Ses ve ritimle senkronize hareket eden metinler", "Logo Intro ve Outro animasyonları", "Yayın grafikleri (Broadcast): Alt bant, jenerik, geçiş efektleri", "Kesintisiz tekrar eden (Loop) Spotify Canvas veya Instagram grafikleri"],
      itemsEn: ["Kinetic Typography: Text synced to rhythm/audio", "Logo Intro/Outro animations", "Broadcast graphics: Lower thirds, titles, transitions", "Seamless loop Spotify Canvas or Instagram graphics"],
      subItems: [
        {
          id: "ui-ux-lottie",
          label: "UI/UX ve Lottie Animasyonları",
          labelEn: "UI/UX & Lottie Animations",
          price: {
            turkey: { junior: 13, mid: 21, senior: 30 },
            eastern: { junior: 58, mid: 94, senior: 134 },
            western: { junior: 149, mid: 240, senior: 343 },
          },
        },
        {
          id: "explainer-videos",
          label: "Açıklayıcı Videolar",
          labelEn: "Explainer Videos",
          note: "Kinetik tipografi ve logo animasyonu dahildir",
          noteEn: "Includes kinetic typography and logo animation",
          price: {
            turkey: { junior: 37, mid: 60, senior: 86 },
            eastern: { junior: 169, mid: 273, senior: 390 },
            western: { junior: 434, mid: 700, senior: 1001 },
          },
        },
        {
          id: "social-media-ads",
          label: "Sosyal Medya ve Dijital Reklam Animasyonları",
          labelEn: "Social Media & Digital Ad Animations",
          note: "Logo animasyonu ve kinetik tipografi dahildir",
          noteEn: "Includes logo animation and kinetic typography",
          price: {
            turkey: { junior: 19, mid: 30, senior: 43 },
            eastern: { junior: 84, mid: 136, senior: 194 },
            western: { junior: 217, mid: 350, senior: 500 },
          },
        },
        {
          id: "broadcast-design",
          label: "Jenerik ve Yayın (Broadcast) Tasarımları",
          labelEn: "Broadcast Design",
          note: "Logo animasyonu ve kinetik tipografi dahildir",
          noteEn: "Includes logo animation and kinetic typography",
          price: {
            turkey: { junior: 37, mid: 60, senior: 86 },
            eastern: { junior: 169, mid: 273, senior: 390 },
            western: { junior: 434, mid: 700, senior: 1001 },
          },
        },
        {
          id: "3d-product-animations",
          label: "3D Ürün Animasyonları",
          labelEn: "3D Product Animations",
          price: {
            turkey: { junior: 48, mid: 77, senior: 110 },
            eastern: { junior: 218, mid: 351, senior: 502 },
            western: { junior: 558, mid: 900, senior: 1287 },
          },
        },
        {
          id: "game-trailers-promos",
          label: "Oyun Fragmanları ve Promo Videoları",
          labelEn: "Game Trailers & Promos",
          note: "Kinetik tipografi ve logo animasyonu dahildir",
          noteEn: "Includes kinetic typography and logo animation",
          price: {
            turkey: { junior: 43, mid: 69, senior: 99 },
            eastern: { junior: 193, mid: 312, senior: 446 },
            western: { junior: 496, mid: 800, senior: 1144 },
          },
        },
        {
          id: "stage-event-visuals",
          label: "Sahne ve Etkinlik Görselleri (Loop/VFX)",
          labelEn: "Stage & Event Visuals (Loop/VFX)",
          note: "GIF ve mikro animasyon teknikleri dahildir",
          noteEn: "Includes GIF and micro-animation techniques",
          price: {
            turkey: { junior: 21, mid: 34, senior: 49 },
            eastern: { junior: 97, mid: 156, senior: 223 },
            western: { junior: 248, mid: 400, senior: 572 },
          },
        },
      ],
    },
    {
      id: "vfx-artist",
      label: "VFX Sanatçısı",
      labelEn: "VFX Artist",
      items: ["Kompozitleme (Compositing): CGI objeleri gerçek çekimlere entegre etme", "Rotoskop ve Paint: İstenmeyen objeleri/kabloları silme (Cleanup)", "Yeşil perde (Chroma Key) temizliği ve arka plan değiştirme", "3D Parçacık (Particle) ve yıkım/akışkan simülasyonları"],
      itemsEn: ["Compositing: Integrating CGI objects into live footage", "Rotoscoping and Paint: Removing unwanted objects/wires (cleanup)", "Chroma key cleanup and background replacement", "3D particle and destruction/fluid simulations"],
      subItems: [
        {
          id: "chroma-key-cleanup",
          label: "Yeşil/Mavi Ekran (Chroma Key) Temizleme",
          labelEn: "Chroma Key Cleanup",
          note: "Kompozitleme tekniği dahildir",
          noteEn: "Includes compositing technique",
          price: {
            turkey: { junior: 16, mid: 26, senior: 37 },
            eastern: { junior: 73, mid: 117, senior: 167 },
            western: { junior: 186, mid: 300, senior: 429 },
          },
        },
        {
          id: "particle-dynamic-simulations",
          label: "Partikül ve Dinamik Simülasyonları",
          labelEn: "Particle & Dynamic Simulations",
          note: "Kompozitleme ve kamera/hareket takibi dahildir",
          noteEn: "Includes compositing and camera/motion tracking",
          price: {
            turkey: { junior: 40, mid: 64, senior: 92 },
            eastern: { junior: 181, mid: 292, senior: 418 },
            western: { junior: 465, mid: 750, senior: 1072 },
          },
        },
        {
          id: "wire-rig-object-removal",
          label: "Nesne ve Kablo Silme (Wire/Rig/Object Removal)",
          labelEn: "Wire/Rig/Object Removal",
          note: "Rotoskopi tekniği dahildir",
          noteEn: "Includes rotoscoping technique",
          price: {
            turkey: { junior: 17, mid: 28, senior: 40 },
            eastern: { junior: 78, mid: 125, senior: 179 },
            western: { junior: 198, mid: 320, senior: 458 },
          },
        },
        {
          id: "cgi-integration",
          label: "CGI (3D Nesne) Entegrasyonu",
          labelEn: "CGI Integration",
          note: "Kompozitleme ve kamera/hareket takibi dahildir",
          noteEn: "Includes compositing and camera/motion tracking",
          price: {
            turkey: { junior: 43, mid: 69, senior: 99 },
            eastern: { junior: 193, mid: 312, senior: 446 },
            western: { junior: 496, mid: 800, senior: 1144 },
          },
        },
        {
          id: "set-extension",
          label: "Set Genişletme (Set Extension)",
          labelEn: "Set Extension",
          note: "Kompozitleme, matte painting ve kamera/hareket takibi dahildir",
          noteEn: "Includes compositing, matte painting, and camera/motion tracking",
          price: {
            turkey: { junior: 40, mid: 64, senior: 92 },
            eastern: { junior: 181, mid: 292, senior: 418 },
            western: { junior: 465, mid: 750, senior: 1072 },
          },
        },
        {
          id: "beauty-retouch",
          label: "Güzellik Rötuşları (Beauty Retouch/Digital Makeup)",
          labelEn: "Beauty Retouch",
          price: {
            turkey: { junior: 13, mid: 21, senior: 30 },
            eastern: { junior: 58, mid: 94, senior: 134 },
            western: { junior: 149, mid: 240, senior: 343 },
          },
        },
      ],
    },
  ],
};
