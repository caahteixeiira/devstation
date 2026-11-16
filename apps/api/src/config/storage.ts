export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function readStorageConfig(env: NodeJS.ProcessEnv = process.env) {
  let url: URL;
  try { url = new URL(env.SUPABASE_URL ?? ""); }
  catch { throw new Error("SUPABASE_URL must be an HTTP(S) origin."); }
  if ((url.protocol !== "https:" && !(env.NODE_ENV !== "production" && url.protocol === "http:")) ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SUPABASE_URL must be an HTTPS origin without credentials or path.");
  }
  const bucket = env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio";
  if (!/^[a-z][a-z0-9_-]{0,62}$/.test(bucket)) throw new Error("Invalid SUPABASE_STORAGE_BUCKET.");
  return { url: url.origin, bucket };
}
