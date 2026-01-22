import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
  numeric,
  integer,
  check,
} from "drizzle-orm/pg-core";
import { users } from "./auth.sql";
import { categories } from "./category.sql";
import { accounts } from "./account.sql";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 })
      .notNull()
      .$default(() => "expense"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    amount: numeric("amount", { mode: "number" }).notNull().default(0),
    notes: text("notes"),
    currency: varchar("currency", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("transaction_user_id_idx").on(t.userId),
    index("transaction_category_id_idx").on(t.categoryId),
    index("transaction_type_id_idx").on(t.accountId),
    check("type_check", sql`${t.type} IN ('expense', 'income', 'transfer')`),
  ],
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  owner: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  accounts: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
}));
