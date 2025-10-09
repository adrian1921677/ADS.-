import { promises as fs } from 'fs'
import path from 'path'

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

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json')

async function ensureDataFileExists(): Promise<void> {
  const dir = path.dirname(dataFilePath)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
  try {
    await fs.access(dataFilePath)
  } catch {
    await fs.writeFile(dataFilePath, '[]', 'utf8')
  }
}

function parseOrderSequence(orderNumber?: string): number {
  if (!orderNumber) return 0
  const m = orderNumber.match(/A-(\d{4})-(\d{5})/)
  if (!m) return 0
  return parseInt(m[2] || '0', 10)
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const orders = await readOrders()
  const seq = orders
    .filter(o => (o.orderNumber || '').startsWith(`A-${year}-`))
    .map(o => parseOrderSequence(o.orderNumber))
    .reduce((max, n) => Math.max(max, n), 0) + 1
  return `A-${year}-${String(seq).padStart(5, '0')}`
}

export async function readOrders(): Promise<OrderRecord[]> {
  await ensureDataFileExists()
  const raw = await fs.readFile(dataFilePath, 'utf8')
  const list = JSON.parse(raw) as OrderRecord[]
  return Array.isArray(list) ? list : []
}

export async function writeOrders(orders: OrderRecord[]): Promise<void> {
  await ensureDataFileExists()
  await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), 'utf8')
}

export async function addOrder(
  payload: Record<string, unknown>,
  opts?: { status?: OrderStatus; driver?: string }
): Promise<OrderRecord> {
  const orders = await readOrders()
  const orderNumber = await generateOrderNumber()
  const invoiceNumber = await generateInvoiceNumber()
  const newOrder: OrderRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: opts?.status ?? 'neu',
    driver: opts?.driver,
    orderNumber,
    invoiceNumber,
    payload,
  }
  orders.unshift(newOrder)
  await writeOrders(orders)
  return newOrder
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const orders = await readOrders()
  const seq = orders
    .filter(o => (o.invoiceNumber || '').startsWith(`ADS-${year}-`))
    .map(o => {
      const m = (o.invoiceNumber || '').match(/ADS-(\d{4})-(\d{5})/)
      return m ? parseInt(m[2] || '0', 10) : 0
    })
    .reduce((max, n) => Math.max(max, n), 0) + 1
  return `ADS-${year}-${String(seq).padStart(5, '0')}`
}

export async function updateOrder(id: string, update: Partial<Pick<OrderRecord, 'status' | 'waitReason'>>): Promise<OrderRecord | null> {
  const orders = await readOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], ...update }
  await writeOrders(orders)
  return orders[idx]
}

export async function addAttachmentToOrder(id: string, fileUrl: string, filename: string): Promise<OrderRecord | null> {
  const orders = await readOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  const list = orders[idx].attachments ?? []
  list.push({ filename, url: fileUrl, uploadedAt: new Date().toISOString() })
  orders[idx].attachments = list
  await writeOrders(orders)
  return orders[idx]
}


