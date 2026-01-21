import type { Actions, PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";

import { db } from "$lib/server/db/db";
import { requireLogin } from "$lib/server/auth";
import { accounts as accountTable } from "$lib/server/db/schemas";
import { zod4 } from "sveltekit-superforms/adapters";

import { CreateAccountSchema } from "$lib/server/db/types";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const form = await superValidate(zod4(CreateAccountSchema));

  const accounts = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.userId, user.id));

  event.depends("app:accounts");

  return { accounts, form };
};

export const actions = {
  addAccount: async (event) => {
    const user = requireLogin(event);

    const form = await superValidate(event.request, zod4(CreateAccountSchema));

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

    return message(form, {
      toastMessage: `${form.data.name}: New account added successfully.`,
    });
  },
} satisfies Actions;
