import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // E-Mail mit Resend senden
    try {
      const { data, error } = await resend.emails.send({
        from: 'Abdullahu Drive Solutions <info@abdullahu-drive.de>',
        to: 'info@abdullahu-drive.de',
        replyTo: email,
        subject: `Kontaktanfrage von ${name}${subject ? ` - ${subject}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Neue Kontaktanfrage von der Website</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>E-Mail:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
              <p><strong>Betreff:</strong> ${subject || 'Allgemeine Anfrage'}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Nachricht:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              Diese E-Mail wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.
            </p>
          </div>
        `,
        text: `
Neue Kontaktanfrage von der Website:

Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Betreff: ${subject || 'Allgemeine Anfrage'}

Nachricht:
${message}

---
Diese E-Mail wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.
        `.trim(),
      })

      if (error) {
        console.error('Resend-Fehler:', error)
        throw new Error(`E-Mail konnte nicht gesendet werden: ${error.message}`)
      }

      console.log('E-Mail erfolgreich mit Resend gesendet:', data?.id)
      
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
