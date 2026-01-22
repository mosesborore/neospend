import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { users, accounts, transactions, categories } from "./schemas";

import { z } from "zod/v4";

const TRANSACTIONTYPES = ["income", "expense", "transfer"] as const;

export const RegisterUserSchema = createInsertSchema(users, {
  id: z.string().optional(),
  email: z.email(),
  password: z.string().min(8, {
    message: "Password should have minimum length of 8 characters",
  }),
})
  .extend({
    confirm: z
      .string()
      .min(8, { message: "Please enter password again to confirm" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(50),
});

// how to exclude a field from type, in this case password
export type UserType = {
  id: string;
  email: string;
  name: string;
};

// account types

export const CreateAccountSchema = z.object({
  name: z.string().min(1),
  balance: z.number().default(0),
});

export const UpdateAccountSchema = CreateAccountSchema.extend({
  id: z.string(),
});

export type UpdateAccountType = z.infer<typeof UpdateAccountSchema>;

export const selectAccountSchema = createSelectSchema(accounts);
export type AccountType = z.infer<typeof selectAccountSchema>;

// category types

export const CreateCategorySchema = createInsertSchema(categories);
export const SelectCategorySchema = createSelectSchema(categories);
export const UpdateCategorySchema = createUpdateSchema(categories).extend({
  id: z.coerce.number(),
});

export type NewCategory = z.infer<typeof CreateCategorySchema>;
export type CategoryType = z.infer<typeof SelectCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

// transaction types

export const CreateTransactionSchema = createInsertSchema(transactions, {
  amount: z.number().min(0).default(0),
  categoryId: z.string(),
  type: z.enum(TRANSACTIONTYPES).default("expense"),
});
export const selectTransactionSchema = createSelectSchema(transactions);

export type NewTransaction = z.infer<typeof CreateTransactionSchema>;
export type TransactionType = z.infer<typeof selectTransactionSchema>;
