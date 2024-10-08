/*
TODO: Schema
MARK: - Schema
*/

// TODO: 从'drizzle-orm/pg-core'引入
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  fileKey: text('file_key').notNull(), //TODO: key用来识别 AWS 上的文件
})

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').references(() => chats.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  role: userSystemEnum('role').notNull(),
})

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
});


/*
TODO: 使用`Drizzle-kit`确定能让我们的`Schema`推送到`Neon`
MARK: - Drizzle-kit
*/