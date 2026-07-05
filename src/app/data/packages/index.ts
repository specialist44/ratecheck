import type { RoleCategoryDef, RoleCategorySet } from "./types";
import { GRAPHIC_DESIGNER_CATEGORIES } from "./graphicDesigner";
import { BRAND_DESIGNER_CATEGORIES } from "./brandDesigner";
import { UI_UX_DESIGNER_CATEGORIES } from "./uiUxDesigner";
import { ILLUSTRATOR_CATEGORIES } from "./illustrator";
import { CONCEPT_ARTIST_CATEGORIES } from "./conceptArtist";
import { ANIMATOR_CATEGORIES } from "./animator";
import { MOTION_VFX_ARTIST_CATEGORIES } from "./motionVfxArtist";
import { WEB_DEVELOPER_CATEGORIES } from "./webDeveloper";
import { MOBILE_APP_DEVELOPER_CATEGORIES } from "./mobileAppDeveloper";

// Diğer roller eklendikçe burada birer satır olarak kaydedilecek.
const REGISTRY: Record<string, RoleCategorySet> = {
  "graphic-designer": GRAPHIC_DESIGNER_CATEGORIES,
  "brand-designer": BRAND_DESIGNER_CATEGORIES,
  "ui-ux-product-designer": UI_UX_DESIGNER_CATEGORIES,
  "illustration": ILLUSTRATOR_CATEGORIES,
  "concept-art": CONCEPT_ARTIST_CATEGORIES,
  "animator": ANIMATOR_CATEGORIES,
  "motion-vfx": MOTION_VFX_ARTIST_CATEGORIES,
  "web-developer": WEB_DEVELOPER_CATEGORIES,
  "mobile-app-developer": MOBILE_APP_DEVELOPER_CATEGORIES,
};

export function getRoleCategories(roleId: string): RoleCategoryDef[] {
  return REGISTRY[roleId]?.categories ?? [];
}
