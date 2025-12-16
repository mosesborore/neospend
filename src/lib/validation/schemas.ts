import { z } from "zod";

export const RegisterUserZodSchema = z.object({
  id: z.string().optional(),
  email: z.email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(50),
});
