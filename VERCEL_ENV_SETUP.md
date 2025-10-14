# 🔧 Vercel Environment Variables Setup

## Problem gelöst: Config-Mischmasch + fehlende Migrationen

Das Kontaktformular funktioniert nicht, weil:
- **Prisma** braucht **Pooler-URL** mit `pgbouncer=true`
- **Neon HTTP** braucht **direkte URL** ohne `-pooler`
- **Eine einzige DATABASE_URL** kann nicht beide bedienen
- **Migrationen** laufen nicht in Production

## ✅ Lösung: Zwei separate ENV-Variablen

### 1. Vercel Dashboard → Project → Settings → Environment Variables

#### **DATABASE_URL** (für Prisma mit Pooler):
```
postgresql://neondb_owner:DEIN_NEUES_PASSWORT@ep-lucky-river-ag110etn-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15
```

#### **NEON_HTTP_URL** (für @neondatabase/serverless ohne Pooler):
```
postgresql://neondb_owner:DEIN_NEUES_PASSWORT@ep-lucky-river-ag110etn.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Wichtige Hinweise:
- ❌ **KEIN** `channel_binding=require` Parameter
- ✅ **Passwort rotieren** (war öffentlich gepostet)
- ✅ **Beide URLs** für **Production + Preview + Development** setzen
- ✅ **Re-Deploy** nach Änderung der ENV-Variablen

## 🚀 Build-Command aktualisieren

### Vercel Dashboard → Project → Settings → Build & Development Settings

**Build Command:** `npm run vercel-build`

**Install Command:** `npm install`

## 🧪 Health-Checks testen

Nach dem Re-Deploy:

### 1. Neon HTTP Driver:
```
GET /api/health/db
```
**Erwartung:** `{ ok: true, driver: "@neondatabase/serverless" }`

### 2. Prisma Driver:
```
GET /api/health/prisma
```
**Erwartung:** `{ ok: true, driver: "prisma" }`

### 3. API-Test:
```
GET /api/test-apis
```
**Erwartung:** Beide APIs funktionieren

## 🔍 Funktionstest (End-to-End)

1. **Re-Deploy** nach ENV-Update
2. **Health-Checks** prüfen
3. **Kontaktformular** ausfüllen und absenden
4. **Vercel Logs** prüfen (Status 201 suchen)
5. **Dispositionstool** prüfen (Auftrag sollte erscheinen)

## 📊 Erwartete Ergebnisse

### ✅ Erfolgreich:
- **Health-Checks:** Beide `{ ok: true }`
- **Kontaktformular:** Erfolgsmeldung
- **Dispositionstool:** Auftrag erscheint
- **Vercel Logs:** Keine Fehler

### ❌ Bei Problemen:
- **Health-Check fehlschlägt:** ENV-Variable falsch
- **Migration-Fehler:** Build-Command nicht gesetzt
- **Formular-Fehler:** Prisma/Neon-Verbindung kaputt

## 🛠️ Debugging

### 1. Vercel Function Logs prüfen:
- Vercel Dashboard → Functions → Logs
- Nach `[prisma_health_` oder `[health_` suchen

### 2. Browser-Konsole prüfen:
- F12 → Console
- Nach `Using neon API` oder `Using prisma API` suchen

### 3. SQL-Checks in Neon:
```sql
-- Prüfe Tabellen
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Prüfe Orders
SELECT id, status, created_at FROM "Order" ORDER BY id DESC LIMIT 5;

-- Prüfe Sequences
SELECT * FROM order_numbers ORDER BY id DESC LIMIT 5;
SELECT * FROM invoice_numbers ORDER BY id DESC LIMIT 5;
```

## 🎯 Nächste Schritte

1. **Passwort in Neon rotieren**
2. **Zwei ENV-Variablen in Vercel setzen**
3. **Build-Command auf `npm run vercel-build` ändern**
4. **Re-Deploy auslösen**
5. **Health-Checks testen**
6. **Kontaktformular testen**

**Das Problem sollte damit vollständig gelöst sein!** 🎉

---

**Letzte Aktualisierung:** $(date)
**Status:** ✅ Implementiert, bereit für Vercel-Setup
