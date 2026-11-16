import { readStorageConfig } from "../config/storage.js";
import { AppError } from "../errors/AppError.js";

export function assertStoragePath(path: string) {
  if (!/^(?:certifications|projects)\/[1-9]\d*\/[a-f0-9-]{36}\.webp$/.test(path)) {
    throw new AppError("Invalid managed image path.", 400);
  }
}

/** Backend-only REST client; never returns upstream errors/headers or keys. */
class SupabaseStorage {
  getPublicUrl(path: string) {
    assertStoragePath(path);
    const { url, bucket } = readStorageConfig();
    return `${url}/storage/v1/object/public/${bucket}/${path}`;
  }

  private async request(path: string, init: RequestInit) {
    let config: ReturnType<typeof readStorageConfig>;
    try { config = readStorageConfig(); }
    catch { throw new AppError("Image storage is not configured.", 503); }
    const key = process.env.SUPABASE_SECRET_KEY?.trim();
    if (!key) throw new AppError("Image storage is not configured.", 503);
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${key}`);
    headers.set("apikey", key);
    let response: Response;
    try {
      response = await fetch(`${config.url}/storage/v1/object/${config.bucket}${path}`, {
        ...init, headers, redirect: "error", signal: AbortSignal.timeout(8_000),
      });
    } catch { throw new AppError("Storage is unavailable or timed out. Try again later.", 502); }
    if (!response.ok) throw new AppError("Storage rejected the image operation. Try again later.", 502);
    await response.body?.cancel();
  }

  async uploadImage(path: string, buffer: Buffer) {
    assertStoragePath(path);
    await this.request(`/${path}`, {
      method: "POST", body: new Uint8Array(buffer),
      headers: { "Content-Type": "image/webp", "Cache-Control": "max-age=3600", "x-upsert": "false" },
    });
  }

  async deleteImage(path: string) {
    assertStoragePath(path);
    // Batch remove is idempotent for an absent object, including upload timeouts.
    await this.request("", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: [path] }),
    });
  }
}

export const storage = new SupabaseStorage();
