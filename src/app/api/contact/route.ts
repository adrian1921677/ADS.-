import { Resend } from "resend";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const schema = z.object({
  name: z.string().min(1, "Name fehlt"),
  email: z.string().email("E-Mail ungültig"),
  phone: z.string().min(1, "Telefon fehlt"),
  pickupLocation: z.string().min(1, "Abholort fehlt"),
  destination: z.string().min(1, "Zielort fehlt"),
  vehicleType: z.string().optional(),
  readyToDrive: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, "Datenschutzerklärung muss akzeptiert werden"),
  // optional: honeypot
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Honeypot -> Bot?
    if (data.website && data.website.trim() !== "") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "Server misconfigured (RESEND_API_KEY)" }), { status: 500 });
    }

    // Optional: In Neon DB speichern
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        await sql`
          INSERT INTO contact_requests (name, email, message, created_at)
          VALUES (${data.name}, ${data.email}, ${data.message}, NOW())
        `;
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue with email sending even if DB fails
      }
    }

    const resend = new Resend(RESEND_API_KEY);
    const to = process.env.CONTACT_TO ?? "info@abdullahu-drive.de";

    const res = await resend.emails.send({
      from: "Abdullahu Drive Solutions <noreply@abdullahu-drive.de>", // Domain in Resend verifizieren
      to,
      subject: `Neue Angebotsanfrage von ${data.name}`,
      replyTo: data.email,
      text: [
        `=== NEUE ANGEBOTSANFRAGE ===`,
        ``,
        `PERSÖNLICHE DATEN:`,
        `Name: ${data.name}`,
        `E-Mail: ${data.email}`,
        `Telefon: ${data.phone}`,
        ``,
        `TRANSPORTDATEN:`,
        `Abholort: ${data.pickupLocation}`,
        `Zielort: ${data.destination}`,
        `Fahrzeugtyp: ${data.vehicleType || 'Nicht angegeben'}`,
        `Fahrbereit: ${data.readyToDrive || 'Nicht angegeben'}`,
        ``,
        `TERMIN:`,
        `Wunschtermin: ${data.preferredDate || 'Nicht angegeben'}`,
        ``,
        `NACHRICHT:`,
        data.message || 'Keine zusätzlichen Hinweise',
        ``,
        `---`,
        `Diese Anfrage wurde über das Kontaktformular auf abdullahu-drive-solutions.de gesendet.`
      ].join("\n"),
    });

    // optional: Resend-Fehler prüfen
    if ((res as any)?.error) {
      throw new Error((res as any).error.message ?? "Resend error");
    }

    return Response.json({ ok: true });
  } catch (err: any) {
    const msg = err?.issues?.[0]?.message ?? err?.message ?? "Unknown error";
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 });
  }
}