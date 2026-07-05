import type { RoleCategorySet } from "./types";

// Kaynak veri doğrudan EUR baseline olarak verildi (TRY/USD çevrimi gerekmedi).
export const MOBILE_APP_DEVELOPER_CATEGORIES: RoleCategorySet = {
  roleId: "mobile-app-developer",
  categories: [
    {
      id: "native-ios",
      label: "Native iOS Geliştirme",
      labelEn: "Native iOS Development",
      items: ["Native iOS (Swift/Objective-C) uygulama kodlama", "Uygulama içi satın alma (In-App Purchase) entegrasyonu", "Push Notification entegrasyonu", "App Store'a teknik yükleme, sertifika ve yayın süreçleri"],
      itemsEn: ["Native iOS (Swift/Objective-C) app coding", "In-app purchase integration", "Push notification integration", "App Store technical upload, certification, and release processes"],
      price: {
        turkey: { junior: 335, mid: 540, senior: 772 },
        eastern: { junior: 744, mid: 1200, senior: 1716 },
        western: { junior: 1240, mid: 2000, senior: 2860 },
      },
    },
    {
      id: "native-android",
      label: "Native Android Geliştirme",
      labelEn: "Native Android Development",
      items: ["Native Android (Kotlin/Java) uygulama kodlama", "Uygulama içi satın alma (In-App Purchase) entegrasyonu", "Push Notification entegrasyonu", "Google Play'e teknik yükleme, sertifika ve yayın süreçleri"],
      itemsEn: ["Native Android (Kotlin/Java) app coding", "In-app purchase integration", "Push notification integration", "Google Play technical upload, certification, and release processes"],
      price: {
        turkey: { junior: 301, mid: 486, senior: 695 },
        eastern: { junior: 670, mid: 1080, senior: 1544 },
        western: { junior: 1116, mid: 1800, senior: 2574 },
      },
    },
    {
      id: "cross-platform",
      label: "Cross-Platform Geliştirme (Flutter/React Native)",
      labelEn: "Cross-Platform Development (Flutter/React Native)",
      items: ["Flutter veya React Native ile tek kod tabanından çift market çıkışı", "Uygulama içi satın alma ve Push Notification entegrasyonu", "App Store ve Google Play'e teknik yükleme, sertifika ve yayın süreçleri"],
      itemsEn: ["Dual-market release from a single codebase with Flutter or React Native", "In-app purchase and push notification integration", "App Store and Google Play technical upload, certification, and release processes"],
      price: {
        turkey: { junior: 251, mid: 405, senior: 579 },
        eastern: { junior: 558, mid: 900, senior: 1287 },
        western: { junior: 930, mid: 1500, senior: 2145 },
      },
    },
  ],
};
