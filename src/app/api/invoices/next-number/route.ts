import { NextResponse } from 'next/server'
import { getNextInvoiceNumber } from '@/lib/prisma-invoices'

export async function GET() {
  try {
    const invoiceNumber = await getNextInvoiceNumber()
    return NextResponse.json({ invoiceNumber })
  } catch (error) {
    console.error('Fehler beim Generieren der Rechnungsnummer:', error)
    return NextResponse.json({ error: 'Fehler beim Generieren der Rechnungsnummer' }, { status: 500 })
  }
}
