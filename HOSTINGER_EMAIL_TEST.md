# Hostinger E-Mail-Test

## 🔧 Aktuelle Konfiguration (.env.local):

```env
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=OsW*9Wf>
```

## 🧪 Alternative Hostinger-Konfigurationen zum Testen:

### Option 1: Standard Hostinger
```env
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=OsW*9Wf>
```

### Option 2: Hostinger SMTP Server
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=OsW*9Wf>
```

### Option 3: Mit SSL (Port 465)
```env
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=465
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=OsW*9Wf>
```

### Option 4: Mit STARTTLS
```env
SMTP_HOST=mail.abdullahu-drive.de
SMTP_PORT=25
SMTP_USER=info@abdullahu-drive.de
SMTP_PASS=OsW*9Wf>
```

## 🐛 Debugging-Schritte:

1. **Server-Logs prüfen** - Schauen Sie in die Konsole für Fehlermeldungen
2. **Verbindung testen** - Die App testet automatisch die SMTP-Verbindung
3. **Passwort überprüfen** - Stellen Sie sicher, dass das Passwort korrekt ist
4. **Hostinger-Einstellungen** - Prüfen Sie die E-Mail-Einstellungen im Hostinger Control Panel

## 📧 Hostinger-spezifische Probleme:

- **Port 587** funktioniert meist besser als 465
- **TLS-Verschlüsselung** ist erforderlich
- **App-Passwörter** sind manchmal nötig
- **Firewall-Einstellungen** können blockieren

## 🔄 Testen:

1. Ändern Sie die .env.local Datei
2. Starten Sie den Server neu: `npm run dev`
3. Testen Sie das Kontaktformular
4. Prüfen Sie die Server-Logs für Details
