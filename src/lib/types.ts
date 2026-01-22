import z from "zod/v4";

export type { TransactionType, UpdateAccountType } from "$lib/server/db/types";

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
