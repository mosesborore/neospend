import { message, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";

import { type SelectInputOption } from "$lib/types";

import {
  accounts as accountTable,
  transactions,
  users,
} from "$lib/server/db/schemas";
import { db } from "$lib/server/db/db";
import { requireLogin } from "$lib/server/auth";
import { and, eq, sql } from "drizzle-orm";

import { fail } from "@sveltejs/kit";
import { zod4 } from "sveltekit-superforms/adapters";
import { setFlash } from "sveltekit-flash-message/server";

type Options = { id: string | number; name: string; type?: string };

const getSelectOptions = (options: Options[]) => {
  let option: SelectInputOption[] = [];

  options.forEach((o) => {
    option.push({ value: o.id.toString(), label: o.name });
  });

  return option;
};

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const all = await db.query.users.findFirst({
    columns: {
      password: false,
    },
    where: eq(users.id, user.id),
    with: {
      transactions: true,

      accounts: {
        columns: {
          userId: false,
        },
      },
    },
  });

  console.log(all);

  const accounts = await db
    .select({
      id: accountTable.id,
      name: accountTable.name,
    })
    .from(accountTable)
    .where(eq(accountTable.userId, user.id));

  const categories = await db.query.categories.findMany({
    where: (categories, { eq }) => eq(categories.userId, user.id),
  });

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const incomeOptions = getSelectOptions(incomeCategories);
  const expenseOptions = getSelectOptions(expenseCategories);

  const addTransactionForm = await superValidate(
    event.request,
    zod4(
      CreateTransactionSchema.extend({
        userId: CreateTransactionSchema.shape.userId.default(user.id),
        currency: CreateTransactionSchema.shape.currency.default("kes"),
      })
    )
  );

  return {
    addTransactionForm,
    accounts,
    accountOptions: getSelectOptions(accounts),
    expenseOptions,
    incomeOptions,
  };
};

export const actions: Actions = {
  addTransaction: async (event) => {
    const user = requireLogin(event);
    // console.log(await event.request.formData());
    const form = await superValidate(
      event.request,
      zod4(CreateTransactionSchema),
    );

    console.log(form);

    if (!form.valid) {
      return fail(400, { form });
    }

    const expression =
      form.data.type === "income"
        ? {
            balance: sql`${accountTable.balance} + ${form.data.amount}`,
          }
        : {
            balance: sql`${accountTable.balance} - ${form.data.amount}`,
          };

    try {
      await db.transaction(async (tx) => {
        await tx.insert(transactions).values({
          name: form.data.name,
          userId: user.id,
          type: form.data.type,
          categoryId: Number(form.data.categoryId),
          accountId: form.data.accountId,
          amount: form.data.amount,
          notes: form.data.notes,
          currency: form.data.currency,
        });

        await tx
          .update(accountTable)
          .set(expression)
          .where(
            and(
              eq(accountTable.userId, user.id),
              eq(accountTable.id, form.data.accountId)
            )
          );
      });

      setFlash(
        {
          type: "success",
          message: {
            title: "New transaction added successfully.",
          },
        },
        event
      );
      return message(form, "Form posted successfully!");
    } catch (e) {
      console.log("Unable to add new transaction: ", e);
    }
  },
};
