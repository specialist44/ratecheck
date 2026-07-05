import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
// Birim: "10 saniyelik standart animasyon klibi" (örn. bir karakter döngüsü,
// kısa bir sahne) — Konsept Sanatı'ndan farklı olarak bu rolde mecra (variant)
// ayrımı yok, her kategori düz price tablosu taşıyor.
export const ANIMATOR_CATEGORIES: RoleCategorySet = {
  roleId: "animator",
  categories: [
    {
      id: "2d-animator",
      label: "2D Animatör",
      labelEn: "2D Animator",
      items: ["Açıklayıcı (Explainer) eğitim veya ürün tanıtım animasyonları", "Lottie (JSON) formatında web/mobil arayüz döngü animasyonları", "Beyaz tahta (Whiteboard) çizim animasyonları"],
      itemsEn: ["Explainer/product intro animations", "Lottie (JSON) format web/mobile interface loop animations", "Whiteboard drawing animations"],
      price: {
        turkey: { junior: 33, mid: 53, senior: 76 },
        eastern: { junior: 150, mid: 242, senior: 346 },
        western: { junior: 384, mid: 620, senior: 887 },
      },
    },
    {
      id: "3d-animator",
      label: "3D Animatör",
      labelEn: "3D Animator",
      items: ["Endüstriyel veya teknolojik ürün tanıtım/montaj animasyonları (CGI)", "Mimari walkthrough (Bina/Mekan içi kamera gezintisi)", "Oyun motorları için sahne (Cutscene) animasyonları"],
      itemsEn: ["Industrial/tech product intro/assembly animations (CGI)", "Architectural walkthrough (interior camera tour)", "Game engine cutscene animations"],
      price: {
        turkey: { junior: 66, mid: 106, senior: 152 },
        eastern: { junior: 300, mid: 484, senior: 692 },
        western: { junior: 769, mid: 1240, senior: 1773 },
      },
    },
    {
      id: "frame-by-frame-character",
      label: "Kare-Kare ve Karakter Animatörü",
      labelEn: "Frame-by-Frame & Character Animator",
      items: ["24 FPS geleneksel frame-by-frame karakter canlandırma", "Yürüme, koşma, bekleme (Walk/Run/Idle cycle) oyun döngüleri", "Ses kaydına tam uyumlu dudak senkronizasyonu (Lip-sync)", "2D FX Animasyonu (patlama, ateş, duman, su efektleri)"],
      itemsEn: ["24 FPS traditional frame-by-frame character animation", "Walk/Run/Idle cycle game loops", "Full lip-sync to audio recording", "2D FX animation (explosion, fire, smoke, water effects)"],
      price: {
        turkey: { junior: 41, mid: 66, senior: 94 },
        eastern: { junior: 187, mid: 302, senior: 432 },
        western: { junior: 480, mid: 775, senior: 1108 },
      },
    },
    {
      id: "stop-motion-animator",
      label: "Stop Motion Animatör",
      labelEn: "Stop Motion Animator",
      items: ["Kil (Claymation) ve kukla figür canlandırmaları", "Gıda, kozmetik veya ambalajlı ürünlerin nesne (Object) animasyonları", "Kağıt kesme (Cut-out) stop motion videoları"],
      itemsEn: ["Clay (claymation) and puppet figure animations", "Object animation for food, cosmetics, or packaged products", "Cut-out stop motion videos"],
      price: {
        turkey: { junior: 45, mid: 73, senior: 104 },
        eastern: { junior: 206, mid: 332, senior: 475 },
        western: { junior: 528, mid: 852, senior: 1218 },
      },
    },
  ],
};
