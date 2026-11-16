import { storage } from "../../lib/supabase.js";

export function serializeProjectImage<T extends { imagePath: string | null; imageUrl: string | null }>(record: T) {
  return { ...record, imageUrl: record.imagePath ? storage.getPublicUrl(record.imagePath) : record.imageUrl };
}
