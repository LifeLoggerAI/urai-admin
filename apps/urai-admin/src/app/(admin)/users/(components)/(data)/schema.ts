
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "editor"]),
  status: z.enum(["active", "inactive", "pending"]),
});

export type User = z.infer<typeof userSchema>;
