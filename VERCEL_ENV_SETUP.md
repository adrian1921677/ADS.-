# Vercel Environment Variables Setup

## 🚨 WICHTIG: Domain-Verifizierung

**Alle E-Mails müssen von der verifizierten Subdomain `@updates.abdullahu-drive.de` gesendet werden!**

## 📧 Environment Variables (Vercel)

### Vercel Dashboard → Project Settings → Environment Variables:

```env
# Resend API Key (erforderlich)
RESEND_API_KEY=re_your_resend_api_key_here

# E-Mail Absender (MUSS @updates.abdullahu-drive.de verwenden)
CONTACT_FROM=Kontaktformular <noreply@updates.abdullahu-drive.de>

# E-Mail Empfänger
CONTACT_TO=info@abdullahu-drive.de

# Optional: Neon Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

## ✅ Verifizierte Domain

- **Subdomain:** `updates.abdullahu-drive.de` ✅ **VERIFIZIERT**
- **Hauptdomain:** `abdullahu-drive.de` ❌ **NICHT VERIFIZIERT**

## 🔧 Automatische Sicherheitschecks

Der Code prüft automatisch, dass nur verifizierte Domains verwendet werden:

```javascript
// Sicherheitscheck für verifizierte Domain
if (!/@updates\.abdullahu-drive\.de>?$/.test(from)) {
  throw new Error('FROM muss @updates.abdullahu-drive.de sein');
}
```

## 🚀 Deployment-Schritte

1. **Environment Variables setzen** in Vercel Dashboard
2. **Redeploy** der Anwendung
3. **Testen** mit Kontaktformular
4. **E-Mails prüfen** im Postfach

## 🧪 Testing

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

### Erwartete E-Mail:
```
Von: Kontaktformular <noreply@updates.abdullahu-drive.de>
An: info@abdullahu-drive.de
Betreff: Neue Angebotsanfrage von Test User
```

## ❌ Häufige Fehler

### 1. Falsche Domain:
```
❌ from: "noreply@abdullahu-drive.de"  // Nicht verifiziert
✅ from: "noreply@updates.abdullahu-drive.de"  // Verifiziert
```

### 2. Fehlende Environment Variables:
```
❌ RESEND_API_KEY fehlt
✅ RESEND_API_KEY=re_...
```

### 3. Domain nicht verifiziert:
```
❌ The abdullahu-drive.de domain is not verified
✅ updates.abdullahu-drive.de ist verifiziert
```

## 📋 Checkliste

- [ ] `RESEND_API_KEY` gesetzt
- [ ] `CONTACT_FROM` mit `@updates.abdullahu-drive.de`
- [ ] `CONTACT_TO` mit gewünschter E-Mail
- [ ] Domain `updates.abdullahu-drive.de` in Resend verifiziert
- [ ] Anwendung redeployed
- [ ] E-Mail-Test erfolgreich

## 🔍 Debugging

### Console-Logs prüfen:
```javascript
// Erfolgreich
[email] E-Mail erfolgreich gesendet: { to: "info@abdullahu-drive.de", subject: "..." }

// Fehler
[email] FROM muss @updates.abdullahu-drive.de sein: noreply@abdullahu-drive.de
[email] RESEND_API_KEY fehlt – Mail wird übersprungen
```

### Vercel Logs:
```bash
vercel logs --follow
```

## 🎯 Ergebnis

Nach korrekter Konfiguration:
- ✅ E-Mails werden von `@updates.abdullahu-drive.de` gesendet
- ✅ Automatische Sicherheitschecks verhindern falsche Domains
- ✅ Zuverlässige E-Mail-Zustellung über Resend
- ✅ Keine Domain-Verifizierungsfehler mehr