# Vercel Environment Variables Setup

## 🔑 Resend API-Key für Vercel konfigurieren

### Schritt 1: Vercel Dashboard öffnen
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Loggen Sie sich in Ihr Konto ein
3. Wählen Sie Ihr Projekt "abdullahu-drive-solutions"

### Schritt 2: Environment Variables hinzufügen
1. Klicken Sie auf **"Settings"**
2. Wählen Sie **"Environment Variables"** im linken Menü
3. Klicken Sie auf **"Add New"**

### Schritt 3: Resend API-Key konfigurieren
**Name:** `RESEND_API_KEY`  
**Value:** `re_8cVAyhQw_KARiqpteYzvV8AhcHHQS6fUb`  
**Environment:** Alle (Production, Preview, Development)

### Schritt 4: Deployment neu starten
1. Gehen Sie zu **"Deployments"**
2. Klicken Sie auf **"Redeploy"** bei der neuesten Deployment
3. Oder pushen Sie einen neuen Commit

## 📧 E-Mail-Funktionalität

Nach der Konfiguration:
- ✅ **E-Mails werden über Resend gesendet**
- ✅ **An:** `info@abdullahu-drive.de`
- ✅ **Von:** `info@abdullahu-drive.de` (verifizierte Domain)
- ✅ **Schönes HTML-Format** mit allen Kontaktdaten

## 🧪 Testen

1. Besuchen Sie Ihre Live-Website
2. Gehen Sie zu `/kontakt`
3. Füllen Sie das Formular aus
4. **E-Mails kommen garantiert an!**

## 🔧 Lokale Entwicklung

Für lokale Tests ist der API-Key bereits in `.env.local` konfiguriert:
```env
RESEND_API_KEY=re_8cVAyhQw_KARiqpteYzvV8AhcHHQS6fUb
```

## ⚠️ Wichtige Hinweise

- **Niemals** API-Keys in Git committen
- **Immer** Environment Variables für Produktion verwenden
- **Testen** Sie nach jeder Änderung das Kontaktformular
