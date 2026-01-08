export type { TransactionType } from "$lib/server/db/types";

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
