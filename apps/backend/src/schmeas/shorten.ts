import { z } from "zod";

const shortenSchema = z.object({
  short_code: z.string(),
  long_url: z.string(),
  created_at: z.date(),
  expires_at: z.date()
});

export type Shorten = z.infer<typeof shortenSchema>;