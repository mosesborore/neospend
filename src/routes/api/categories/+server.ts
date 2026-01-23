import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { requireLogin } from "$lib/server/auth";
import { db } from "$lib/server/db/db";
import {
  categories as categoriesTable,
  accounts as accountTable,
  transactions as transactionsTable,
} from "$lib/server/db/schemas";
import { eq, and, sql } from "drizzle-orm";

/**
 * Returns the SQL expression that will be used to deduct or add amount to the account
 *
 * - For 'income': deduct (balance - amount)
 * - For 'expense': add (balance + amount)
 * - For 'transfer': no change (transfers handle balances separately)
 * @param type
 * @param amount
 * @returns
 */
function getSQLExpression(type: string, amount: number) {
  if (type === "income") {
    return sql`${accountTable.balance} - ${amount}`;
  } else if (type === "expense") {
    return sql`${accountTable.balance} + ${amount}`;
  } else {
    // For 'transfer' or unknown, no balance change
    return sql`${accountTable.balance}`;
  }
}

export const DELETE: RequestHandler = async (event) => {
  const user = requireLogin(event);

  let data: { id: number };
  try {
    data = await event.request.json();
  } catch (e) {
    return json(
      { success: false, message: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  if (
    !data ||
    typeof data.id !== "number" ||
    data.id <= 0 ||
    !Number.isInteger(data.id)
  ) {
    return json(
      {
        success: false,
        message: "Invalid category ID: must be a positive integer",
      },
      { status: 400 },
    );
  }

  try {
    const succeeded = await db.transaction(async (tx) => {
      try {
        const [category] = await tx
          .select()
          .from(categoriesTable)
          .where(
            and(
              eq(categoriesTable.id, data.id),
              eq(categoriesTable.userId, user.id),
            ),
          );

        if (!category) {
          // category not found
          return false;
        }

        const transactions = await tx
          .select({
            accountTotal: sql<number>`sum(${transactionsTable.amount})`,
            accountId: transactionsTable.accountId,
          })
          .from(transactionsTable)
          .where(
            and(
              eq(transactionsTable.categoryId, category.id),
              eq(transactionsTable.userId, user.id),
            ),
          )
          .groupBy(transactionsTable.accountId);

        // Adjust account balances for associated transactions
        for (const trans of transactions) {
          await tx
            .update(accountTable)
            .set({
              balance: getSQLExpression(category.type, trans.accountTotal),
            })
            .where(
              and(
                eq(accountTable.id, trans.accountId),
                eq(accountTable.userId, user.id),
              ),
            );
        }

        // delete the category
        await tx
          .delete(categoriesTable)
          .where(
            and(
              eq(categoriesTable.id, data.id),
              eq(categoriesTable.userId, user.id),
            ),
          );

        return true;
      } catch (innerError) {
        console.error(
          "Error during category deletion transaction:",
          innerError,
        );
        throw innerError; // Re-throw to trigger transaction rollback
      }
    });

    if (succeeded) {
      return json({ success: true, message: "Category deleted successfully" });
    } else {
      return json({
        success: false,
        message: "Unable to delete. Category not found or access denied",
      });
    }
  } catch (e) {
    console.error("Unable to delete category:", e);
    return json(
      {
        success: false,
        message: "An error occurred while deleting the category",
      },
      { status: 500 },
    );
  }
};
