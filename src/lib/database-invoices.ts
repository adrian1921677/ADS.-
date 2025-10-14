import { db } from './database'
import { invoices, invoiceNumbers, type NewInvoice } from './schema'
import { eq, desc } from 'drizzle-orm'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceRecord {
  id: string
  createdAt: string
  invoiceNumber: string
  customer: { name: string; address?: string; email?: string }
  items: InvoiceItem[]
  netAmount: number
  vatPercent: number
  vatAmount: number
  totalAmount: number
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

export async function readInvoices(): Promise<InvoiceRecord[]> {
  const result = await db
    .select()
    .from(invoices)
    .orderBy(desc(invoices.createdAt))
  
  return result.map(invoice => ({
    id: invoice.id,
    createdAt: invoice.createdAt.toISOString(),
    invoiceNumber: invoice.invoiceNumber,
    customer: invoice.customer as { name: string; address?: string; email?: string },
    items: invoice.items as InvoiceItem[],
    netAmount: Number(invoice.netAmount),
    vatPercent: Number(invoice.vatPercent),
    vatAmount: Number(invoice.vatAmount),
    totalAmount: Number(invoice.totalAmount),
  }))
}

export async function addInvoice(
  payload: Omit<InvoiceRecord, 'id' | 'createdAt' | 'invoiceNumber' | 'netAmount' | 'vatAmount' | 'totalAmount'> & { 
    invoiceNumber?: string 
  }
): Promise<InvoiceRecord> {
  const net = payload.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
  const vatAmount = +(net * (payload.vatPercent / 100)).toFixed(2)
  const total = +(net + vatAmount).toFixed(2)
  
  const newInvoice: NewInvoice = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    invoiceNumber: payload.invoiceNumber || await generateInvoiceNumber(),
    customer: payload.customer,
    items: payload.items,
    netAmount: net.toFixed(2),
    vatPercent: payload.vatPercent.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    totalAmount: total.toFixed(2),
  }
  
  const [insertedInvoice] = await db.insert(invoices).values(newInvoice).returning()
  
  return {
    id: insertedInvoice.id,
    createdAt: insertedInvoice.createdAt.toISOString(),
    invoiceNumber: insertedInvoice.invoiceNumber,
    customer: insertedInvoice.customer as { name: string; address?: string; email?: string },
    items: insertedInvoice.items as InvoiceItem[],
    netAmount: Number(insertedInvoice.netAmount),
    vatPercent: Number(insertedInvoice.vatPercent),
    vatAmount: Number(insertedInvoice.vatAmount),
    totalAmount: Number(insertedInvoice.totalAmount),
  }
}

export async function getNextInvoiceNumber(): Promise<string> {
  return await generateInvoiceNumber()
}
