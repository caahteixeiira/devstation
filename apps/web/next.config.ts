import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.SUPABASE_STORAGE_PUBLIC_URL ? [storagePattern(process.env.SUPABASE_STORAGE_PUBLIC_URL)] : [],
  },
};

function storagePattern(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      !/^\/storage\/v1\/object\/public\/[a-z][a-z0-9_-]*\/$/.test(url.pathname)) {
    throw new Error("SUPABASE_STORAGE_PUBLIC_URL must be an HTTPS public bucket URL ending with a slash.");
  }
  return { protocol: "https" as const, hostname: url.hostname, port: "", pathname: `${url.pathname}**`, search: "" };
}

export default nextConfig;
