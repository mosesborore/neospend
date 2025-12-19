import {
  pgTable,
  decimal,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 127 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

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
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export type SessionSchema = typeof sessionTable.$inferSelect;

export type UserSchema = typeof userTable.$inferSelect;
export type AccountSchema = typeof account.$inferSelect;
