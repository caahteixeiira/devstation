import * as argon2 from "argon2";
import { AppError } from "../../errors/AppError.js";
import { findUserByEmail } from "./auth.repository.js";
import type { LoginBody } from "./auth.schema.js";

export async function authenticateUser(data: LoginBody) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await argon2.verify(user.passwordHash, data.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
