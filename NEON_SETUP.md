# Neon-Datenbank Setup

Diese Anleitung führt Sie durch die Einrichtung der Neon-Datenbank für das Abdullahu Drive Solutions Projekt.

## 1. Neon-Datenbank konfigurieren

### Umgebungsvariablen einrichten

Erstellen Sie eine `.env.local` Datei im Projektverzeichnis mit Ihren Neon-Datenbank-Credentials:

```env
# Neon Database Configuration
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/ads_database?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/ads_database?sslmode=require"

# Für Drizzle ORM
PGHOST="ep-xxxxx.us-east-1.aws.neon.tech"
PGDATABASE="ads_database"
PGUSER="username"
PGPASSWORD="password"
PGPORT="5432"
```

**Wichtige Hinweise:**
- Ersetzen Sie `username`, `password` und `ep-xxxxx` mit Ihren tatsächlichen Neon-Credentials
- Die `DATABASE_URL` sollte die gepoolte Verbindung verwenden
- Die `DATABASE_URL_UNPOOLED` sollte die ungepoolte Verbindung für Migrationen verwenden

## 2. Datenbankschema erstellen

### Option A: Mit Drizzle Push (empfohlen für Entwicklung)
```bash
npm run db:push
```

### Option B: Mit Drizzle Migrate (für Produktion)
```bash
# Generiere Migrationen
npm run db:generate

# Führe Migrationen aus
npm run db:migrate
```

## 3. Bestehende Daten migrieren

Führen Sie das Migrationsskript aus, um bestehende JSON-Daten in die Neon-Datenbank zu übertragen:

```bash
npm run db:migrate-data
```

## 4. Projekt starten

```bash
npm run dev
```

## Datenbankschema

Das Schema umfasst folgende Tabellen:

### Orders
- `id` (TEXT, PRIMARY KEY)
- `created_at` (TIMESTAMP)
- `status` (VARCHAR)
- `wait_reason` (TEXT)
- `driver` (TEXT)
- `internal_notes` (TEXT)
- `order_number` (VARCHAR)
- `invoice_number` (VARCHAR)
- `payload` (JSONB)
- `attachments` (JSONB)

### Invoices
- `id` (TEXT, PRIMARY KEY)
- `created_at` (TIMESTAMP)
- `invoice_number` (VARCHAR)
- `customer` (JSONB)
- `items` (JSONB)
- `net_amount` (NUMERIC)
- `vat_percent` (NUMERIC)
- `vat_amount` (NUMERIC)
- `total_amount` (NUMERIC)

### Sequenznummern-Tabellen
- `order_numbers` - Verwaltet Bestellnummern-Sequenzen
- `invoice_numbers` - Verwaltet Rechnungsnummern-Sequenzen

## API-Endpunkte

Die folgenden API-Endpunkte wurden für die Neon-Datenbank aktualisiert:

- `GET /api/orders` - Alle Aufträge abrufen
- `POST /api/orders` - Neuen Auftrag erstellen
- `PATCH /api/orders/[id]` - Auftrag aktualisieren
- `GET /api/invoices/next-number` - Nächste Rechnungsnummer generieren

## Fehlerbehebung

### Verbindungsfehler
- Überprüfen Sie Ihre `DATABASE_URL` in der `.env.local`
- Stellen Sie sicher, dass Ihre Neon-Datenbank läuft
- Überprüfen Sie die Firewall-Einstellungen

### Migration-Fehler
- Stellen Sie sicher, dass die Datenbank-Tabellen existieren
- Überprüfen Sie die JSON-Dateien im `data/` Verzeichnis
- Führen Sie `npm run db:push` aus, um das Schema zu erstellen

## Nützliche Befehle

```bash
# Datenbank-Schema pushen
npm run db:push

# Migrationen generieren
npm run db:generate

# Migrationen ausführen
npm run db:migrate

# Daten migrieren
npm run db:migrate-data

# Entwicklungsserver starten
npm run dev
```



