import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { orders, invoices, orderNumbers, invoiceNumbers } from '../src/lib/schema'
import { eq } from 'drizzle-orm'
import { promises as fs } from 'fs'
import path from 'path'

// Datenbankverbindung
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function migrateData() {
  console.log('🚀 Starte Migration zu Neon-Datenbank...')

  try {
    // Tabellen erstellen
    console.log('📋 Erstelle Tabellen...')
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'neu',
        wait_reason TEXT,
        driver TEXT,
        internal_notes TEXT,
        order_number VARCHAR(20),
        invoice_number VARCHAR(20),
        payload JSONB NOT NULL DEFAULT '{}',
        attachments JSONB DEFAULT '[]'
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        invoice_number VARCHAR(20) NOT NULL,
        customer JSONB NOT NULL,
        items JSONB NOT NULL DEFAULT '[]',
        net_amount NUMERIC(10,2) NOT NULL,
        vat_percent NUMERIC(5,2) NOT NULL,
        vat_amount NUMERIC(10,2) NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS order_numbers (
        id SERIAL PRIMARY KEY,
        year NUMERIC(4,0) NOT NULL,
        sequence NUMERIC(5,0) NOT NULL DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS invoice_numbers (
        id SERIAL PRIMARY KEY,
        year NUMERIC(4,0) NOT NULL,
        sequence NUMERIC(5,0) NOT NULL DEFAULT 0
      );
    `

    console.log('✅ Tabellen erstellt')

    // Bestehende Orders migrieren
    console.log('📦 Migriere Orders...')
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    try {
      const ordersData = await fs.readFile(ordersPath, 'utf8')
      const ordersList = JSON.parse(ordersData)
      
      if (Array.isArray(ordersList) && ordersList.length > 0) {
        for (const order of ordersList) {
          await db.insert(orders).values({
            id: order.id,
            createdAt: new Date(order.createdAt),
            status: order.status || 'neu',
            waitReason: order.waitReason,
            driver: order.driver,
            internalNotes: order.internalNotes,
            orderNumber: order.orderNumber,
            invoiceNumber: order.invoiceNumber,
            payload: order.payload || {},
            attachments: order.attachments || [],
          })
        }
        console.log(`✅ ${ordersList.length} Orders migriert`)
      }
    } catch (error) {
      console.log('⚠️ Keine Orders-Datei gefunden oder leer')
    }

    // Bestehende Invoices migrieren
    console.log('🧾 Migriere Invoices...')
    const invoicesPath = path.join(process.cwd(), 'data', 'invoices.json')
    try {
      const invoicesData = await fs.readFile(invoicesPath, 'utf8')
      const invoicesList = JSON.parse(invoicesData)
      
      if (Array.isArray(invoicesList) && invoicesList.length > 0) {
        for (const invoice of invoicesList) {
          await db.insert(invoices).values({
            id: invoice.id,
            createdAt: new Date(invoice.createdAt),
            invoiceNumber: invoice.invoiceNumber,
            customer: invoice.customer,
            items: invoice.items || [],
            netAmount: invoice.netAmount.toString(),
            vatPercent: invoice.vatPercent.toString(),
            vatAmount: invoice.vatAmount.toString(),
            totalAmount: invoice.totalAmount.toString(),
          })
        }
        console.log(`✅ ${invoicesList.length} Invoices migriert`)
      }
    } catch (error) {
      console.log('⚠️ Keine Invoices-Datei gefunden oder leer')
    }

    // Sequenznummern für das aktuelle Jahr initialisieren
    console.log('🔢 Initialisiere Sequenznummern...')
    const currentYear = new Date().getFullYear().toString()
    
    // Prüfen ob bereits Sequenznummern für das Jahr existieren
    const existingOrderSeq = await db
      .select()
      .from(orderNumbers)
      .where(eq(orderNumbers.year, currentYear))
      .limit(1)
    
    if (existingOrderSeq.length === 0) {
      await db.insert(orderNumbers).values({ year: currentYear, sequence: "0" })
    }

    const existingInvoiceSeq = await db
      .select()
      .from(invoiceNumbers)
      .where(eq(invoiceNumbers.year, currentYear))
      .limit(1)
    
    if (existingInvoiceSeq.length === 0) {
      await db.insert(invoiceNumbers).values({ year: currentYear, sequence: "0" })
    }

    console.log('✅ Sequenznummern initialisiert')
    console.log('🎉 Migration erfolgreich abgeschlossen!')

  } catch (error) {
    console.error('❌ Fehler bei der Migration:', error)
    process.exit(1)
  }
}

// Migration ausführen
migrateData()
