import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { AppError } from "../../errors/AppError.js";
import { findUserById } from "./auth.repository.js";

const tokenPayloadSchema = z.object({
  sub: z.string().regex(/^[1-9]\d*$/),
});

export async function requireAuth(request: FastifyRequest) {
  let decoded: unknown;

  try {
    decoded = await request.jwtVerify();
  } catch {
    throw new AppError("Unauthorized.", 401);
  }

  const parsed = tokenPayloadSchema.safeParse(decoded);

  if (!parsed.success) {
    throw new AppError("Unauthorized.", 401);
  }

  const userId = Number(parsed.data.sub);

  if (!Number.isSafeInteger(userId)) {
    throw new AppError("Unauthorized.", 401);
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Unauthorized.", 401);
  }

  request.authUser = user;
}

export async function requireAdmin(request: FastifyRequest) {
  await requireAuth(request);

  if (request.authUser?.role !== "ADMIN") {
    throw new AppError("Forbidden.", 403);
  }
}
