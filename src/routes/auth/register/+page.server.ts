import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "$lib/server/auth";

import { fail } from "@sveltejs/kit";

import { RegisterUserZodSchema } from "$lib/validation/schemas";
import { checkIfEmailExists, insertNewUser } from "$lib/server/database/utils";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(RegisterUserZodSchema));
  return { form };
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(RegisterUserZodSchema));
    console.log(form);

    if (!form.valid) {
      return message(form, "Please fill the form correctly.");
    }

    const existingUser = await checkIfEmailExists(form.data.email);

    if (existingUser) {
      return message(form, "User already exists. Go to login page.");
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
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    } catch {
      return message(form, "An error has occured while loggin in.");
    }

    return redirect(
      "/",
      {
        type: "success",
        message: {
          title: `Welcome, ${form.data.name}. Account created successfully.`,
          description: "",
        },
      },
      cookies
    );
  },
} satisfies Actions;
