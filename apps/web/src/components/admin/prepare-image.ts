/** UX only: the API independently validates and decodes every upload. */
export async function prepareImage(file: File): Promise<File> {
  const extensions: Record<string, RegExp> = { "image/jpeg": /\.jpe?g$/i, "image/png": /\.png$/i, "image/webp": /\.webp$/i };
  if (!extensions[file.type]?.test(file.name)) throw new Error("Selecione uma imagem JPEG, PNG ou WebP com extensão correspondente.");
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter até 5 MB e não pode estar vazia.");
  // Next forwards using its existing server-only session. Keep multipart below
  // Vercel's 4.5 MB limit; larger accepted input images are prepared locally.
  if (file.size <= 4 * 1024 * 1024) return file;
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error("Não foi possível abrir a imagem. Selecione um arquivo válido ou uma versão menor."); }
  try {
    if (bitmap.width * bitmap.height > 25_000_000) throw new Error("A imagem tem resolução excessiva. Reduza suas dimensões.");
    const ratio = Math.min(1, 4096 / bitmap.width, 4096 / bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível preparar a imagem neste navegador.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.9, 0.8, 0.7]) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob?.type === "image/webp" && blob.size <= 4 * 1024 * 1024) return new File([blob], "upload.webp", { type: "image/webp" });
    }
    throw new Error("Não foi possível preparar uma versão menor. Reduza a imagem antes de enviar.");
  } finally { bitmap.close(); }
}
