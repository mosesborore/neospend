import { dev } from "$app/environment";

import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { db } from "./db/db";
import { session, users } from "./db/schema";
import { redirect } from "sveltekit-flash-message/server";
import { handleLoginRedirect } from "$lib/utils";
import type { RequestEvent } from "@sveltejs/kit";

const adapter = new DrizzlePostgreSQLAdapter(db, session, users);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
    };
  },
  sessionCookie: {
    attributes: {
      secure: !dev,
      sameSite: "lax",
    },
  },
  sessionExpiresIn: new TimeSpan(2, "w"),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
}

export function requireLogin(event: RequestEvent) {
  if (!event.locals.user) {
    const nextTo = handleLoginRedirect(event);
    return redirect(
      nextTo,
      {
        type: "success",
        message: {
          title: "You're required to be logged in to access the page.",
        },
      },
      event.cookies
    );
  }

  return event.locals.user;
}
