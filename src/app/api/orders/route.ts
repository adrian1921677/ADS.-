import { NextResponse } from 'next/server'

// Persistente Speicherung mit JSONBin.io
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || 'your-api-key-here'
const JSONBIN_BIN_ID = 'abdullahu-drive-orders'

// Fallback: In-Memory-Speicherung (nur für lokale Entwicklung)
let fallbackOrders: Order[] = []

// Funktion zum Laden von Aufträgen aus JSONBin
async function loadOrdersFromJSONBin(): Promise<Order[]> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.log('JSONBin nicht verfügbar, verwende Fallback')
      return fallbackOrders
    }
    
    const data = await response.json()
    console.log(`JSONBin: ${data.record?.length || 0} Aufträge geladen`)
    return data.record || []
  } catch (error) {
    console.log('JSONBin-Fehler, verwende Fallback:', error)
    return fallbackOrders
  }
}

// Funktion zum Speichern von Aufträgen in JSONBin
async function saveOrdersToJSONBin(orders: Order[]): Promise<boolean> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orders)
    })
    
    if (!response.ok) {
      console.log('JSONBin-Speicher-Fehler, verwende Fallback')
      return false
    }
    
    console.log('Aufträge erfolgreich in JSONBin gespeichert')
    return true
  } catch (error) {
    console.log('JSONBin-Speicher-Fehler, verwende Fallback:', error)
    return false
  }
}

interface OrderData {
  salutation: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  callWindow?: string;
  vehicleType: string;
  vehiclePlate: string;
  vehicleMakeModel: string;
  vehicleNotes?: string;
  pickupStreet: string;
  pickupHouseNumber: string;
  pickupPostalCode: string;
  pickupCity: string;
  pickupDate: string;
  pickupTime: string;
  deliveryStreet: string;
  deliveryHouseNumber: string;
  deliveryPostalCode: string;
  deliveryCity: string;
  deliveryDate?: string;
  deliveryTime?: string;
  message?: string;
  gdprConsent: boolean;
  newsletterConsent?: boolean;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  payload: any;
}

const ORDERS_KEY = 'orders'

export async function GET() {
  try {
    console.log('GET /api/orders - Starte Abruf der Aufträge')
    
    // Lade Aufträge aus JSONBin (persistent)
    const orders = await loadOrdersFromJSONBin()
    
    console.log(`Geladene Aufträge: ${orders.length}`)
    console.log('Alle Aufträge:', JSON.stringify(orders, null, 2))
    
    // Nur Demo-Auftrag hinzufügen, wenn wirklich keine Aufträge vorhanden sind
    if (orders.length === 0) {
      console.log('Keine Aufträge vorhanden, füge Demo-Auftrag hinzu')
      const demoOrder: Order = {
        id: 'demo-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 Tag alt
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'angenommen',
        payload: {
          customer: {
            name: 'Herr Max Mustermann',
            email: 'max.mustermann@example.com',
            phone: '+49 123 456 789',
            contactMethod: 'email'
          },
          vehicle: {
            type: 'PKW',
            plate: 'B-AB 1234',
            make: 'BMW',
            model: '3er Touring',
            notes: 'Tiefergelegt'
          },
          pickup: {
            street: 'Musterstraße',
            houseNumber: '123',
            postalCode: '10115',
            city: 'Berlin',
            date: '2024-01-15',
            time: '10:00'
          },
          delivery: {
            street: 'Beispielallee',
            houseNumber: '456',
            postalCode: '80331',
            city: 'München',
            date: '2024-01-16',
            time: '14:00'
          },
          source: 'Demo'
        }
      }
      
      // Speichere Demo-Auftrag persistent
      const saved = await saveOrdersToJSONBin([demoOrder])
      if (!saved) {
        fallbackOrders = [demoOrder]
        console.log('Demo-Auftrag in Fallback gespeichert')
      }
      return NextResponse.json([demoOrder])
    }
    
    console.log(`Rückgabe von ${orders.length} Aufträgen`)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fehler beim Abrufen der Aufträge:', error)
    return NextResponse.json({ error: 'Fehler beim Abrufen der Aufträge' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/orders - Neue Auftragsanfrage erhalten')
    const orderData: OrderData = await request.json()
    console.log('Auftragsdaten:', JSON.stringify(orderData, null, 2))
    
    // Auftrag für Dispositionstool erstellen
    const orderId = Date.now().toString()
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'neu', // Neuer Auftrag
      payload: {
        customer: {
          name: `${orderData.salutation === 'herr' ? 'Herr' : 'Frau'} ${orderData.name}`,
          email: orderData.email,
          phone: orderData.phone,
          contactMethod: orderData.contactMethod,
          callWindow: orderData.callWindow
        },
        vehicle: {
          type: orderData.vehicleType,
          plate: orderData.vehiclePlate,
          make: orderData.vehicleMakeModel.split(' ')[0] || '',
          model: orderData.vehicleMakeModel.split(' ').slice(1).join(' ') || '',
          notes: orderData.vehicleNotes
        },
        pickup: {
          street: orderData.pickupStreet,
          houseNumber: orderData.pickupHouseNumber,
          postalCode: orderData.pickupPostalCode,
          city: orderData.pickupCity,
          date: orderData.pickupDate,
          time: orderData.pickupTime
        },
        delivery: {
          street: orderData.deliveryStreet,
          houseNumber: orderData.deliveryHouseNumber,
          postalCode: orderData.deliveryPostalCode,
          city: orderData.deliveryCity,
          date: orderData.deliveryDate,
          time: orderData.deliveryTime
        },
        message: orderData.message,
        gdprConsent: orderData.gdprConsent,
        newsletterConsent: orderData.newsletterConsent,
        source: 'Kontaktformular'
      }
    }
    
    console.log('Erstellter Auftrag:', JSON.stringify(order, null, 2))

    // E-Mail-Inhalt erstellen
    const emailContent = `
Neue Fahrzeugüberführungsanfrage von ${orderData.name}

KONTAKTDATEN:
- Anrede: ${orderData.salutation}
- Name: ${orderData.name}
- E-Mail: ${orderData.email}
- Telefon: ${orderData.phone}
- Kontaktmethode: ${orderData.contactMethod}
${orderData.callWindow ? `- Gewünschtes Zeitfenster: ${orderData.callWindow}` : ''}

FAHRZEUGDATEN:
- Typ: ${orderData.vehicleType}
- Kennzeichen: ${orderData.vehiclePlate}
- Marke/Modell: ${orderData.vehicleMakeModel}
${orderData.vehicleNotes ? `- Besonderheiten: ${orderData.vehicleNotes}` : ''}

ABHOLUNG:
- Adresse: ${orderData.pickupStreet} ${orderData.pickupHouseNumber}, ${orderData.pickupPostalCode} ${orderData.pickupCity}
- Datum: ${orderData.pickupDate}
- Uhrzeit: ${orderData.pickupTime}

ZIEL:
- Adresse: ${orderData.deliveryStreet} ${orderData.deliveryHouseNumber}, ${orderData.deliveryPostalCode} ${orderData.deliveryCity}
${orderData.deliveryDate ? `- Datum: ${orderData.deliveryDate}` : ''}
${orderData.deliveryTime ? `- Uhrzeit: ${orderData.deliveryTime}` : ''}

${orderData.message ? `NACHRICHT: ${orderData.message}` : ''}

DSGVO: ${orderData.gdprConsent ? 'Zugestimmt' : 'Nicht zugestimmt'}
Newsletter: ${orderData.newsletterConsent ? 'Zugestimmt' : 'Nicht zugestimmt'}

---
Auftrag #${orderId} wurde im Dispositionstool erstellt.
Gesendet am: ${new Date().toLocaleString('de-DE')}
    `.trim()

    // Lade bestehende Aufträge aus JSONBin (persistent)
    console.log('Lade bestehende Aufträge aus JSONBin...')
    const existingOrders = await loadOrdersFromJSONBin()
    console.log(`${existingOrders.length} bestehende Aufträge geladen`)
    
    // Füge neuen Auftrag hinzu
    const updatedOrders = [...existingOrders, order]
    console.log(`Neue Gesamtanzahl: ${updatedOrders.length} Aufträge`)
    
    // Speichere Aufträge persistent in JSONBin
    const saved = await saveOrdersToJSONBin(updatedOrders)
    if (!saved) {
      // Fallback falls JSONBin nicht funktioniert
      fallbackOrders = updatedOrders
      console.log('Aufträge in Fallback gespeichert (JSONBin nicht verfügbar)')
    }
    
    // Log für Debugging
    console.log('Neuer Auftrag erstellt:', JSON.stringify(order, null, 2))
    console.log('E-Mail-Inhalt:', emailContent)
    
    // In der Produktion würden Sie hier den E-Mail-Service aufrufen:
    // await sendEmail({
    //   to: 'info@abdullahu-drive-solutions.de',
    //   subject: `Neue Fahrzeugüberführungsanfrage von ${orderData.name} - Auftrag #${orderId}`,
    //   text: emailContent
    // })
    
    return NextResponse.json({ 
      message: 'Anfrage erfolgreich gesendet und Auftrag erstellt', 
      orderId: orderId,
      order: order
    }, { status: 201 })
    
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Anfrage:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Verarbeiten der Anfrage' 
    }, { status: 500 })
  }
}
