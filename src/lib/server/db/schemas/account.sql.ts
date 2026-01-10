import {
  pgTable,
  varchar,
  decimal,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./auth.sql";
import { relations } from "drizzle-orm";
import { transactions } from "./transaction.sql";

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 127 }).notNull(),
    balance: decimal("balance", { mode: "number" }).default(0).notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  owner: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));
