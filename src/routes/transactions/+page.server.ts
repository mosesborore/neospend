import { message, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";

import {
  accountInsertZodSchema,
  transactionInsertZodSchema,
} from "$lib/schemas/index";
import { account as accountTable } from "$lib/server/database/schema";
import { db } from "$lib/server/database/db";
import { requireLogin } from "$lib/server/auth";
import { eq } from "drizzle-orm";

import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const accounts = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.userId, user.id));

  const addTransactionForm = await superValidate(transactionInsertZodSchema);

  const accountForm = await superValidate(accountInsertZodSchema);
  return { addTransactionForm, accountForm, accounts };
};

export const actions: Actions = {
  addTransaction: async (event) => {
    console.log(await event.request.formData());

    const form = await superValidate(event.request, transactionInsertZodSchema);

    if (!form.valid) {
      return message(form, "Please fill the form properly.");
    }

    return { message: "Data received" };
  },
  addAccount: async (event) => {
    const user = requireLogin(event);

    const form = await superValidate(event.request, accountInsertZodSchema);

    if (!form.valid) {
      return message(form, "Please fill the form properly.");
    }
    const data = {
      name: form.data.name,
      balance: form.data.balance,
      userId: user.id,
    };

    try {
      await db.insert(accountTable).values(data);
    } catch {
      return message(form, "Unable to add account.");
    }

    setFlash(
      {
        type: "success",
        message: {
          title: `${form.data.name}: New account added successfully.`,
        },
      },
      event
    );
    return message(form, "Data received");
  },
};
