import { NextResponse } from 'next/server'
import { readOrders, addOrder } from '@/lib/prisma-orders'

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
    const orderData = await request.json()
    const newOrder = await addOrder(orderData.payload, {
      status: orderData.status,
      driver: orderData.driver
    })
    
    return NextResponse.json({ message: 'Auftrag erfolgreich erstellt', order: newOrder }, { status: 201 })
  } catch (error) {
    console.error('Fehler beim Erstellen des Auftrags:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Auftrags' }, { status: 500 })
  }
}
