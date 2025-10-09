import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Upstash Redis Client mit Fallback
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.log('Redis nicht verfügbar, verwende Fallback:', error)
}

// Fallback: In-Memory-Speicherung
let fallbackOrders: Order[] = []

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
    let orders: Order[] = []
    
    if (redis) {
      // Versuche Redis zu verwenden
      try {
        orders = await redis.get<Order[]>(ORDERS_KEY) || []
      } catch (error) {
        console.log('Redis-Fehler, verwende Fallback:', error)
        orders = fallbackOrders
      }
    } else {
      // Verwende Fallback
      orders = fallbackOrders
    }
    
    // Falls keine Aufträge vorhanden sind, füge einen Demo-Auftrag hinzu
    if (orders.length === 0) {
      const demoOrder: Order = {
        id: '1',
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
      
      // Speichere Demo-Auftrag
      if (redis) {
        try {
          await redis.set(ORDERS_KEY, [demoOrder])
        } catch (error) {
          console.log('Redis-Speicher-Fehler, verwende Fallback:', error)
          fallbackOrders = [demoOrder]
        }
      } else {
        fallbackOrders = [demoOrder]
      }
      return NextResponse.json([demoOrder])
    }
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fehler beim Abrufen der Aufträge:', error)
    return NextResponse.json({ error: 'Fehler beim Abrufen der Aufträge' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json()
    
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

    // Lade bestehende Aufträge
    let existingOrders: Order[] = []
    
    if (redis) {
      try {
        existingOrders = await redis.get<Order[]>(ORDERS_KEY) || []
      } catch (error) {
        console.log('Redis-Lade-Fehler, verwende Fallback:', error)
        existingOrders = fallbackOrders
      }
    } else {
      existingOrders = fallbackOrders
    }
    
    // Füge neuen Auftrag hinzu
    const updatedOrders = [...existingOrders, order]
    
    // Speichere Aufträge
    if (redis) {
      try {
        await redis.set(ORDERS_KEY, updatedOrders)
      } catch (error) {
        console.log('Redis-Speicher-Fehler, verwende Fallback:', error)
        fallbackOrders = updatedOrders
      }
    } else {
      fallbackOrders = updatedOrders
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
