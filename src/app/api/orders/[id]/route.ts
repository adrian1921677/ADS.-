import { NextRequest, NextResponse } from 'next/server'
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

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await _req.json()
    const { id } = await params
    
    const orders = await readOrders()
    const orderIndex = orders.findIndex(order => order.id === id)
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Auftrag nicht gefunden' }, { status: 404 })
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    await writeOrders(orders)
    
    return NextResponse.json({ message: 'Auftrag erfolgreich aktualisiert', order: orders[orderIndex] })
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Auftrags:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Auftrags' }, { status: 500 })
  }
}