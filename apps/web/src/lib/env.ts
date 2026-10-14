import "server-only";

export function getApiBaseUrl(): string {
  const value = process.env.API_BASE_URL?.trim();

  if (!value) {
    throw new Error("API_BASE_URL is not defined.");
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("API_BASE_URL must be a valid absolute URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("API_BASE_URL must use HTTP or HTTPS.");
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "API_BASE_URL must not contain credentials, query parameters or a fragment.",
    );
  }

  return url.toString().replace(/\/+$/, "");
}
