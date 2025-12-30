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

export type SelectInputOption = {
  value: string;
  label: string;
};
