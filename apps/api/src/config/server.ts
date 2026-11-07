import "dotenv/config";
import { isIP } from "node:net";

export function readServerConfig(env: NodeJS.ProcessEnv = process.env) {
  const rawPort = env.PORT ?? "3333";
  const port = Number(rawPort);

  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const rawOrigin = env.CORS_ORIGIN?.trim()
    || (env.NODE_ENV === "production" ? "" : "http://localhost:3000");
  let origin: URL;

  try {
    origin = new URL(rawOrigin);
  } catch {
    throw new Error("CORS_ORIGIN must be an absolute HTTP(S) origin; it is required in production.");
  }

  if (
    !["http:", "https:"].includes(origin.protocol)
    || origin.username || origin.password || origin.pathname !== "/"
    || origin.search || origin.hash
  ) {
    throw new Error("CORS_ORIGIN must contain only an HTTP(S) origin, without credentials, path, query or fragment.");
  }

  // Only explicitly configured proxy addresses may supply a forwarded client IP.
  const proxies = env.TRUST_PROXY?.trim()
    ? env.TRUST_PROXY.split(",").map((entry) => entry.trim())
    : [];

  for (const proxy of proxies) {
    const [address, prefix, ...extra] = proxy.split("/");
    const version = isIP(address ?? "");
    if (
      !version || extra.length > 0
      || (prefix !== undefined && (
        !/^\d+$/.test(prefix) || Number(prefix) < 1
        || Number(prefix) > (version === 4 ? 32 : 128)
      ))
    ) {
      throw new Error("TRUST_PROXY must be a comma-separated list of trusted IP addresses or CIDRs.");
    }
  }

  return { port, corsOrigin: origin.origin, trustProxy: proxies.length ? proxies : false as const };
}
