import {
  pgTable,
  varchar,
  integer,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { users } from "./auth.sql";
import { relations, sql } from "drizzle-orm";
import { transactions } from "./transaction.sql";

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 127 }).notNull(),
    type: varchar("type", { length: 64 })
      .notNull()
      .$default(() => "expense"),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("category_user_id_idx").on(t.userId),
    check("type_check", sql`${t.type} IN ('expense', 'income', 'transfer')`),
  ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  owner: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));
