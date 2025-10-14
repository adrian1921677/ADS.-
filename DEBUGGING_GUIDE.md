# 🔍 Debugging-Guide: Kontaktformular → Dispositionstool

## Problem
Kontaktformular sendet "erfolgreich", aber Datensätze tauchen im Dispositionstool nicht auf.

## 🛠️ Debugging-Schritte

### 1. **Health-Check der Datenbank**
```
GET /api/health/db
```
**Erwartung:** `{ ok: true, database: "connected", result: [...] }`
**Falls Fehler:** DATABASE_URL prüfen und korrigieren

### 2. **Kontaktformular testen**
1. Formular ausfüllen und absenden
2. **Browser-Konsole öffnen** (F12)
3. Nach `[order_` suchen - sollte Request-ID und Logs zeigen
4. **Response prüfen:** Sollte `{ message: "Auftrag erfolgreich erstellt", order: {...}, rid: "..." }` enthalten

### 3. **Vercel Function Logs prüfen**
1. Vercel Dashboard → Project → Functions
2. Nach dem Formular-Absenden die Logs prüfen
3. Nach `[order_` oder `[get_orders_` suchen
4. **Wichtige Logs:**
   - `POST /api/orders - Request received`
   - `Database insert successful` oder `Database error, using fallback`
   - `GET /api/orders - Request received`
   - `Orders retrieved successfully`

### 4. **Dispositionstool prüfen**
1. Dispositionstool öffnen
2. **Debug Panel** prüfen (unten im Filter-Bereich)
3. **Browser-Konsole** öffnen und nach "Disposition Filter Debug" suchen
4. **Status-Filter** auf "alle" setzen (falls nicht bereits)

### 5. **Datenbank direkt prüfen**
```sql
-- In Neon Dashboard → SQL Editor
SELECT id, status, created_at, order_number 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚨 Häufige Probleme & Lösungen

### Problem 1: DATABASE_URL falsch
**Symptom:** Health-Check schlägt fehl
**Lösung:** 
- Vercel → Settings → Environment Variables
- `DATABASE_URL` prüfen (richtiger Branch?)
- Format: `postgres://USER:PASSWORD@ep-...pooler.eu-central-1.aws.neon.tech/ads_database?sslmode=require`

### Problem 2: Status-Filter im Dispositionstool
**Symptom:** Aufträge werden nicht angezeigt
**Lösung:**
- Status-Filter auf "alle" setzen
- Debug Panel zeigt aktiven Filter an

### Problem 3: Datenbank-Migration fehlt
**Symptom:** Insert schlägt fehl
**Lösung:**
```bash
npx prisma migrate deploy
npx prisma generate
```

### Problem 4: Edge Runtime Problem
**Symptom:** Prisma-Fehler in Vercel
**Lösung:** ✅ Bereits implementiert - `export const runtime = "nodejs"`

## 📊 Debug-Informationen

### Request-ID (RID) System
Jede API-Anfrage hat eine eindeutige ID:
- `order_1234567890_abc123def` für POST-Requests
- `get_orders_1234567890` für GET-Requests
- `health_1234567890` für Health-Checks

### Logging-Levels
- **INFO:** Normale Operationen
- **WARN:** Fallback-Speicherung verwendet
- **ERROR:** Datenbankfehler oder andere Probleme

### Filter-Debug
Das Dispositionstool loggt:
- Anzahl geladener Aufträge
- Aktiver Status-Filter
- Welche Aufträge herausgefiltert werden

## 🔧 Sofort-Fixes

### 1. Status-Filter zurücksetzen
```javascript
// In Browser-Konsole auf Dispositionstool-Seite
localStorage.setItem('statusFilter', '')
location.reload()
```

### 2. Alle Aufträge anzeigen
```javascript
// In Browser-Konsole
document.querySelector('select[value]').value = ''
```

### 3. Debug-Logs aktivieren
```javascript
// In Browser-Konsole
localStorage.setItem('debug', 'true')
```

## 📞 Support-Informationen

Falls das Problem weiterhin besteht, sammeln Sie:

1. **Request-ID** aus der Browser-Konsole
2. **Vercel Function Logs** für diese RID
3. **DATABASE_URL** (ohne Passwort)
4. **Screenshot** des Debug Panels im Dispositionstool
5. **Neon SQL Query** Ergebnis

## ✅ Erfolgreiche Tests

Nach dem Fix sollten Sie sehen:

1. **Health-Check:** `{ ok: true }`
2. **Formular-Response:** `{ message: "Auftrag erfolgreich erstellt", order: {...} }`
3. **Dispositionstool:** Auftrag erscheint in der Liste
4. **Debug Panel:** Zeigt korrekte Anzahl Aufträge
5. **Vercel Logs:** Keine Fehler, nur INFO/WARN

---

**Letzte Aktualisierung:** $(date)
**Version:** 1.0.0
