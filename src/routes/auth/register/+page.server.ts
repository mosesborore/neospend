import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";

import { RegisterUserSchema } from "$lib/server/db/types";
import { checkIfEmailExists, insertNewUser } from "$lib/server/db/utils";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(
      "/app",
      {
        type: "success",
        message: {
          title: `You're already logged in.`,
          description: "",
        },
      },
      event.cookies
    );
  }
  const form = await superValidate(zod4(RegisterUserSchema));
  return { form };
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(RegisterUserSchema));
    console.log(form);

    if (!form.valid) {
      return message(form, "Please fill the form correctly.");
    }

    const existingUser = await checkIfEmailExists(form.data.email);

    if (existingUser) {
      return message(form, "User already exists.");
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(form.data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await insertNewUser({
        id: userId,
        name: form.data.name,
        email: form.data.email,
        password: passwordHash,
      });
    } catch {
      return message(
        form,
        "An error has occurred while creating your account."
      );
    }

    return redirect(
      "/auth/login",
      {
        type: "success",
        message: {
          title: `Account created successfully. Please login with your credentials.`,
          description: "",
        },
      },
      cookies
    );
  },
} satisfies Actions;
