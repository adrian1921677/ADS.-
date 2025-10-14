import { NextResponse } from 'next/server'
import { readOrders, addOrder } from '@/lib/prisma-orders'
import { saveOrderToFallback } from '@/lib/fallback-storage'

export const runtime = "nodejs" // Erzwinge Node Runtime für Prisma

export async function GET() {
  const rid = `get_orders_${Date.now()}`
  
  try {
    console.log(`[${rid}] GET /api/orders - Request received`)
    
    const orders = await readOrders()
    
    console.log(`[${rid}] Orders retrieved successfully:`, {
      count: orders.length,
      orderIds: orders.map(o => o.id).slice(0, 5) // Erste 5 IDs für Debugging
    })
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error(`[${rid}] Error retrieving orders:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({ 
      error: 'Fehler beim Abrufen der Aufträge',
      rid 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const rid = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    console.log(`[${rid}] POST /api/orders - Request received`)
    
    const orderData = await request.json()
    console.log(`[${rid}] Order data received:`, {
      hasPayload: !!orderData.payload,
      status: orderData.status,
      driver: orderData.driver,
      payloadKeys: orderData.payload ? Object.keys(orderData.payload) : []
    })
    
    // Validiere, ob payload vorhanden ist
    if (!orderData.payload) {
      console.error(`[${rid}] Validation failed: No payload received`)
      return NextResponse.json({ 
        error: 'Keine Auftragsdaten erhalten',
        rid 
      }, { status: 400 })
    }
    
    try {
      console.log(`[${rid}] Attempting database insert...`)
      
      // Versuche zuerst die Datenbank
      const newOrder = await addOrder(orderData.payload, {
        status: orderData.status || 'neu',
        driver: orderData.driver
      })
      
      console.log(`[${rid}] Database insert successful:`, {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status
      })
      
      return NextResponse.json({ 
        message: 'Auftrag erfolgreich erstellt', 
        order: newOrder,
        rid 
      }, { status: 201 })
    } catch (dbError) {
      console.error(`[${rid}] Database error, using fallback:`, {
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      
      // Fallback: Speichere in localStorage (nur für Entwicklung)
      const fallbackOrder = {
        id: `fallback_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: orderData.status || 'neu',
        payload: orderData.payload
      }
      
      // Speichere in Fallback-Storage
      saveOrderToFallback(fallbackOrder)
      
      console.log(`[${rid}] Fallback storage successful:`, {
        fallbackId: fallbackOrder.id
      })
      
      return NextResponse.json({ 
        message: 'Auftrag temporär gespeichert (Datenbank nicht verfügbar)', 
        order: fallbackOrder,
        warning: 'Datenbank nicht verfügbar - Auftrag wurde temporär gespeichert',
        rid 
      }, { status: 201 })
    }
  } catch (error) {
    console.error(`[${rid}] Fatal error in POST /api/orders:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Detailliertere Fehlermeldung
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    
    return NextResponse.json({ 
      error: 'Fehler beim Erstellen des Auftrags', 
      details: errorMessage,
      rid 
    }, { status: 500 })
  }
}
