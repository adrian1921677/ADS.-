# Resend E-Mail Setup

## 1. Resend Account einrichten

1. Gehen Sie zu [resend.com](https://resend.com) und erstellen Sie ein Konto
2. Verifizieren Sie Ihre Domain `abdullahu-drive.de` in der Resend Dashboard
3. Generieren Sie einen API-Key unter "API Keys"

## 2. Environment Variables

Erstellen Sie eine `.env.local` Datei im Projektverzeichnis:

```env
# Resend API Configuration
RESEND_API_KEY=re_your_resend_api_key_here
CONTACT_TO=info@abdullahu-drive.de

# Neon Database (optional)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

## 3. Domain Verifizierung

**Wichtig:** Die Domain `abdullahu-drive.de` muss in Resend verifiziert werden, sonst werden E-Mails abgelehnt oder landen im Spam.

### DNS-Einträge hinzufügen:

1. **SPF Record:**
   ```
   v=spf1 include:_spf.resend.com ~all
   ```

2. **DKIM Record:**
   ```
   resend._domainkey.abdullahu-drive.de
   ```

3. **DMARC Record (optional):**
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@abdullahu-drive.de
   ```

## 4. Datenbank Setup (optional)

Falls Sie Kontaktanfragen in der Datenbank speichern möchten:

```sql
-- Tabelle für Kontaktanfragen erstellen
CREATE TABLE IF NOT EXISTS contact_requests (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);
```

## 5. Testing

### Lokaler Test:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### Erwartete Antworten:
- **Erfolg:** `{"ok": true}`
- **Fehler:** `{"ok": false, "error": "Fehlermeldung"}`

## 6. Features

- ✅ **Zod-Validierung** für alle Eingaben
- ✅ **Honeypot-Schutz** gegen Bots
- ✅ **Resend Integration** für zuverlässige E-Mail-Zustellung
- ✅ **Neon DB Integration** (optional)
- ✅ **TypeScript-Unterstützung**
- ✅ **Error Handling**
- ✅ **Responsive Design**

## 7. Troubleshooting

### E-Mails landen im Spam:
- Domain in Resend verifizieren
- SPF/DKIM Records korrekt setzen
- `from`-Adresse muss verifizierte Domain verwenden

### API-Fehler:
- `RESEND_API_KEY` prüfen
- Domain-Verifizierung in Resend Dashboard prüfen
- Console-Logs für detaillierte Fehlermeldungen

### Build-Fehler:
- Alle Dependencies installiert: `npm install`
- TypeScript-Fehler beheben: `npm run build`
