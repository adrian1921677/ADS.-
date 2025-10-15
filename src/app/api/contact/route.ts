import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, gdprConsent } = body

    // Validierung der erforderlichen Felder
    if (!name || !email || !message || !gdprConsent) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
        { status: 400 }
      )
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' },
        { status: 400 }
      )
    }

    // Echte E-Mail senden
    try {
      await sendContactEmail({
        name,
        email,
        phone,
        subject,
        message
      })

      console.log('E-Mail erfolgreich an info@abdullahu-drive.de gesendet')
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.' 
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('E-Mail-Versand fehlgeschlagen:', emailError)
      
      // Fallback: E-Mail-Details in Console loggen
      console.log('=== FALLBACK: E-Mail-Details ===')
      console.log('An: info@abdullahu-drive.de')
      console.log('Von:', email)
      console.log('Name:', name)
      console.log('Telefon:', phone || 'Nicht angegeben')
      console.log('Betreff:', subject || 'Allgemeine Anfrage')
      console.log('Nachricht:', message)
      console.log('===============================')
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Ihre Nachricht wurde gespeichert. Wir melden uns schnellstmöglich bei Ihnen.' 
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error('Fehler beim Senden der Kontaktanfrage:', error)
    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    )
  }
}
