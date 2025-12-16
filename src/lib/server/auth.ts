import { dev } from "$app/environment";

import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { db } from "./database/db";
import { sessionTable, userTable } from "./database/schema";

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
      sameSite: "strict",
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

// you are an expert in database management. I want you to take me through the following concepts: database modelling, migrations. data ingestion, and how to do them an efficient, effective and performant and cost effective. Be concise and straight to the point
