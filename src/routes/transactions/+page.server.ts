import { message, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";

import { CreateTransactionSchema, type SelectInputOption } from "$lib/types";
import { accounts as accountTable } from "$lib/server/database/schema";
import { db } from "$lib/server/database/db";
import { requireLogin } from "$lib/server/auth";
import { eq } from "drizzle-orm";

import { fail } from "@sveltejs/kit";
import { zod4 } from "sveltekit-superforms/adapters";

type Options = { id: string | number; name: string; type?: string };

const getSelectOptions = (options: Options[]) => {
  let option: SelectInputOption[] = [];

  options.forEach((o) => {
    option.push({ value: o.id, label: o.name });
  });

  return option;
};

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

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
    zod4(CreateTransactionSchema)
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
    const form = await superValidate(
      event.request,
      zod4(CreateTransactionSchema)
    );

    if (!form.valid) {
      return fail(400, { form });
    }

    return message(form, "Form posted successfully!");
  },
};
