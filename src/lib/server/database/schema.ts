import { name } from "drizzle-orm";
import {
  pgTable,
  decimal,
  text,
  timestamp,
  uuid,
  pgEnum,
  varchar,
  index,
  numeric,
  serial,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 127 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
  },
  (table) => [index("email_idx").on(table.email)]
);

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const account = pgTable("account", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar("name", { length: 127 }).notNull(),
  balance: decimal("balance", { mode: "number" }).default(0).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

const transactionTypeEnum = pgEnum("transactionType", [
  "income",
  "expense",
  "transfer",
]);

export const category = pgTable("transactionType", {
  id: serial().primaryKey().notNull(),
  name: varchar("name", { length: 127 }).notNull(),
  type: transactionTypeEnum().notNull().default("expense"),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const transaction = pgTable("transaction", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  type: transactionTypeEnum()
    .notNull()
    .$default(() => "expense"),
  category: uuid()
    .references(() => category.id, { onDelete: "cascade" })
    .notNull(),
  account: uuid()
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  amount: numeric("amount", { mode: "number" }).notNull().default(0),
  notes: text("notes"),
  currency: varchar("currency", { length: 64 }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export type SessionSchema = typeof sessionTable.$inferSelect;
export type UserSchema = typeof userTable.$inferSelect;

export type AccountSchema = typeof account.$inferInsert;
export type CategorySchema = typeof category.$inferSelect;
export type TransactionSchema = typeof transaction.$inferSelect;
export type TransactionSchema2 = typeof transaction.$inferInsert;
