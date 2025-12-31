import { z } from "zod";

const TRANSACTIONTYPES = ["income", "expense", "transfer"];

export const RegisterSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(50),
  // confirm: z.string().min(8).max(50),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(50),
});

export type Transaction = {
  id?: string;
  name: string;
  type: string;
  category: string;
  account: string;
  amount: number;
  currency: string;
  notes: string;
};

export const CreateAccountSchema = z.object({
  name: z.string(),
  balance: z.number().default(0),
});

export const CreateTransactionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().default(0),
  type: z.enum(TRANSACTIONTYPES).default("expense"),
  category: z.string(),
  account: z.string(),
  currency: z.string().default("kes"),
  notes: z.string().default(""),
});

export const TransactionSchema = CreateTransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export type Transfer = {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
};

export type SelectInputOption = {
  value: string;
  label: string;
};
