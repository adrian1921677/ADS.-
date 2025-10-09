import { promises as fs } from 'fs'
import path from 'path'

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

const dataFilePath = path.join(process.cwd(), 'data', 'invoices.json')

async function ensureDataFileExists(): Promise<void> {
  const dir = path.dirname(dataFilePath)
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
  try { await fs.access(dataFilePath) } catch { await fs.writeFile(dataFilePath, '[]', 'utf8') }
}

export async function readInvoices(): Promise<InvoiceRecord[]> {
  await ensureDataFileExists()
  const raw = await fs.readFile(dataFilePath, 'utf8')
  const list = JSON.parse(raw) as InvoiceRecord[]
  return Array.isArray(list) ? list : []
}

export async function writeInvoices(invoices: InvoiceRecord[]): Promise<void> {
  await ensureDataFileExists()
  await fs.writeFile(dataFilePath, JSON.stringify(invoices, null, 2), 'utf8')
}

function parseInvoiceSequence(no?: string): number {
  if (!no) return 0
  const m = no.match(/ADS-(\d{4})-(\d{5})/)
  if (!m) return 0
  return parseInt(m[2] || '0', 10)
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const invoices = await readInvoices()
  const seq = invoices
    .filter(i => (i.invoiceNumber || '').startsWith(`ADS-${year}-`))
    .map(i => parseInvoiceSequence(i.invoiceNumber))
    .reduce((max, n) => Math.max(max, n), 0) + 1
  return `ADS-${year}-${String(seq).padStart(5, '0')}`
}

export async function addInvoice(payload: Omit<InvoiceRecord, 'id' | 'createdAt' | 'invoiceNumber' | 'netAmount' | 'vatAmount' | 'totalAmount'> & { invoiceNumber?: string }): Promise<InvoiceRecord> {
  const invoices = await readInvoices()
  const net = payload.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
  const vatAmount = +(net * (payload.vatPercent / 100)).toFixed(2)
  const total = +(net + vatAmount).toFixed(2)
  const newInvoice: InvoiceRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    invoiceNumber: payload.invoiceNumber || await generateInvoiceNumber(),
    customer: payload.customer,
    items: payload.items,
    netAmount: +net.toFixed(2),
    vatPercent: payload.vatPercent,
    vatAmount,
    totalAmount: total,
  }
  invoices.unshift(newInvoice)
  await writeInvoices(invoices)
  return newInvoice
}


