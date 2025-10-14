import { NextResponse } from 'next/server'

export const runtime = "nodejs" // Erzwinge Node Runtime

// Lazy import für bessere Build-Kompatibilität
let sql: any = null

async function getNeonConnection() {
  if (!sql) {
    try {
      const { neon } = await import('@neondatabase/serverless')
      const dbUrl = process.env.NEON_HTTP_URL || process.env.DATABASE_URL
      
      if (!dbUrl) {
        throw new Error('NEON_HTTP_URL not set')
      }
      
      if (!dbUrl.startsWith('postgresql://')) {
        throw new Error('NEON_HTTP_URL must start with postgresql:// (not postgres://)')
      }
      
      if (dbUrl.includes('-pooler.')) {
        throw new Error('NEON_HTTP_URL contains -pooler which is not compatible with @neondatabase/serverless')
      }
      
      sql = neon(dbUrl)
    } catch (error) {
      console.error('Failed to initialize Neon connection:', error)
      throw error
    }
  }
  return sql
}

export async function GET() {
  const rid = `get_orders_neon_${Date.now()}`
  
  try {
    console.log(`[${rid}] GET /api/orders-neon - Request received`)
    
    // Neon-Verbindung initialisieren
    const neonSql = await getNeonConnection()
    
    // Direkte Neon-Abfrage
    const orders = await neonSql`
      SELECT 
        id,
        created_at,
        updated_at,
        status,
        order_number,
        invoice_number,
        driver,
        internal_notes,
        wait_reason,
        attachments,
        payload
      FROM orders 
      ORDER BY created_at DESC
    `
    
    console.log(`[${rid}] Orders retrieved successfully:`, {
      count: orders.length,
      orderIds: orders.map((o: any) => o.id).slice(0, 5)
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
  const rid = `order_neon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    console.log(`[${rid}] POST /api/orders-neon - Request received`)
    
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
      console.log(`[${rid}] Attempting Neon database insert...`)
      
      // Neon-Verbindung initialisieren
      const neonSql = await getNeonConnection()
      
      // Generiere Order- und Invoice-Nummern
      const year = new Date().getFullYear()
      
      // Hole aktuelle Sequenz für Order-Nummern
      const orderSeqResult = await neonSql`
        SELECT sequence FROM order_numbers 
        WHERE year = ${year} 
        ORDER BY id DESC LIMIT 1
      `
      
      let orderSequence = 1
      if (orderSeqResult.length > 0) {
        orderSequence = Number(orderSeqResult[0].sequence) + 1
        await neonSql`
          UPDATE order_numbers 
          SET sequence = ${orderSequence} 
          WHERE year = ${year}
        `
      } else {
        await neonSql`
          INSERT INTO order_numbers (year, sequence) 
          VALUES (${year}, ${orderSequence})
        `
      }
      
      // Hole aktuelle Sequenz für Invoice-Nummern
      const invoiceSeqResult = await neonSql`
        SELECT sequence FROM invoice_numbers 
        WHERE year = ${year} 
        ORDER BY id DESC LIMIT 1
      `
      
      let invoiceSequence = 1
      if (invoiceSeqResult.length > 0) {
        invoiceSequence = Number(invoiceSeqResult[0].sequence) + 1
        await neonSql`
          UPDATE invoice_numbers 
          SET sequence = ${invoiceSequence} 
          WHERE year = ${year}
        `
      } else {
        await neonSql`
          INSERT INTO invoice_numbers (year, sequence) 
          VALUES (${year}, ${invoiceSequence})
        `
      }
      
      const orderNumber = `A-${year}-${String(orderSequence).padStart(5, '0')}`
      const invoiceNumber = `ADS-${year}-${String(invoiceSequence).padStart(5, '0')}`
      
      // Insert Order
      const newOrder = await neonSql`
        INSERT INTO orders (
          status, 
          order_number, 
          invoice_number, 
          driver, 
          payload
        ) VALUES (
          ${orderData.status || 'neu'},
          ${orderNumber},
          ${invoiceNumber},
          ${orderData.driver || null},
          ${JSON.stringify(orderData.payload)}
        ) RETURNING *
      `
      
      console.log(`[${rid}] Neon database insert successful:`, {
        orderId: newOrder[0].id,
        orderNumber: newOrder[0].order_number,
        status: newOrder[0].status
      })
      
      return NextResponse.json({ 
        message: 'Auftrag erfolgreich erstellt', 
        order: {
          ...newOrder[0],
          id: newOrder[0].id.toString(),
          createdAt: newOrder[0].created_at.toISOString(),
          updatedAt: newOrder[0].updated_at.toISOString(),
          payload: newOrder[0].payload
        },
        rid 
      }, { status: 201 })
    } catch (dbError) {
      console.error(`[${rid}] Neon database error:`, {
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      
      return NextResponse.json({ 
        error: 'Datenbankfehler beim Erstellen des Auftrags', 
        details: dbError instanceof Error ? dbError.message : 'Unbekannter Fehler',
        rid 
      }, { status: 500 })
    }
  } catch (error) {
    console.error(`[${rid}] Fatal error in POST /api/orders-neon:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({ 
      error: 'Fehler beim Erstellen des Auftrags', 
      details: error instanceof Error ? error.message : 'Unbekannter Fehler',
      rid 
    }, { status: 500 })
  }
}
