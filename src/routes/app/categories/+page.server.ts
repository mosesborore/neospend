import type { Actions, PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";

import { db } from "$lib/server/db/db";
import { requireLogin } from "$lib/server/auth";
import { CreateCategorySchema } from "$lib/types";
import { setFlash } from "sveltekit-flash-message/server";
import { zod4 } from "sveltekit-superforms/adapters";
import { categories as categoryTable } from "$lib/server/db/schema";
import type { type } from "os";

export const load: PageServerLoad = async (event) => {
  const user = requireLogin(event);

  const categories = await db
    .select({
      id: categoryTable.id,
      name: categoryTable.name,
      type: categoryTable.type,
    })
    .from(categoryTable)
    .where(eq(categoryTable.userId, user.id));

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const form = await superValidate(zod4(CreateCategorySchema));
  return { form, expenseCategories, incomeCategories };
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
      name: formData.name,
      type: formData.type,
      userId: user.id,
    };

    try {
      await db.insert(categoryTable).values(data);
    } catch (e) {
      console.log(e);
      return message(form, "Unable to add category.");
    }

    setFlash(
      {
        type: "success",
        message: {
          title: `${form.data.name}: New category added successfully.`,
        },
      },
      event
    );

    return message(form, "New Category added.");
  },
} satisfies Actions;
