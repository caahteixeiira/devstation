import { test, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import sharp from "sharp";

// Isolated infrastructure doubles: no credentials, real database or bucket.
let state;
let failCommit = false;
let storageUnavailable = false;
const objects = new Map();
const fake = {
  async $queryRaw(strings, ...values) {
    if (strings.join("").includes('"StorageCleanup"')) {
      const record = [...state.tasks.values()].find((item) => item.id === values[0] || item.path === values[0]);
      return record ? [{ id: record.id }] : [];
    }
    return [{ id: 1 }];
  },
  async $transaction(callback) {
    const snapshot = structuredClone(state);
    try {
      const result = await callback(fake);
      if (failCommit) { failCommit = false; throw new Error("Simulated database commit failure"); }
      return result;
    } catch (error) { state = snapshot; throw error; }
  },
  user: { async findUnique() { return { id: 1, role: "ADMIN" }; } },
  technology: { async count({ where }) { return where.id.in.length; } },
  certification: {
    async findUnique({ where }) { return state.certs.get(where.id) ?? null; },
    async findFirst({ where }) { return [...state.certs.values()].find((item) => item.imagePath === where.imagePath) ?? null; },
    async findMany({ where }) { return [...state.certs.values()].filter((item) => where.deleting === undefined || item.deleting === where.deleting); },
    async create({ data }) { const item = { ...data, id: 1, technologies: [], imagePath: null, deleting: false, credentialId: null, credentialUrl: null, expirationDate: null }; state.certs.set(1, item); return item; },
    async update({ where, data }) { const item = { ...state.certs.get(where.id), ...data }; state.certs.set(where.id, item); return item; },
    async delete({ where }) { state.certs.delete(where.id); },
  },
  project: {
    async findUnique({ where }) { return where.slug === "test-project" ? { id: 1, slug: where.slug } : null; },
  },
  projectImage: {
    async findFirst({ where }) { return [...state.images.values()].find((item) => where.imagePath ? item.imagePath === where.imagePath : item.id === where.id && item.projectId === where.projectId) ?? null; },
    async create({ data }) { const item = { id: state.nextImage++, ...data }; state.images.set(item.id, item); return item; },
    async update({ where, data }) { const item = { ...state.images.get(where.id), ...data }; state.images.set(where.id, item); return item; },
    async delete({ where }) { state.images.delete(where.id); },
  },
  storageCleanup: {
    async count({ where }) { return [...state.tasks.values()].filter((item) => (!where.path || item.path.startsWith(where.path.startsWith)) && (!where.notBefore || item.notBefore <= where.notBefore.lte)).length; },
    async create({ data }) { const item = { id: state.nextTask++, createdAt: new Date(), attempts: 0, ...data }; state.tasks.set(item.path, item); return item; },
    async upsert({ where, create, update }) {
      const current = state.tasks.get(where.path);
      if (!current) return fake.storageCleanup.create({ data: { notBefore: new Date(), ...create } });
      Object.assign(current, update); return current;
    },
    async findMany({ where, take }) { return [...state.tasks.values()].filter((item) => item.notBefore <= where.notBefore.lte && (!where.path || item.path.startsWith(where.path.startsWith))).slice(0, take); },
    async delete({ where }) {
      const item = [...state.tasks.values()].find((task) => task.path === where.path || task.id === where.id);
      if (!item) throw new Error("Reservation missing");
      state.tasks.delete(item.path);
    },
    async updateMany({ where }) { for (const item of state.tasks.values()) if (item.id === where.id) item.attempts++; },
  },
};

mock.module(new URL("../dist/lib/prisma.js", import.meta.url), { exports: { prisma: fake } });
const { validateImage } = await import("../dist/modules/media/image.validation.js");
const { storage, assertStoragePath } = await import("../dist/lib/supabase.js");
const { uploadImage, flushStorageCleanup } = await import("../dist/modules/media/storage.service.js");
const { certificationRoutes } = await import("../dist/modules/certifications/certification.routes.js");
const { mediaRoutes } = await import("../dist/modules/media/media.routes.js");
const { AppError } = await import("../dist/errors/AppError.js");
const { MAX_IMAGE_BYTES } = await import("../dist/config/storage.js");

let app, http, image, token;
before(async () => {
  state = { certs: new Map(), images: new Map(), tasks: new Map(), nextImage: 1, nextTask: 1 };
  http = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (storageUnavailable) { response.writeHead(503).end("private upstream message"); return; }
    assert.equal(request.headers.authorization, "Bearer test-only-key");
    if (request.method === "POST") objects.set(request.url.split("/portfolio/")[1], Buffer.concat(chunks));
    if (request.method === "DELETE") for (const path of JSON.parse(Buffer.concat(chunks)).prefixes) objects.delete(path);
    response.setHeader("Content-Type", "application/json"); response.end("{}");
  });
  await new Promise((resolve) => http.listen(0, "127.0.0.1", resolve));
  process.env.NODE_ENV = "test";
  process.env.SUPABASE_URL = `http://127.0.0.1:${http.address().port}`;
  process.env.SUPABASE_STORAGE_BUCKET = "portfolio";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  image = await sharp({ create: { width: 10, height: 10, channels: 3, background: "white" } }).png().toBuffer();
  app = Fastify(); app.decorateRequest("authUser", null);
  await app.register(jwt, { secret: "local-test-only-jwt-key-with-enough-length" });
  await app.register(multipart, { preservePath: true, limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 2, parts: 3, fieldSize: 2000 } });
  await app.register(certificationRoutes); await app.register(mediaRoutes);
  app.setErrorHandler((error, _request, reply) => reply.status(error instanceof AppError ? error.statusCode : error.statusCode ?? 500).send({ message: error.message }));
  token = app.jwt.sign({ sub: "1" });
});
after(async () => { await app?.close(); await new Promise((resolve) => http?.close(resolve)); });

function multipartRequest(buffer = image, mime = "image/png", filename = "certificate.png") {
  const boundary = "devstation-media-test";
  const start = `--${boundary}\r\nContent-Disposition: form-data; name="altText"\r\n\r\nTest image\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`;
  return { headers: { authorization: `Bearer ${token}`, "content-type": `multipart/form-data; boundary=${boundary}` }, payload: Buffer.concat([Buffer.from(start), buffer, Buffer.from(`\r\n--${boundary}--\r\n`)]) };
}

test("valid PNG, JPEG and WebP are decoded and normalized", async () => {
  for (const [format, mime, extension] of [["png", "image/png", "png"], ["jpeg", "image/jpeg", "jpg"], ["webp", "image/webp", "webp"]]) {
    const input = await sharp(image).toFormat(format).toBuffer();
    const result = await validateImage(input, mime, `safe.${extension}`);
    assert.equal((await sharp(result.buffer).metadata()).format, "webp");
    assert.equal(result.width, 10);
  }
});
test("rejects MIME spoofing, corrupt images, unsafe names and >5 MB", async () => {
  await assert.rejects(validateImage(image, "text/plain", "file.png"), { statusCode: 400 });
  await assert.rejects(validateImage(image, "image/jpeg", "file.jpg"), { statusCode: 400 });
  await assert.rejects(validateImage(Buffer.from("not an image"), "image/png", "file.png"), { statusCode: 400 });
  await assert.rejects(validateImage(image, "image/png", "../file.png"), { statusCode: 400 });
  await assert.rejects(validateImage(Buffer.alloc(MAX_IMAGE_BYTES + 1), "image/png", "file.png"), { statusCode: 413 });
  assert.throws(() => assertStoragePath("projects/1/../../private.txt"));
});
test("image mutations require the existing Admin guard before parsing the body", async () => {
  for (const [method, url] of [["POST", "/certifications"], ["POST", "/certifications/1/image"], ["DELETE", "/certifications/1/image"], ["POST", "/projects/test-project/images"], ["PATCH", "/projects/test-project/images/1"], ["DELETE", "/projects/test-project/images/1"], ["POST", "/storage/cleanup"]]) {
    assert.equal((await app.inject({ method, url })).statusCode, 401);
  }
  const denied = await app.inject({ method: "POST", url: "/certifications/1/image", headers: { "content-type": "multipart/form-data; boundary=test" }, payload: Buffer.alloc(MAX_IMAGE_BYTES + 1) });
  assert.equal(denied.statusCode, 401);
});
test("empty certification collection is a successful empty API response", async () => {
  const response = await app.inject({ method: "GET", url: "/certifications" });
  assert.equal(response.statusCode, 200); assert.deepEqual(response.json(), { data: [] });
});
test("upload, replace and remove certification image, including delete failure recovery", async () => {
  state.certs.set(1, { id: 1, title: "Test only", issuer: "Test only", issueDate: new Date(), featured: false, order: 0, deleting: false, technologies: [], imagePath: null });
  let response = await app.inject({ method: "POST", url: "/certifications/1/image", ...multipartRequest() });
  assert.equal(response.statusCode, 200, response.body);
  const first = response.json().data.imagePath;
  assert.ok(objects.has(first)); assert.match(first, /^certifications\/1\/[a-f0-9-]+\.webp$/);
  response = await app.inject({ method: "POST", url: "/certifications/1/image", ...multipartRequest() });
  assert.equal(response.statusCode, 200); assert.equal(objects.has(first), false);
  const replacement = response.json().data.imagePath;
  response = await app.inject({ method: "DELETE", url: "/certifications/1/image", headers: { authorization: `Bearer ${token}` } });
  assert.equal(response.statusCode, 200); assert.ok(state.certs.has(1)); assert.equal(state.certs.get(1).imagePath, null);
  assert.equal(objects.has(replacement), false);
  response = await app.inject({ method: "POST", url: "/certifications/1/image", ...multipartRequest() });
  const deletingPath = response.json().data.imagePath;
  storageUnavailable = true;
  response = await app.inject({ method: "DELETE", url: "/certifications/1", headers: { authorization: `Bearer ${token}` } });
  assert.equal(response.statusCode, 502); assert.equal(state.certs.get(1).deleting, true);
  assert.equal(state.certs.get(1).imagePath, null); assert.ok(state.tasks.has(deletingPath));
  assert.equal((await app.inject({ method: "GET", url: "/certifications" })).json().data.length, 0);
  storageUnavailable = false;
  response = await app.inject({ method: "DELETE", url: "/certifications/1", headers: { authorization: `Bearer ${token}` } });
  assert.equal(response.statusCode, 204); assert.equal(state.certs.has(1), false); assert.equal(objects.has(deletingPath), false);
});
test("project image upload, alt/order update, replace and delete preserve the project", async () => {
  let response = await app.inject({ method: "POST", url: "/projects/test-project/images", ...multipartRequest() });
  assert.equal(response.statusCode, 201, response.body);
  const id = response.json().data.id, path = response.json().data.imagePath;
  response = await app.inject({ method: "PATCH", url: `/projects/test-project/images/${id}`, headers: { authorization: `Bearer ${token}` }, payload: { altText: "Updated description", order: 4 } });
  assert.equal(response.statusCode, 200); assert.equal(response.json().data.order, 4);
  response = await app.inject({ method: "POST", url: `/projects/test-project/images/${id}`, ...multipartRequest() });
  assert.equal(response.statusCode, 200); assert.equal(objects.has(path), false);
  response = await app.inject({ method: "DELETE", url: `/projects/test-project/images/${id}`, headers: { authorization: `Bearer ${token}` } });
  assert.equal(response.statusCode, 200); assert.equal(state.images.has(id), false);
  assert.ok(await fake.project.findUnique({ where: { slug: "test-project" } }));
});
test("multipart size limit is enforced by API", async () => {
  const response = await app.inject({ method: "POST", url: "/projects/test-project/images", ...multipartRequest(Buffer.alloc(MAX_IMAGE_BYTES + 1)) });
  assert.equal(response.statusCode, 413);
});
test("failed Storage upload never persists a reference, and keeps compensation", async () => {
  storageUnavailable = true;
  let persisted = false;
  await assert.rejects(uploadImage("projects", 1, image, async () => { persisted = true; }), { statusCode: 502 });
  assert.equal(persisted, false); assert.ok(state.tasks.size);
  storageUnavailable = false;
});
test("failed database commit leaves an orphan reserved for cleanup", async () => {
  failCommit = true;
  await assert.rejects(uploadImage("projects", 1, image, async (tx, path) => {
    await tx.projectImage.create({ data: { projectId: 1, imagePath: path, imageUrl: null } });
  }), /database commit failure/);
  assert.equal(state.images.size, 0);
  const orphan = [...state.tasks.values()].find((task) => objects.has(task.path));
  assert.ok(orphan); orphan.notBefore = new Date(0);
  const result = await flushStorageCleanup();
  assert.equal(result.failed, 0); assert.equal(objects.has(orphan.path), false);
});
