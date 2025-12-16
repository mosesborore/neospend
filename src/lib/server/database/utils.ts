import { eq } from "drizzle-orm";

import type { UserSchema } from "./schema";
import { db } from "./db";
import { userTable } from "./schema";

export const checkIfEmailExists = async (email: string) => {
  const queryResult = await db
    .select({
      email: userTable.email,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  return queryResult.length > 0;
};

export const insertNewUser = async (user: UserSchema) => {
  return await db.insert(userTable).values(user);
};

export const getAllUsers = async () => {
  return await db.select({
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
  });
};
