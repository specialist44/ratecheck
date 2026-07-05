import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const WRITER_CONTENT_CREATOR_CATEGORIES: RoleCategorySet = {
  roleId: "writing-content",
  categories: [
    {
      id: "copywriter",
      label: "Metin Yazarı (Copywriter)",
      labelEn: "Copywriter",
      items: ["Dönüşüm odaklı (Conversion-driven) Landing Page kopyası", "Google Ads ve Meta reklam ağları için kısa/vurucu reklam metinleri (Ad Copy)", "Marka sloganı, motto ve manifesto yazımı", "Video reklam, radyo spotu veya podcast reklam senaryosu yazımı", "Otomatik E-posta pazarlama dizileri (Funnels/Sequences) metinleri"],
      itemsEn: ["Conversion-driven landing page copy", "Short/punchy ad copy for Google Ads and Meta ad networks", "Brand slogan, motto, and manifesto writing", "Video ad, radio spot, or podcast ad script writing", "Automated email marketing funnel/sequence copy"],
      price: {
        turkey: { junior: 64, mid: 103, senior: 147 },
        eastern: { junior: 290, mid: 468, senior: 669 },
        western: { junior: 744, mid: 1200, senior: 1716 },
      },
    },
    {
      id: "content-creator",
      label: "İçerik Üreticisi",
      labelEn: "Content Creator",
      items: ["SEO uyumlu, sektörel derinliğe sahip blog yazısı ve makaleler", "Bülten (Whitepaper) ve indirilebilir E-Kitap (Lead magnet) içerikleri", "Markalar için senaryolu dikey UGC (Kullanıcı Tarafından Üretilen İçerik) videoları", "Sosyal medya gönderileri için açıklama metni (Caption) yazımı"],
      itemsEn: ["SEO-friendly, industry-depth blog posts and articles", "Whitepaper and downloadable e-book (lead magnet) content", "Scripted vertical UGC (user-generated content) videos for brands", "Caption writing for social media posts"],
      price: {
        turkey: { junior: 32, mid: 51, senior: 73 },
        eastern: { junior: 145, mid: 234, senior: 335 },
        western: { junior: 372, mid: 600, senior: 858 },
      },
    },
  ],
};
