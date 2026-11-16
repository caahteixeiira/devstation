import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionToken } from "@/lib/auth/session";
import { getApiBaseUrl } from "@/lib/env";

export const runtime = "nodejs";

function apiPath(segments: string[], method: string) {
  const path = segments.join("/");
  if (path === "cleanup" && method === "POST") return "/storage/cleanup";
  if (/^certifications\/[1-9]\d*\/image$/.test(path) && ["POST", "DELETE"].includes(method)) return `/${path}`;
  if (/^projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/images$/.test(path) && method === "POST") return `/${path}`;
  if (/^projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/images\/[1-9]\d*$/.test(path) && ["POST", "PATCH", "DELETE"].includes(method)) return `/${path}`;
  return null;
}

async function forward(request: NextRequest, context: { params: Promise<{ segments: string[] }> }) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ message: "Origem da solicitação inválida." }, { status: 403 });
  }
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  const { segments } = await context.params;
  const path = apiPath(segments, request.method);
  if (!path) return NextResponse.json({ message: "Operação inválida." }, { status: 404 });

  const limit = 4 * 1024 * 1024 + 32 * 1024;
  if (Number(request.headers.get("content-length")) > limit) {
    return NextResponse.json({ message: "Prepare uma imagem menor antes de enviar." }, { status: 413 });
  }
  const headers = new Headers({ Authorization: `Bearer ${token}`, Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  let exceeded = false;
  let received = 0;
  const body = request.body?.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      received += chunk.byteLength;
      if (received > limit) { exceeded = true; throw new Error("Upload too large."); }
      controller.enqueue(chunk);
    },
  }));
  try {
    const init: RequestInit & { duplex?: "half" } = {
      method: request.method, headers, body, duplex: "half",
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(50_000),
    };
    const response = await fetch(`${getApiBaseUrl()}${path}`, init);
    const result = await response.json();
    if (response.ok) {
      for (const route of ["/", "/sobre", "/certificacoes", "/projetos", "/admin/certificacoes", "/admin/projetos"]) revalidatePath(route);
      if (segments[0] === "projects") revalidatePath(`/projetos/${segments[1]}`);
    }
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json({ message: exceeded ? "A imagem excede o limite de envio." : "Não foi possível confirmar a operação. Atualize as imagens antes de tentar novamente." }, { status: exceeded ? 413 : 502 });
  }
}

export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
