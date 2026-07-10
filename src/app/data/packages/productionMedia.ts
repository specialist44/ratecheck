import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const PRODUCTION_MEDIA_CATEGORIES: RoleCategorySet = {
  roleId: "production-media",
  categories: [
    {
      id: "video-editor",
      label: "Video Editör",
      labelEn: "Video Editor",
      items: ["YouTube uzun format kurgusu (B-roll, alt yazı, ses senkronizasyonu)", "TikTok/Reels/Shorts için kanca (Hook) odaklı hızlı dikey kurgu", "Çoklu kamera (Multi-cam) röportaj veya podcast video senkronizasyonu", "Sinematik renk düzenleme (Color Grading/Correction)", "Videonun ses tasarım miksajı (Müzik, dip ses temizliği, SFX ekleme)"],
      itemsEn: ["YouTube long-form editing (B-roll, subtitles, audio sync)", "TikTok/Reels/Shorts hook-focused fast vertical editing", "Multi-cam interview or podcast video sync", "Cinematic color grading/correction", "Video sound design mix (music, noise removal, SFX addition)"],
      price: {
        turkey: { junior: 37, mid: 60, senior: 86 },
        eastern: { junior: 169, mid: 273, senior: 390 },
        western: { junior: 434, mid: 700, senior: 1001 },
        us: { junior: 369, mid: 595, senior: 851 },
      },
    },
    {
      id: "photographer",
      label: "Fotoğrafçı",
      labelEn: "Photographer",
      items: ["E-ticaret için beyaz fonlu dekupe ürün fotoğrafçılığı", "Modellerle veya yaşam alanında konsept (Lifestyle) ürün çekimi", "Kurumsal profil, LinkedIn ve yazar kapakları için portre (Headshot) çekimi", "Fuar, konser veya kurumsal etkinlik belgesel/röportaj fotoğrafçılığı", "Mimari ve gayrimenkul dış/iç mekan çekimleri"],
      itemsEn: ["White-background cutout product photography for e-commerce", "Lifestyle product shoots with models or in living spaces", "Corporate profile, LinkedIn, and author headshot photography", "Trade show, concert, or corporate event documentary/interview photography", "Architectural and real estate interior/exterior shoots"],
      price: {
        turkey: { junior: 27, mid: 43, senior: 61 },
        eastern: { junior: 121, mid: 195, senior: 279 },
        western: { junior: 310, mid: 500, senior: 715 },
        us: { junior: 264, mid: 425, senior: 608 },
      },
    },
    {
      id: "podcast-producer",
      label: "Podcast Yapımcısı",
      labelEn: "Podcast Producer",
      items: ["Ham ses kaydındaki hataların (nefes, boşluk, öksürük) temizlenmesi (Audio Editing)", "Bölüm introsu, outrosu ve sponsorluk seslendirmelerinin miksajı", "Bölüm özeti, zaman damgaları (Timestamps) ve şov notlarının (Show Notes) yazılması", "RSS Feed üzerinden Spotify, Apple ve Google Podcasts'e bölüm yükleme ve optimizasyon"],
      itemsEn: ["Cleaning raw audio recording errors (breaths, dead air, coughs) (audio editing)", "Episode intro, outro, and sponsor voiceover mixing", "Episode summary, timestamps, and show notes writing", "Uploading and optimizing episodes to Spotify, Apple, and Google Podcasts via RSS feed"],
      price: {
        turkey: { junior: 16, mid: 26, senior: 37 },
        eastern: { junior: 73, mid: 117, senior: 167 },
        western: { junior: 186, mid: 300, senior: 429 },
        us: { junior: 158, mid: 255, senior: 365 },
      },
    },
  ],
};
