import { pgTable, text, timestamp, jsonb, numeric, serial, varchar } from 'drizzle-orm/pg-core'

// Orders Tabelle
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('neu'),
  waitReason: text('wait_reason'),
  driver: text('driver'),
  internalNotes: text('internal_notes'),
  orderNumber: varchar('order_number', { length: 20 }),
  invoiceNumber: varchar('invoice_number', { length: 20 }),
  payload: jsonb('payload').notNull().default('{}'),
  attachments: jsonb('attachments').default('[]'),
})

// Invoices Tabelle
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  invoiceNumber: varchar('invoice_number', { length: 20 }).notNull(),
  customer: jsonb('customer').notNull(),
  items: jsonb('items').notNull().default('[]'),
  netAmount: numeric('net_amount', { precision: 10, scale: 2 }).notNull(),
  vatPercent: numeric('vat_percent', { precision: 5, scale: 2 }).notNull(),
  vatAmount: numeric('vat_amount', { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
})

// Invoice Numbers Sequenz Tabelle
export const invoiceNumbers = pgTable('invoice_numbers', {
  id: serial('id').primaryKey(),
  year: numeric('year', { precision: 4, scale: 0 }).notNull(),
  sequence: numeric('sequence', { precision: 5, scale: 0 }).notNull().default('0'),
})

// Order Numbers Sequenz Tabelle
export const orderNumbers = pgTable('order_numbers', {
  id: serial('id').primaryKey(),
  year: numeric('year', { precision: 4, scale: 0 }).notNull(),
  sequence: numeric('sequence', { precision: 5, scale: 0 }).notNull().default('0'),
})

// Typen für TypeScript
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
