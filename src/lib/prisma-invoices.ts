import prisma from './prisma'

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
  const existing = await prisma.invoiceNumber.findFirst({
    where: { year }
  })

  let sequence = 1
  if (existing) {
    sequence = existing.sequence + 1
    await prisma.invoiceNumber.update({
      where: { id: existing.id },
      data: { sequence }
    })
  } else {
    await prisma.invoiceNumber.create({
      data: { year, sequence: 1 }
    })
  }

  return `ADS-${year}-${String(sequence).padStart(5, '0')}`
}

export async function readInvoices(): Promise<InvoiceRecord[]> {
  const result = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return result.map((invoice: any) => ({
    ...invoice,
    id: invoice.id.toString(),
    createdAt: invoice.createdAt.toISOString(),
    netAmount: parseFloat(invoice.netAmount.toString()),
    vatPercent: parseFloat(invoice.vatPercent.toString()),
    vatAmount: parseFloat(invoice.vatAmount.toString()),
    totalAmount: parseFloat(invoice.totalAmount.toString()),
    customer: invoice.customer as { name: string; address?: string; email?: string },
    items: invoice.items as any as InvoiceItem[],
  }))
}

export async function addInvoice(payload: Omit<InvoiceRecord, 'id' | 'createdAt' | 'invoiceNumber' | 'netAmount' | 'vatAmount' | 'totalAmount'> & { invoiceNumber?: string }): Promise<InvoiceRecord> {
  const net = payload.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
  const vatAmount = +(net * (payload.vatPercent / 100)).toFixed(2)
  const total = +(net + vatAmount).toFixed(2)
  const invoiceNumber = payload.invoiceNumber || await generateInvoiceNumber()

  const newInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customer: payload.customer as any,
      items: payload.items as any,
      netAmount: net,
      vatPercent: payload.vatPercent,
      vatAmount: vatAmount,
      totalAmount: total,
    }
  })

  return {
    ...newInvoice,
    id: newInvoice.id.toString(),
    createdAt: newInvoice.createdAt.toISOString(),
    netAmount: parseFloat(newInvoice.netAmount.toString()),
    vatPercent: parseFloat(newInvoice.vatPercent.toString()),
    vatAmount: parseFloat(newInvoice.vatAmount.toString()),
    totalAmount: parseFloat(newInvoice.totalAmount.toString()),
    customer: newInvoice.customer as { name: string; address?: string; email?: string },
    items: newInvoice.items as any as InvoiceItem[],
  }
}

export async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()

  const existing = await prisma.invoiceNumber.findFirst({
    where: { year }
  })

  let sequence = 1
  if (existing) {
    sequence = existing.sequence + 1
    await prisma.invoiceNumber.update({
      where: { id: existing.id },
      data: { sequence }
    })
  } else {
    await prisma.invoiceNumber.create({
      data: { year, sequence: 1 }
    })
  }

  return `ADS-${year}-${String(sequence).padStart(5, '0')}`
}
