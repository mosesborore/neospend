import { relations } from "drizzle-orm";
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
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 127 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
  },
  (table) => [index("email_idx").on(table.email)]
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
  (t) => [index("session_user_id_idx").on(t.userId)]
);

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
  (t) => [index("account_user_id_idx").on(t.userId)]
);

export const transactionTypeEnum = pgEnum("transactionType", [
  "income",
  "expense",
  "transfer",
]);

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 127 }).notNull(),
    type: transactionTypeEnum().notNull().default("expense"),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("category_user_id_idx").on(t.userId)]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: transactionTypeEnum()
      .notNull()
      .$default(() => "expense"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),

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
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  categories: many(categories),
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  owner: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  owner: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

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
