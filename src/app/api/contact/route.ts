import { NextRequest, NextResponse } from 'next/server'

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

    // E-Mail-Inhalt erstellen
    const emailContent = `
Neue Kontaktanfrage von der Website:

Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Betreff: ${subject || 'Allgemeine Anfrage'}

Nachricht:
${message}

---
Diese E-Mail wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.
    `.trim()

    // Hier würde normalerweise ein E-Mail-Service wie Nodemailer, SendGrid, etc. verwendet werden
    // Für die Demo simulieren wir das Senden der E-Mail
    console.log('E-Mail würde gesendet werden an: info@abdullahu-drive.de')
    console.log('E-Mail-Inhalt:', emailContent)

    // In einer echten Implementierung würden Sie hier den E-Mail-Service aufrufen:
    // await sendEmail({
    //   to: 'info@abdullahu-drive.de',
    //   subject: `Kontaktanfrage von ${name}`,
    //   text: emailContent,
    //   replyTo: email
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Fehler beim Senden der Kontaktanfrage:', error)
    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    )
  }
}
