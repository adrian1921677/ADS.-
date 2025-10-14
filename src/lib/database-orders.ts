import { db } from './database'
import { orders, orderNumbers, type Order, type NewOrder } from './schema'
import { eq, desc } from 'drizzle-orm'

export type OrderStatus =
  | 'neu'
  | 'angenommen'
  | 'abgelehnt'
  | 'wartend'
  | 'geplant'
  | 'unterwegs'
  | 'erledigt'
  | 'problem'

export interface OrderRecord {
  id: string
  createdAt: string
  status: OrderStatus
  waitReason?: string
  driver?: string
  internalNotes?: string
  attachments?: { filename: string; url: string; uploadedAt: string }[]
  orderNumber?: string
  invoiceNumber?: string
  payload: Record<string, unknown>
}

// Sequenznummer für Bestellnummern generieren
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  
  // Aktuelle Sequenz für das Jahr abrufen oder erstellen
  const existing = await db
    .select()
    .from(orderNumbers)
    .where(eq(orderNumbers.year, year))
    .limit(1)
  
  let sequence = 1
  if (existing.length > 0) {
    sequence = Number(existing[0].sequence) + 1
    await db
      .update(orderNumbers)
      .set({ sequence })
      .where(eq(orderNumbers.year, year))
  } else {
    await db.insert(orderNumbers).values({ year, sequence })
  }
  
  return `A-${year}-${String(sequence).padStart(5, '0')}`
}

// Sequenznummer für Rechnungsnummern generieren
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  
  // Aktuelle Sequenz für das Jahr abrufen oder erstellen
  const existing = await db
    .select()
    .from(invoiceNumbers)
    .where(eq(invoiceNumbers.year, year))
    .limit(1)
  
  let sequence = 1
  if (existing.length > 0) {
    sequence = Number(existing[0].sequence) + 1
    await db
      .update(invoiceNumbers)
      .set({ sequence })
      .where(eq(invoiceNumbers.year, year))
  } else {
    await db.insert(invoiceNumbers).values({ year, sequence })
  }
  
  return `ADS-${year}-${String(sequence).padStart(5, '0')}`
}

export async function readOrders(): Promise<OrderRecord[]> {
  const result = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
  
  return result.map(order => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    status: order.status as OrderStatus,
    waitReason: order.waitReason || undefined,
    driver: order.driver || undefined,
    internalNotes: order.internalNotes || undefined,
    attachments: order.attachments as { filename: string; url: string; uploadedAt: string }[] || [],
    orderNumber: order.orderNumber || undefined,
    invoiceNumber: order.invoiceNumber || undefined,
    payload: order.payload as Record<string, unknown>,
  }))
}

export async function addOrder(
  payload: Record<string, unknown>,
  opts?: { status?: OrderStatus; driver?: string }
): Promise<OrderRecord> {
  const orderNumber = await generateOrderNumber()
  const invoiceNumber = await generateInvoiceNumber()
  
  const newOrder: NewOrder = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: opts?.status ?? 'neu',
    driver: opts?.driver,
    orderNumber,
    invoiceNumber,
    payload,
  }
  
  const [insertedOrder] = await db.insert(orders).values(newOrder).returning()
  
  return {
    id: insertedOrder.id,
    createdAt: insertedOrder.createdAt.toISOString(),
    status: insertedOrder.status as OrderStatus,
    waitReason: insertedOrder.waitReason || undefined,
    driver: insertedOrder.driver || undefined,
    internalNotes: insertedOrder.internalNotes || undefined,
    attachments: insertedOrder.attachments as { filename: string; url: string; uploadedAt: string }[] || [],
    orderNumber: insertedOrder.orderNumber || undefined,
    invoiceNumber: insertedOrder.invoiceNumber || undefined,
    payload: insertedOrder.payload as Record<string, unknown>,
  }
}

export async function updateOrder(
  id: string, 
  update: Partial<Pick<OrderRecord, 'status' | 'waitReason'>>
): Promise<OrderRecord | null> {
  const [updatedOrder] = await db
    .update(orders)
    .set(update)
    .where(eq(orders.id, id))
    .returning()
  
  if (!updatedOrder) return null
  
  return {
    id: updatedOrder.id,
    createdAt: updatedOrder.createdAt.toISOString(),
    status: updatedOrder.status as OrderStatus,
    waitReason: updatedOrder.waitReason || undefined,
    driver: updatedOrder.driver || undefined,
    internalNotes: updatedOrder.internalNotes || undefined,
    attachments: updatedOrder.attachments as { filename: string; url: string; uploadedAt: string }[] || [],
    orderNumber: updatedOrder.orderNumber || undefined,
    invoiceNumber: updatedOrder.invoiceNumber || undefined,
    payload: updatedOrder.payload as Record<string, unknown>,
  }
}

export async function addAttachmentToOrder(
  id: string, 
  fileUrl: string, 
  filename: string
): Promise<OrderRecord | null> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1)
  
  if (!order) return null
  
  const attachments = (order.attachments as { filename: string; url: string; uploadedAt: string }[]) || []
  attachments.push({ 
    filename, 
    url: fileUrl, 
    uploadedAt: new Date().toISOString() 
  })
  
  const [updatedOrder] = await db
    .update(orders)
    .set({ attachments })
    .where(eq(orders.id, id))
    .returning()
  
  return {
    id: updatedOrder.id,
    createdAt: updatedOrder.createdAt.toISOString(),
    status: updatedOrder.status as OrderStatus,
    waitReason: updatedOrder.waitReason || undefined,
    driver: updatedOrder.driver || undefined,
    internalNotes: updatedOrder.internalNotes || undefined,
    attachments: updatedOrder.attachments as { filename: string; url: string; uploadedAt: string }[] || [],
    orderNumber: updatedOrder.orderNumber || undefined,
    invoiceNumber: updatedOrder.invoiceNumber || undefined,
    payload: updatedOrder.payload as Record<string, unknown>,
  }
}
