# Datenbank-Setup für Abdullahu Drive Solutions

## Problem
Die Aufträge gehen bei jedem Deployment verloren, weil wir keine echte persistente Datenbank haben.

## Lösung: JSONBin.io
Wir verwenden jetzt JSONBin.io für persistente Speicherung der Aufträge.

### Setup-Schritte:

1. **Account erstellen:**
   - Gehen Sie zu https://jsonbin.io
   - Erstellen Sie einen kostenlosen Account

2. **API-Key erstellen:**
   - Gehen Sie zu "My Bins"
   - Klicken Sie auf "Create New Bin"
   - Kopieren Sie den API-Key

3. **Vercel-Umgebungsvariable setzen:**
   - Gehen Sie zu Ihrem Vercel-Dashboard
   - Wählen Sie Ihr Projekt "ADS.-"
   - Gehen Sie zu "Settings" → "Environment Variables"
   - Fügen Sie hinzu:
     - Name: `JSONBIN_API_KEY`
     - Value: Ihr API-Key von JSONBin.io
     - Environment: Production

4. **Bin-ID anpassen:**
   - In `src/app/api/orders/route.ts` Zeile 5
   - Ändern Sie `abdullahu-drive-orders` zu Ihrer Bin-ID

### Vorteile:
- ✅ Aufträge bleiben nach Deployment erhalten
- ✅ Echte persistente Speicherung
- ✅ Kostenlos für kleine Projekte
- ✅ Einfache API

### Testen:
Nach dem Setup sollten Aufträge auch nach Updates erhalten bleiben!
