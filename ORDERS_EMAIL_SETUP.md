# Orders API E-Mail Integration

## 🚀 Übersicht

Der Orders-Endpoint (`/api/orders`) wurde um eine vollständige E-Mail-Integration erweitert. Nach jedem erfolgreichen Auftrag wird automatisch eine strukturierte E-Mail mit allen relevanten Informationen gesendet.

## 📧 E-Mail-Features

### ✅ Automatischer Versand
- **Nach DB-Insert:** E-Mail mit Auftragsnummer und Details
- **Bei Fallback:** E-Mail mit FALLBACK-Kennzeichnung
- **Reply-To:** Kunde kann direkt antworten

### 🎨 Schönes HTML-Template
- **Gradient Header** mit Abdullahu Drive Solutions Branding
- **Strukturierte Bereiche:**
  - 📋 Auftragsdetails (Status, Nummer, Datum)
  - 👤 Kundeninformationen (Name, E-Mail, Telefon)
  - 🚗 Transportdaten (Abholort, Zielort, Fahrzeugtyp, etc.)
  - 💬 Nachricht/Hinweise
- **Responsive Design** für alle E-Mail-Clients
- **Fallback Text-Version** für ältere Clients

### 🔧 Technische Details
- **From:** `noreply@updates.abdullahu-drive.de` (verifizierte Subdomain)
- **To:** `CONTACT_TO` Environment Variable oder `info@abdullahu-drive.de`
- **Service:** Resend (zuverlässige Zustellung)

## ⚙️ Environment Variables

### Vercel Project Settings → Environment Variables:

```env
# Resend API Key (erforderlich)
RESEND_API_KEY=re_your_resend_api_key_here

# Empfänger-E-Mail (optional, Standard: info@abdullahu-drive.de)
CONTACT_TO=info@abdullahu-drive.de
```

### Domain-Verifizierung:
- **Subdomain:** `updates.abdullahu-drive.de` muss in Resend verifiziert sein
- **DNS-Records:** SPF, DKIM, DMARC (falls gewünscht)

## 🧪 Testing

### 1. Lokaler Test:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "name": "Max Mustermann",
      "email": "max@example.com",
      "phone": "+49 123 456 789",
      "pickupLocation": "München, Hauptbahnhof",
      "destination": "Hamburg, Altona",
      "vehicleType": "BMW 3er, M-AB 123 CD",
      "readyToDrive": "ja",
      "preferredDate": "2024-01-15",
      "message": "Besondere Wünsche..."
    },
    "status": "neu"
  }'
```

### 2. Erwartete Antworten:
- **Erfolg:** `201` + E-Mail im Postfach
- **Fallback:** `201` + E-Mail mit FALLBACK-Kennzeichnung
- **Fehler:** `400/500` + Fehlermeldung

### 3. E-Mail-Beispiel:
```
Betreff: Neue Überführungs-Anfrage ADS-2024-001

[Schönes HTML-Template mit allen Daten]
```

## 📋 E-Mail-Template-Struktur

### Header
- Gradient-Hintergrund (Blau)
- Titel: "Neue Überführungs-Anfrage"
- Fallback-Warnung (falls DB nicht verfügbar)

### Auftragsdetails
- Status des Auftrags
- Auftragsnummer (falls vorhanden)
- Erstellungsdatum

### Kundeninformationen
- Name, E-Mail, Telefon
- Nur angezeigt wenn vorhanden

### Transportdaten
- Abholort und Zielort
- Fahrzeugtyp und Kennzeichen
- Fahrbereitschaft
- Wunschtermin

### Nachricht/Hinweise
- Zusätzliche Informationen vom Kunden
- Nur angezeigt wenn vorhanden

### Footer
- Link zur Website
- Hinweis auf Kontaktformular

## 🔍 Monitoring & Debugging

### Console-Logs:
```javascript
// Erfolgreicher Versand
[email] E-Mail erfolgreich gesendet: { to: "info@abdullahu-drive.de", subject: "..." }

// Fehler
[email] Resend-Fehler: { error: "..." }
[email] RESEND_API_KEY fehlt – Mail wird übersprungen
```

### Fehlerbehandlung:
- **Kein API-Key:** E-Mail wird übersprungen, Auftrag wird trotzdem gespeichert
- **Resend-Fehler:** Fehler wird geloggt, Auftrag wird trotzdem gespeichert
- **DB-Fehler:** Fallback-E-Mail wird gesendet

## 🚀 Deployment

1. **Environment Variables setzen** in Vercel
2. **Domain verifizieren** in Resend Dashboard
3. **Redeploy** der Anwendung
4. **Testen** mit curl oder Kontaktformular

## 📊 Vorteile

- ✅ **Automatische Benachrichtigungen** bei neuen Aufträgen
- ✅ **Professionelle E-Mails** mit strukturierten Daten
- ✅ **Fallback-Sicherheit** auch bei DB-Problemen
- ✅ **Direkte Antwortmöglichkeit** für Kunden
- ✅ **Vollständige Integration** in bestehenden Workflow
- ✅ **Zuverlässige Zustellung** über Resend

## 🔧 Wartung

- **API-Key regelmäßig erneuern** (falls nötig)
- **Domain-Verifizierung prüfen** (jährlich)
- **E-Mail-Templates anpassen** (bei Design-Änderungen)
- **Logs überwachen** (für Fehlerbehandlung)

