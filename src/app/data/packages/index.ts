import type { RoleCategoryDef, RoleCategorySet } from "./types";
import { GRAPHIC_DESIGNER_CATEGORIES } from "./graphicDesigner";
import { BRAND_DESIGNER_CATEGORIES } from "./brandDesigner";
import { UI_UX_DESIGNER_CATEGORIES } from "./uiUxDesigner";

// Diğer roller eklendikçe burada birer satır olarak kaydedilecek.
const REGISTRY: Record<string, RoleCategorySet> = {
  "graphic-designer": GRAPHIC_DESIGNER_CATEGORIES,
  "brand-designer": BRAND_DESIGNER_CATEGORIES,
  "ui-ux-product-designer": UI_UX_DESIGNER_CATEGORIES,
};

export function getRoleCategories(roleId: string): RoleCategoryDef[] {
  return REGISTRY[roleId]?.categories ?? [];
}
