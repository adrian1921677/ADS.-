# E-Mail-Setup für Kontaktformular

## 🚀 Schnellstart

1. **Erstellen Sie eine `.env.local` Datei** im Hauptverzeichnis:
```bash
# E-Mail-Konfiguration für Kontaktformular
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_app_passwort_hier
```

## 📧 Gmail-Konfiguration (Empfohlen)

### Schritt 1: App-Passwort erstellen
1. Gehen Sie zu [Google Account](https://myaccount.google.com/)
2. Sicherheit → 2-Schritt-Verifizierung aktivieren
3. App-Passwörter → App-Passwort erstellen
4. Wählen Sie "Mail" und "Windows Computer"
5. Kopieren Sie das generierte Passwort

### Schritt 2: .env.local konfigurieren
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_16_stelliges_app_passwort
```

## 📧 Alternative E-Mail-Provider

### Hostinger (Empfohlen für abdullahu-drive.de)
```env
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_hostinger_passwort
```

**Alternative Hostinger-Konfigurationen:**
```env
# Option 2 (Falls Option 1 nicht funktioniert)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_passwort

# Option 3 (Mit SSL)
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=465
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_passwort
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_passwort
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_app_passwort
```

### Eigener SMTP-Server
```env
SMTP_HOST=ihr-smtp-server.de
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=ihr_passwort
```

## 🔧 Testen

1. Starten Sie den Server: `npm run dev`
2. Besuchen Sie `http://localhost:3000/kontakt`
3. Füllen Sie das Formular aus
4. Prüfen Sie Ihr E-Mail-Postfach

## 🐛 Fehlerbehebung

### "Invalid login" Fehler
- Überprüfen Sie Benutzername und Passwort
- Bei Gmail: Verwenden Sie App-Passwort, nicht normales Passwort
- Stellen Sie sicher, dass 2-Faktor-Authentifizierung aktiviert ist

### "Connection timeout" Fehler
- Überprüfen Sie SMTP_HOST und SMTP_PORT
- Prüfen Sie Ihre Internetverbindung
- Kontaktieren Sie Ihren E-Mail-Provider für die korrekten SMTP-Einstellungen

### E-Mails kommen nicht an
- Prüfen Sie den Spam-Ordner
- Überprüfen Sie die E-Mail-Adresse in der .env.local
- Schauen Sie in die Server-Logs für Fehlermeldungen

## 📝 Wichtige Hinweise

- **Niemals** echte Passwörter in Git committen
- Verwenden Sie immer `.env.local` für lokale Konfiguration
- Für Produktion: Konfigurieren Sie Umgebungsvariablen auf Ihrem Hosting-Provider
- Testen Sie immer zuerst lokal, bevor Sie live gehen
