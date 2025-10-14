import { NextResponse } from 'next/server'
import { readOrders, addOrder } from '@/lib/prisma-orders'
import { saveOrderToFallback } from '@/lib/fallback-storage'

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
    
    // Validiere, ob payload vorhanden ist
    if (!orderData.payload) {
      return NextResponse.json({ error: 'Keine Auftragsdaten erhalten' }, { status: 400 })
    }
    
    try {
      // Versuche zuerst die Datenbank
      const newOrder = await addOrder(orderData.payload, {
        status: orderData.status || 'neu',
        driver: orderData.driver
      })
      
      return NextResponse.json({ message: 'Auftrag erfolgreich erstellt', order: newOrder }, { status: 201 })
    } catch (dbError) {
      console.error('Datenbankfehler, verwende Fallback:', dbError)
      
      // Fallback: Speichere in localStorage (nur für Entwicklung)
      const fallbackOrder = {
        id: `fallback_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: orderData.status || 'neu',
        payload: orderData.payload
      }
      
      // Speichere in Fallback-Storage
      saveOrderToFallback(fallbackOrder)
      
      return NextResponse.json({ 
        message: 'Auftrag temporär gespeichert (Datenbank nicht verfügbar)', 
        order: fallbackOrder,
        warning: 'Datenbank nicht verfügbar - Auftrag wurde temporär gespeichert'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Auftrags:', error)
    
    // Detailliertere Fehlermeldung
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    
    return NextResponse.json({ 
      error: 'Fehler beim Erstellen des Auftrags', 
      details: errorMessage 
    }, { status: 500 })
  }
}
