import "dotenv/config";
import { z } from "zod";

const authEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
});

const parsed = authEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    "JWT_SECRET must be defined and contain at least 32 characters.",
  );
}

export const authConfig = {
  secret: parsed.data.JWT_SECRET,
};
