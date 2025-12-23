import { dev } from "$app/environment";

import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { db } from "./database/db";
import { sessionTable, userTable } from "./database/schema";
import { redirect } from "sveltekit-flash-message/server";
import { getRequestEvent } from "$app/server";
const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

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

export function requireLogin() {
  const event = getRequestEvent();
  const { locals } = event;

  if (!locals.user) {
    return redirect(
      "/auth/login",
      {
        type: "success",
        message: {
          title: "Please login first.",
          description: "",
        },
      },
      event.cookies
    );
  }

  return locals.user;
}
