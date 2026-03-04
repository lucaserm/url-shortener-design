import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).catch("development"),
  // CORS origin for the frontend application
  WEB_URL: z.url(),
  PORT: z.coerce.number().catch(3000),
  SHORT_SECRET: z
    .string()
    .min(1, "SHORT_SECRET is required")
    .refine(
      /// Ensure the secret is exactly 32 characters long for security
      (val) => val.trim().length === 32,
      "SHORT_SECRET must be 32 characters long",
    ),
  CASSANDRA_HOST: z.string().default("127.0.0.1"),
  RUN_MIGRATIONS: z
    .string()
    .refine((val) => ["true", "false"].includes(val.toLowerCase()), {
      message: "RUN_MIGRATIONS must be 'true' or 'false'",
    })
    .transform((val) => val.toLowerCase() === "true")
    .default(true),
});

export const env = envSchema.parse(process.env);
