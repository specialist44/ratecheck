import type { RoleCategoryDef, RoleCategorySet } from "./types";
import { GRAPHIC_DESIGNER_CATEGORIES } from "./graphicDesigner";

// Diğer 29 rol eklendikçe burada birer satır olarak kaydedilecek.
const REGISTRY: Record<string, RoleCategorySet> = {
  "graphic-designer": GRAPHIC_DESIGNER_CATEGORIES,
};

export function getRoleCategories(roleId: string): RoleCategoryDef[] {
  return REGISTRY[roleId]?.categories ?? [];
}
