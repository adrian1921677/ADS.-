import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'invoice-numbers.json')

interface InvoiceNumbers {
  [year: string]: number
}

async function readInvoiceNumbers(): Promise<InvoiceNumbers> {
  try {
    const data = await fs.promises.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const dir = path.dirname(DATA_FILE)
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true })
      }
      await fs.promises.writeFile(DATA_FILE, JSON.stringify({}), 'utf-8')
      return {}
    }
    throw error
  }
}

async function writeInvoiceNumbers(numbers: InvoiceNumbers): Promise<void> {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(numbers, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const currentYear = new Date().getFullYear().toString()
    const invoiceNumbers = await readInvoiceNumbers()

    if (!invoiceNumbers[currentYear]) {
      invoiceNumbers[currentYear] = 0
    }

    invoiceNumbers[currentYear]++
    await writeInvoiceNumbers(invoiceNumbers)

    const nextNumber = invoiceNumbers[currentYear].toString().padStart(4, '0')
    const invoiceNumber = `ADS-${currentYear}-${nextNumber}`

    return NextResponse.json({ invoiceNumber })
  } catch (error) {
    console.error('Fehler beim Generieren der Rechnungsnummer:', error)
    return NextResponse.json({ error: 'Fehler beim Generieren der Rechnungsnummer' }, { status: 500 })
  }
}
