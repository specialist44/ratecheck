import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
// Her kategori "mecra" (Oyun/Film/Kutu Oyunu vb.) bazlı ayrı fiyat tablosu taşıyor —
// bkz. types.ts RoleCategoryVariant. Kategori.price burada YOK, sadece variants var.
export const CONCEPT_ARTIST_CATEGORIES: RoleCategorySet = {
  roleId: "concept-art",
  categories: [
    {
      id: "character-design",
      label: "Karakter Tasarımcısı",
      labelEn: "Character Designer",
      items: ["Model Sheet (Turnaround)", "İfade Sayfası (Expression Sheet)", "Poz Sayfası (Action/Pose Sheet)", "Kostüm/zırh/aksesuar varyasyon taslakları"],
      itemsEn: ["Model Sheet (Turnaround)", "Expression Sheet", "Action/Pose Sheet", "Costume/armor/accessory variation sketches"],
      variants: [
        {
          id: "game",
          label: "Oyun",
          labelEn: "Game",
          price: {
            turkey: { junior: 33, mid: 53, senior: 75 },
            eastern: { junior: 146, mid: 236, senior: 337 },
            western: { junior: 375, mid: 605, senior: 865 },
          },
        },
        {
          id: "film-tv-animation",
          label: "Film/Dizi/Animasyon",
          labelEn: "Film/TV/Animation",
          price: {
            turkey: { junior: 35, mid: 57, senior: 81 },
            eastern: { junior: 157, mid: 254, senior: 363 },
            western: { junior: 404, mid: 651, senior: 931 },
          },
        },
        {
          id: "board-card-game",
          label: "Kutu-Kart Oyunu",
          labelEn: "Board/Card Game",
          price: {
            turkey: { junior: 17, mid: 28, senior: 40 },
            eastern: { junior: 79, mid: 127, senior: 182 },
            western: { junior: 202, mid: 326, senior: 466 },
          },
        },
        {
          id: "comic-webcomic",
          label: "Çizgi Roman/Webcomic",
          labelEn: "Comic/Webcomic",
          price: {
            turkey: { junior: 23, mid: 36, senior: 52 },
            eastern: { junior: 101, mid: 163, senior: 234 },
            western: { junior: 260, mid: 419, senior: 599 },
          },
        },
      ],
    },
    {
      id: "environment-prop-design",
      label: "Çevre ve Obje Tasarımı",
      labelEn: "Environment & Prop Design",
      items: ["İç ve dış mekan mimari konsept taslakları", "Mood Painting", "Hard Surface (silah, araç, uzay gemisi, makine teknik konseptleri)"],
      itemsEn: ["Interior/exterior architectural concept sketches", "Mood painting", "Hard surface (weapon, vehicle, spaceship, machine technical concepts)"],
      variants: [
        {
          id: "game",
          label: "Oyun",
          labelEn: "Game",
          price: {
            turkey: { junior: 25, mid: 40, senior: 57 },
            eastern: { junior: 112, mid: 181, senior: 259 },
            western: { junior: 288, mid: 465, senior: 665 },
          },
        },
        {
          id: "film-tv-animation",
          label: "Film/Dizi/Animasyon",
          labelEn: "Film/TV/Animation",
          price: {
            turkey: { junior: 28, mid: 45, senior: 64 },
            eastern: { junior: 124, mid: 200, senior: 286 },
            western: { junior: 317, mid: 512, senior: 732 },
          },
        },
        {
          id: "architectural-industrial",
          label: "Mimari/Endüstriyel Tasarım",
          labelEn: "Architectural/Industrial Design",
          price: {
            turkey: { junior: 17, mid: 28, senior: 40 },
            eastern: { junior: 79, mid: 127, senior: 182 },
            western: { junior: 202, mid: 326, senior: 466 },
          },
        },
      ],
    },
    {
      id: "storyboard-artist",
      label: "Storyboard Sanatçısı",
      labelEn: "Storyboard Artist",
      items: ["Sahne/kadraj eskizleri (Paneller)", "Kamera hareketi (Pan/Tilt/Zoom) yönlendirme çizimleri", "Animatik paneller"],
      itemsEn: ["Scene/framing sketches (panels)", "Camera movement (pan/tilt/zoom) direction drawings", "Animatic panels"],
      variants: [
        {
          id: "advertising-commercial",
          label: "Reklam/Ticari Film",
          labelEn: "Advertising/Commercial",
          price: {
            turkey: { junior: 20, mid: 32, senior: 46 },
            eastern: { junior: 90, mid: 145, senior: 207 },
            western: { junior: 231, mid: 372, senior: 532 },
          },
        },
        {
          id: "film-tv",
          label: "Sinema/Dizi",
          labelEn: "Film/TV",
          price: {
            turkey: { junior: 25, mid: 40, senior: 57 },
            eastern: { junior: 112, mid: 181, senior: 259 },
            western: { junior: 288, mid: 465, senior: 665 },
          },
        },
        {
          id: "animation",
          label: "Animasyon",
          labelEn: "Animation",
          price: {
            turkey: { junior: 28, mid: 45, senior: 64 },
            eastern: { junior: 124, mid: 200, senior: 286 },
            western: { junior: 317, mid: 512, senior: 732 },
          },
        },
      ],
    },
  ],
};
