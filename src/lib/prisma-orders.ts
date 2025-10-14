import { prisma } from './prisma'

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
  updatedAt: string
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
  const existing = await prisma.orderNumber.findFirst({
    where: { year }
  })

  let sequence = 1
  if (existing) {
    sequence = existing.sequence + 1
    await prisma.orderNumber.update({
      where: { id: existing.id },
      data: { sequence }
    })
  } else {
    await prisma.orderNumber.create({
      data: { year, sequence: 1 }
    })
  }

  return `A-${year}-${String(sequence).padStart(5, '0')}`
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

export async function readOrders(): Promise<OrderRecord[]> {
  const result = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return result.map((order: any) => ({
    ...order,
    id: order.id.toString(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    status: order.status as OrderStatus,
    payload: order.payload as Record<string, unknown>,
    attachments: order.attachments ? (order.attachments as { filename: string; url: string; uploadedAt: string }[]) : [],
    waitReason: order.waitReason || undefined,
    driver: order.driver || undefined,
    internalNotes: order.internalNotes || undefined,
    orderNumber: order.orderNumber || undefined,
    invoiceNumber: order.invoiceNumber || undefined,
  }))
}

export async function addOrder(
  payload: Record<string, unknown>,
  opts?: { status?: OrderStatus; driver?: string }
): Promise<OrderRecord> {
  try {
    const orderNumber = await generateOrderNumber()
    const invoiceNumber = await generateInvoiceNumber()

    const newOrder = await prisma.order.create({
      data: {
        status: opts?.status ?? 'neu',
        driver: opts?.driver,
        orderNumber,
        invoiceNumber,
        payload: payload as any,
      }
    })

    return {
      ...newOrder,
      id: newOrder.id.toString(),
      createdAt: newOrder.createdAt.toISOString(),
      updatedAt: newOrder.updatedAt.toISOString(),
      status: newOrder.status as OrderStatus,
      payload: newOrder.payload as Record<string, unknown>,
      attachments: newOrder.attachments ? (newOrder.attachments as { filename: string; url: string; uploadedAt: string }[]) : [],
      waitReason: newOrder.waitReason || undefined,
      driver: newOrder.driver || undefined,
      internalNotes: newOrder.internalNotes || undefined,
      orderNumber: newOrder.orderNumber || undefined,
      invoiceNumber: newOrder.invoiceNumber || undefined,
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Auftrags:', error)
    throw new Error(`Datenbankfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`)
  }
}

export async function updateOrder(id: string, update: Partial<Pick<OrderRecord, 'status' | 'waitReason' | 'driver' | 'internalNotes'>>): Promise<OrderRecord | null> {
  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      ...update,
      updatedAt: new Date(),
    }
  })

  if (!updatedOrder) return null

  return {
    ...updatedOrder,
    id: updatedOrder.id.toString(),
    createdAt: updatedOrder.createdAt.toISOString(),
    updatedAt: updatedOrder.updatedAt.toISOString(),
    status: updatedOrder.status as OrderStatus,
    payload: updatedOrder.payload as Record<string, unknown>,
    attachments: updatedOrder.attachments ? (updatedOrder.attachments as { filename: string; url: string; uploadedAt: string }[]) : [],
    waitReason: updatedOrder.waitReason || undefined,
    driver: updatedOrder.driver || undefined,
    internalNotes: updatedOrder.internalNotes || undefined,
    orderNumber: updatedOrder.orderNumber || undefined,
    invoiceNumber: updatedOrder.invoiceNumber || undefined,
  }
}

export async function addAttachmentToOrder(id: string, fileUrl: string, filename: string): Promise<OrderRecord | null> {
  const existingOrder = await prisma.order.findUnique({
    where: { id: parseInt(id) }
  })

  if (!existingOrder) return null

  const currentAttachments = (existingOrder.attachments || []) as { filename: string; url: string; uploadedAt: string }[]
  const updatedAttachments = [...currentAttachments, { filename, url: fileUrl, uploadedAt: new Date().toISOString() }]

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      attachments: updatedAttachments,
      updatedAt: new Date(),
    }
  })

  return {
    ...updatedOrder,
    id: updatedOrder.id.toString(),
    createdAt: updatedOrder.createdAt.toISOString(),
    updatedAt: updatedOrder.updatedAt.toISOString(),
    status: updatedOrder.status as OrderStatus,
    payload: updatedOrder.payload as Record<string, unknown>,
    attachments: updatedOrder.attachments ? (updatedOrder.attachments as { filename: string; url: string; uploadedAt: string }[]) : [],
    waitReason: updatedOrder.waitReason || undefined,
    driver: updatedOrder.driver || undefined,
    internalNotes: updatedOrder.internalNotes || undefined,
    orderNumber: updatedOrder.orderNumber || undefined,
    invoiceNumber: updatedOrder.invoiceNumber || undefined,
  }
}
