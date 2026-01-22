import type { Actions, PageServerLoad } from "./$types";
import { and, eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";

import { db } from "$lib/server/db/db";
import { requireLogin } from "$lib/server/auth";
import { zod4 } from "sveltekit-superforms/adapters";
import { categories as categoryTable } from "$lib/server/db/schemas";

import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "$lib/server/db/types";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const categories = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.userId, user.id));

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const form = await superValidate(zod4(CreateCategorySchema));
  const editForm = await superValidate(zod4(UpdateCategorySchema));

  return { form, expenseCategories, incomeCategories, editForm };
};

export const actions = {
  addCategory: async (event) => {
    const user = requireLogin(event);

    const form = await superValidate(event.request, zod4(CreateCategorySchema));

    if (!form.valid) {
      return message(form, "Please fill the form properly.");
    }

    const formData = form.data;

    const data = {
      name: formData.name.trim(),
      type: formData.type,
      userId: user.id,
    };

    try {
      await db.insert(categoryTable).values(data);
    } catch (e) {
      console.log(e);
      return message(form, { toastMessage: "Unable to add category." });
    }

    return message(form, {
      toastMessage: `{form.data.name}: New Category added.`,
    });
  },
  updateCategory: async (event) => {
    const user = requireLogin(event);

    const form = await superValidate(event.request, zod4(UpdateCategorySchema));

    if (!form.valid) {
      return message(form, { toastMessage: "Please fill the form properly." });
    }

    try {
      if (form.data.name) {
        await db
          .update(categoryTable)
          .set({ name: form.data.name.trim() })
          .where(
            and(
              eq(categoryTable.id, form.data.id),
              eq(categoryTable.userId, user.id),
            ),
          );
      }
    } catch (e) {
      console.error(`Unable to update category for user: ${user.id}. `, e);
      return message(form, { toastMessage: "Unable to update category." });
    }

    return message(form, {
      toastMessage: `${form.data.name}: Category Updated.`,
    });
  },
} satisfies Actions;
