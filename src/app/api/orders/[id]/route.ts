import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '@/lib/prisma-orders'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await _req.json()
    const { id } = await params
    
    const updatedOrder = await updateOrder(id, body)
    
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Auftrag nicht gefunden' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Auftrag erfolgreich aktualisiert', order: updatedOrder })
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Auftrags:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Auftrags' }, { status: 500 })
  }
}