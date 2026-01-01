import { eq } from "drizzle-orm";

import { db } from "./db";
import { users as userTable } from "./schema";

type UserInsertSchema = typeof userTable.$inferInsert;

export const checkIfEmailExists = async (email: string) => {
  const queryResult = await db
    .select({
      email: userTable.email,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  return queryResult.length > 0;
};

export const insertNewUser = async (user: UserInsertSchema) => {
  return await db.insert(userTable).values(user);
};

export const getAllUsers = async () => {
  return db.select({
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
  });
};
