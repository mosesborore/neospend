import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { transactions } from "./transaction.sql";
import { categories } from "./category.sql";
import { accounts } from "./account.sql";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 127 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
  },
  (table) => [index("email_idx").on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  categories: many(categories),
  accounts: many(accounts),
}));
