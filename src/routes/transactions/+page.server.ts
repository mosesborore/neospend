import { message, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";

import { CreateTransactionSchema, type SelectInputOption } from "$lib/types";
import { account as accountTable } from "$lib/server/database/schema";
import { db } from "$lib/server/database/db";
import { requireLogin } from "$lib/server/auth";
import { eq } from "drizzle-orm";

import { fail } from "@sveltejs/kit";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const accounts = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.userId, user.id));

  const getAccountOptions = () => {
    let c: SelectInputOption[] = [];

    accounts.forEach((a) => {
      c.push({ value: a.id, label: a.name });
    });

    return c;
  };

  const addTransactionForm = await superValidate(
    event.request,
    zod4(CreateTransactionSchema)
  );

  return { addTransactionForm, accounts, accountOptions: getAccountOptions() };
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
