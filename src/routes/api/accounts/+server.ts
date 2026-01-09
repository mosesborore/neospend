import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { requireLogin } from "$lib/server/auth";
import { db } from "$lib/server/db/db";
import { accounts } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

export const DELETE: RequestHandler = async (event) => {
  const user = requireLogin(event);

  const data: { id: string } = await event.request.json();

  try {
    const deletedAccountId = await db
      .delete(accounts)
      .where(and(eq(accounts.userId, user.id), eq(accounts.id, data.id)))
      .returning({ deletedId: accounts.id });

    console.log(deletedAccountId);

    if (deletedAccountId.length > 0) {
      return json({ message: "Account deleted" });
    } else {
      return json({ error: "Unable to delete. Account Not found" });
    }
  } catch (e) {
    console.log("Unable to delete account. ", e);
  }

  return error(400, "Unable to delete the account");
  // return json({ error: "Unable to delete the account" });
};
