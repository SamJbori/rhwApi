// api/env.js
import z from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

const envConfig = config();
expand(envConfig);

const envSchema = z.object({
  // DB_HOST: z.string(),
  // DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  // DB_USER: z.string(),
  // DB_PASSWORD: z.string(),
  // DB_NAME: z.string(),
  PORT: z.string().regex(/^\d+$/).transform(Number).optional().default(3006),
  DB_STRING: z.string(),
  AUTH_TOKEN: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success) {
  console.log(".env loaded successfully");
} else {
  console.error(
    "Invalid .env, missing something?:",
    _env.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = _env.data;
