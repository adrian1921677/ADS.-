import nodemailer from 'nodemailer'

// E-Mail-Konfiguration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true für 465, false für andere Ports
  auth: {
    user: process.env.SMTP_USER || 'info@abdullahu-drive.de',
    pass: process.env.SMTP_PASS || '', // App-Passwort oder E-Mail-Passwort
  },
  // Hostinger-spezifische Einstellungen
  tls: {
    rejectUnauthorized: false, // Für Hostinger manchmal erforderlich
  },
})

export interface EmailData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function sendContactEmail(data: EmailData) {
  try {
    const mailOptions = {
      from: `"Abdullahu Drive Solutions" <${process.env.SMTP_USER || 'info@abdullahu-drive.de'}>`,
      to: 'info@abdullahu-drive.de',
      replyTo: data.email,
      subject: `Kontaktanfrage von ${data.name}${data.subject ? ` - ${data.subject}` : ''}`,
      text: `
Neue Kontaktanfrage von der Website:

Name: ${data.name}
E-Mail: ${data.email}
Telefon: ${data.phone || 'Nicht angegeben'}
Betreff: ${data.subject || 'Allgemeine Anfrage'}

Nachricht:
${data.message}

---
Diese E-Mail wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Neue Kontaktanfrage von der Website</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>E-Mail:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</p>
            <p><strong>Betreff:</strong> ${data.subject || 'Allgemeine Anfrage'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Nachricht:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Diese E-Mail wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.
          </p>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('E-Mail erfolgreich gesendet:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error)
    throw new Error('E-Mail konnte nicht gesendet werden')
  }
}
