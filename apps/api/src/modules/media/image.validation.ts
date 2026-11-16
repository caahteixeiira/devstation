import sharp from "sharp";
import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { MAX_IMAGE_BYTES } from "../../config/storage.js";
import { AppError } from "../../errors/AppError.js";

const formats: Record<string, { format: string; extension: RegExp }> = {
  "image/jpeg": { format: "jpeg", extension: /\.jpe?g$/i },
  "image/png": { format: "png", extension: /\.png$/i },
  "image/webp": { format: "webp", extension: /\.webp$/i },
};

export async function validateImage(buffer: Buffer, mimetype: string, filename: string) {
  if (!buffer.length) throw new AppError("The image is empty.", 400);
  if (buffer.length > MAX_IMAGE_BYTES) throw new AppError("The image exceeds 5 MB.", 413);
  const expected = formats[mimetype];
  if (!expected || !expected.extension.test(filename) || filename.startsWith(".") ||
      filename.includes("..") || /[\/\\\x00-\x1f\x7f<>:"|?*]/.test(filename) || filename.length > 200) {
    throw new AppError("Use a JPEG, PNG or WebP image with a safe filename and matching extension.", 400);
  }
  try {
    const image = sharp(buffer, { limitInputPixels: 25_000_000, failOn: "warning", animated: true });
    const metadata = await image.metadata();
    if (metadata.format !== expected.format || (metadata.pages ?? 1) !== 1) throw new Error("Invalid format");
    const output = await image.rotate().resize({ width: 4096, height: 4096, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
    if (output.data.length > MAX_IMAGE_BYTES) throw new AppError("The processed image exceeds 5 MB.", 413);
    return { buffer: output.data, contentType: "image/webp", sizeBytes: output.data.length, width: output.info.width, height: output.info.height };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Invalid, corrupt, animated or excessively large image.", 400);
  }
}

export async function readImageUpload(request: FastifyRequest) {
  if (!request.isMultipart()) throw new AppError("Send the image as multipart/form-data.", 415);
  let file: { buffer: Buffer; mimetype: string; filename: string } | undefined;
  const fields: Record<string, string> = {};
  for await (const part of request.parts()) {
    if (part.type === "file") {
      if (part.fieldname !== "file" || file) throw new AppError("Send exactly one file named file.", 400);
      file = { buffer: await part.toBuffer(), mimetype: part.mimetype, filename: part.filename };
      if (part.file.truncated) throw new AppError("The image exceeds 5 MB.", 413);
    } else {
      if (!["altText", "order"].includes(part.fieldname) || typeof part.value !== "string" || part.fieldname in fields) {
        throw new AppError("Invalid upload metadata.", 400);
      }
      fields[part.fieldname] = part.value;
    }
  }
  if (!file) throw new AppError("Select an image.", 400);
  const parsed = z.object({
    altText: z.string().trim().min(2).max(500),
    order: z.coerce.number().int().min(0).max(10000).default(0),
  }).safeParse(fields);
  if (!parsed.success) throw new AppError("Provide alt text (2–500 characters) and a valid image order.", 400);
  return { ...await validateImage(file.buffer, file.mimetype, file.filename), ...parsed.data };
}
