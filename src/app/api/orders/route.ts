import { NextResponse } from 'next/server'

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

export async function GET() {
  return NextResponse.json({ message: 'API funktioniert' })
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json()
    
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
Gesendet am: ${new Date().toLocaleString('de-DE')}
    `.trim()

    // Hier würde normalerweise ein E-Mail-Service wie SendGrid, Resend oder Nodemailer verwendet werden
    // Für jetzt simulieren wir eine erfolgreiche E-Mail-Versendung
    console.log('E-Mail-Inhalt:', emailContent)
    
    // In der Produktion würden Sie hier den E-Mail-Service aufrufen:
    // await sendEmail({
    //   to: 'info@abdullahu-drive-solutions.de',
    //   subject: `Neue Fahrzeugüberführungsanfrage von ${orderData.name}`,
    //   text: emailContent
    // })
    
    return NextResponse.json({ 
      message: 'Anfrage erfolgreich gesendet', 
      orderId: Date.now().toString() 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Anfrage:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Verarbeiten der Anfrage' 
    }, { status: 500 })
  }
}
