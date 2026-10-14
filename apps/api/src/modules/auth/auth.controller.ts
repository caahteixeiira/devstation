import type { FastifyReply, FastifyRequest } from "fastify";
import { loginBodySchema, type LoginBody } from "./auth.schema.js";
import { authenticateUser } from "./auth.service.js";
import { AppError } from "../../errors/AppError.js";

export async function loginController(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const parsed = loginBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Invalid login data.",
      errors: parsed.error.flatten(),
    });
  }

  const user = await authenticateUser(parsed.data);

  const token = await reply.jwtSign({
    sub: String(user.id),
  });

  return reply
    .header("Cache-Control", "no-store")
    .status(200)
    .send({
      data: {
        token,
        tokenType: "Bearer",
        expiresIn: 3600,
        user,
      },
    });
}

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.authUser) {
    throw new AppError("Unauthorized.", 401);
  }

  return reply.header("Cache-Control", "no-store").status(200).send({
    data: request.authUser,
  });
}
