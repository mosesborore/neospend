import type { Actions, PageServerLoad } from "./$types";

import { verify } from "@node-rs/argon2";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { eq } from "drizzle-orm";
import { userTable } from "$lib/server/database/schema";
import { redirect } from "sveltekit-flash-message/server";

import { db } from "$lib/server/database/db";
import { lucia } from "$lib/server/auth";
import { LoginSchema } from "$lib/schemas/index";

export const load: PageServerLoad = async (event) => {
  const loginForm = await superValidate(zod4(LoginSchema));
  return { loginForm };
};

export const actions = {
  default: async (event) => {
    const loginForm = await superValidate(event.request, zod4(LoginSchema));

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

    const validPassword = await verify(
      existingUser.password,
      loginForm.data.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return message(loginForm, "Incorrect email or password.");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    const userName =
      existingUser.name.charAt(0).toUpperCase() + existingUser.name.slice(1);

    const redirectTo = event.url.searchParams.get("next");

    if (redirectTo) {
      // prepend a / to force it to be within out domain
      redirect(302, `/${redirectTo.slice(1)}`);
    }

    return redirect(
      "/",
      {
        type: "success",
        message: {
          title: `Welcome back, ${userName}.`,
          description: "",
        },
      },
      event.cookies
    );
  },
} satisfies Actions;
