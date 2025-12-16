import type { Actions, PageServerLoad } from "./$types";

import { verify } from "@node-rs/argon2";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/database/db";
import { userTable } from "$lib/server/database/schema";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().max(50),
});

export const load: PageServerLoad = async () => {
  const loginForm = await superValidate(zod4(LoginSchema));
  return { loginForm };
};

export const actions = {
  login: async ({ request, cookies }) => {
    const loginForm = await superValidate(request, zod4(LoginSchema));

    if (!loginForm.valid) {
      return message(loginForm, "Invalid. Please fill the form correctly.");
    }

    const results = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, loginForm.data.email));
    const existingUser = results.at(0);

    if (!existingUser) {
      return message(loginForm, "Incorrect email or password.");
    }

    const validPassword = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return message(form, "Incorrect email or password.");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    return redirect(
      "/",
      {
        type: "success",
        message: {
          title: `Welcome back, ${existingUser.name}..`,
          description: "",
        },
      },
      cookies
    );
  },
} satisfies Actions;
