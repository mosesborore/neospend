import type { PageServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import {
  transactions as transactionTable,
  accounts as accountsTable,
} from "$lib/server/db/schemas";
import { db } from "$lib/server/db/db";
import { requireLogin } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const transactions = await db.query.transactions.findMany({
    where: eq(transactionTable.userId, user.id),
    limit: 10,
    orderBy: (transactionTable, { desc }) => [desc(transactionTable.createdAt)],
  });

  const accounts = await db.query.accounts.findMany({
    where: eq(accountsTable.userId, user.id),
  });

  return { transactions, accounts };
};
