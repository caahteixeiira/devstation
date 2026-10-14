import "fastify";
import type { findUserById } from "../modules/auth/auth.repository.js";

type AuthUser = NonNullable<Awaited<ReturnType<typeof findUserById>>>;

declare module "fastify" {
  interface FastifyRequest {
    authUser: AuthUser | null;
  }
}
