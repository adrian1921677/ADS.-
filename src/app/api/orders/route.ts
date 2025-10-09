import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ORDERS_FILE = path.resolve(process.cwd(), 'data', 'orders.json')

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  payload: any;
}

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.promises.readFile(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const dir = path.dirname(ORDERS_FILE)
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true })
      }
      await fs.promises.writeFile(ORDERS_FILE, JSON.stringify([]), 'utf-8')
      return []
    }
    throw error
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const orders = await readOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fehler beim Abrufen der Aufträge:', error)
    return NextResponse.json({ error: 'Fehler beim Abrufen der Aufträge' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newOrder: Order = await request.json()
    const orders = await readOrders()
    
    // Generiere ID und Timestamps
    newOrder.id = Date.now().toString()
    newOrder.createdAt = new Date().toISOString()
    newOrder.updatedAt = new Date().toISOString()
    
    orders.push(newOrder)
    await writeOrders(orders)
    
    return NextResponse.json({ message: 'Auftrag erfolgreich erstellt', order: newOrder }, { status: 201 })
  } catch (error) {
    console.error('Fehler beim Erstellen des Auftrags:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Auftrags' }, { status: 500 })
  }
}
