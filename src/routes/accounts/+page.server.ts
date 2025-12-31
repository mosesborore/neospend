import type { Actions, PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";

import { db } from "$lib/server/database/db";
import { requireLogin } from "$lib/server/auth";
import { CreateAccountSchema } from "$lib/types";
import { account as accountTable } from "$lib/server/database/schema";
import { setFlash } from "sveltekit-flash-message/server";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const form = await superValidate(zod4(CreateAccountSchema));

  const accounts = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.userId, user.id));

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

    setFlash(
      {
        type: "success",
        message: {
          title: `${form.data.name}: New account added successfully.`,
        },
      },
      event
    );

    return message(form, "New Account added.");
  },
} satisfies Actions;
