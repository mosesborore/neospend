import { z } from "zod";
import { zod4 as zod4SuperformAdapter } from "sveltekit-superforms/adapters";

import { createInsertSchema } from "drizzle-zod";
import {
  account as accountTable,
  transaction as transactionTable,
} from "$lib/server/database/schema";

export const RegisterUserZodSchema = z.object({
  id: z.string().optional(),
  email: z.email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(50),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(50),
});

export const transactionInsertZodSchema = zod4SuperformAdapter(
  createInsertSchema(transactionTable, {
    amount: z.number().default(0),
    type: z.enum(["income", "expense", "transfer"]).default("expense"),
  })
);
export const accountInsertZodSchema = zod4SuperformAdapter(
  createInsertSchema(accountTable, {
    balance: z.number().default(0),
  })
);
