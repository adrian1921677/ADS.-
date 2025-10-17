import { NextResponse } from 'next/server'
import { readOrders, addOrder } from '@/lib/prisma-orders'
import { saveOrderToFallback } from '@/lib/fallback-storage'
import { Resend } from 'resend'

export const runtime = 'nodejs' // Prisma braucht Node
// Optional, falls Cache Ärger macht: export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendOrderEmail(params: {
  subject: string
  to?: string
  order: any
  isFallback?: boolean
}) {
  const to = params.to ?? process.env.CONTACT_TO ?? 'info@abdullahu-drive.de'
  const from = process.env.CONTACT_FROM ?? 'Kontaktformular <noreply@updates.abdullahu-drive.de>'

  // Key vorhanden?
  if (!process.env.RESEND_API_KEY) {
    console.error('[email] RESEND_API_KEY fehlt – Mail wird übersprungen')
    return
  }

  // Sicherheitscheck für verifizierte Domain
  if (!/@updates\.abdullahu-drive\.de>?$/.test(from)) {
    console.error('[email] FROM muss @updates.abdullahu-drive.de sein:', from)
    return
  }

  const payload = params.order?.payload ?? params.order
  const isFallback = params.isFallback ?? false

  // HTML Template für schöne E-Mails
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
      <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${isFallback ? '⚠️ FALLBACK - ' : ''}Neue Überführungs-Anfrage</h1>
        ${isFallback ? '<p style="margin: 10px 0 0 0; opacity: 0.9;">Datenbank nicht verfügbar - Auftrag temporär gespeichert</p>' : ''}
      </div>
      
      <div style="background: white; padding: 30px;">
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📋 Auftragsdetails</h2>
          <p style="margin: 5px 0; color: #475569;"><strong>Status:</strong> ${params.order?.status ?? 'unbekannt'}</p>
          ${params.order?.orderNumber ? `<p style="margin: 5px 0; color: #475569;"><strong>Auftragsnummer:</strong> ${params.order.orderNumber}</p>` : ''}
          <p style="margin: 5px 0; color: #475569;"><strong>Erstellt:</strong> ${new Date().toLocaleString('de-DE')}</p>
        </div>

        ${payload.name || payload.email ? `
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">👤 Kundeninformationen</h2>
          ${payload.name ? `<p style="margin: 5px 0; color: #475569;"><strong>Name:</strong> ${payload.name}</p>` : ''}
          ${payload.email ? `<p style="margin: 5px 0; color: #475569;"><strong>E-Mail:</strong> ${payload.email}</p>` : ''}
          ${payload.phone ? `<p style="margin: 5px 0; color: #475569;"><strong>Telefon:</strong> ${payload.phone}</p>` : ''}
        </div>
        ` : ''}

        ${payload.pickupLocation || payload.destination ? `
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">🚗 Transportdaten</h2>
          ${payload.pickupLocation ? `<p style="margin: 5px 0; color: #475569;"><strong>Abholort:</strong> ${payload.pickupLocation}</p>` : ''}
          ${payload.destination ? `<p style="margin: 5px 0; color: #475569;"><strong>Zielort:</strong> ${payload.destination}</p>` : ''}
          ${payload.vehicleType ? `<p style="margin: 5px 0; color: #475569;"><strong>Fahrzeugtyp:</strong> ${payload.vehicleType}</p>` : ''}
          ${payload.readyToDrive ? `<p style="margin: 5px 0; color: #475569;"><strong>Fahrbereit:</strong> ${payload.readyToDrive}</p>` : ''}
          ${payload.preferredDate ? `<p style="margin: 5px 0; color: #475569;"><strong>Wunschtermin:</strong> ${payload.preferredDate}</p>` : ''}
        </div>
        ` : ''}

        ${payload.message ? `
        <div style="background: #fefce8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">💬 Nachricht / Hinweise</h2>
          <p style="margin: 0; color: #475569; white-space: pre-wrap;">${payload.message}</p>
        </div>
        ` : ''}

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Diese Anfrage wurde über das Kontaktformular auf 
            <a href="https://abdullahu-drive-solutions.de" style="color: #2563eb; text-decoration: none;">abdullahu-drive-solutions.de</a> 
            gesendet.
          </p>
        </div>
      </div>
    </div>
  `

  // Fallback Text-Version
  const text = [
    params.isFallback ? '[FALLBACK – DB nicht verfügbar]' : 'Neuer Auftrag',
    '',
    `Status: ${params.order?.status ?? 'unbekannt'}`,
    params.order?.orderNumber ? `Auftragsnummer: ${params.order.orderNumber}` : '',
    '',
    'Payload:',
    JSON.stringify(payload, null, 2),
  ].join('\n')

  const result = await resend.emails.send({
    from,
    to,
    subject: params.subject,
    html,
    text,
    replyTo: payload.email || undefined,
  })

  if ((result as any)?.error) {
    console.error('[email] Resend-Fehler:', (result as any).error)
  } else {
    console.log('[email] E-Mail erfolgreich gesendet:', { to, subject: params.subject })
  }
}

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

      // ---- Mail nach erfolgreichem Insert
      await sendOrderEmail({
        subject: `Neue Überführungs-Anfrage ${newOrder.orderNumber ?? ''}`.trim(),
        order: newOrder,
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
      
      // Fallback-Objekt
      const fallbackOrder = {
        id: `fallback_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: orderData.status || 'neu',
        payload: orderData.payload
      }
      
      // Fallback speichern (Achtung: serverseitig, niemals localStorage)
      saveOrderToFallback(fallbackOrder)
      
      console.log(`[${rid}] Fallback storage successful:`, {
        fallbackId: fallbackOrder.id
      })

      // ---- Mail auch im Fallback schicken (mit Kennzeichnung)
      await sendOrderEmail({
        subject: `Neue Überführungs-Anfrage (FALLBACK)`,
        order: fallbackOrder,
        isFallback: true,
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
