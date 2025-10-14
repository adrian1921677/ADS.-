# Disposition - Auftragsverwaltung

Die Disposition-Seite wurde erweitert, um Aufträge direkt in der Neon-Datenbank zu speichern und zu verwalten.

## 🚀 Neue Funktionen

### 1. Auftrag erstellen
- **Button**: "Auftrag erstellen" in der Toolbar
- **Formular**: Vollständiges Formular für alle Auftragsdaten
- **Speicherung**: Direkt in der Neon-Datenbank

### 2. Status-Management
- **Annehmen**: Auftrag wird angenommen
- **Ablehnen**: Auftrag wird abgelehnt
- **Planen**: Auftrag wird geplant
- **Warten**: Auftrag wartet auf weitere Aktionen
- **Unterwegs**: Fahrer ist unterwegs
- **Erledigt**: Auftrag ist abgeschlossen

### 3. Datenbank-Integration
- **Automatische Speicherung**: Alle Änderungen werden sofort in der Datenbank gespeichert
- **Echtzeit-Updates**: Status-Änderungen werden sofort reflektiert
- **Persistente Daten**: Alle Aufträge bleiben dauerhaft gespeichert

## 📋 Auftragsformular

Das neue Auftragsformular erfasst folgende Daten:

### Kunde
- Name (erforderlich)
- Telefon (erforderlich)
- E-Mail (optional)

### Fahrzeug
- Marke (erforderlich)
- Modell (erforderlich)
- Kennzeichen (erforderlich)
- VIN (optional)
- Baujahr (optional)

### Abholung
- Straße (erforderlich)
- Hausnummer (erforderlich)
- PLZ (erforderlich)
- Stadt (erforderlich)
- Datum (erforderlich)
- Uhrzeit (erforderlich)

### Ziel
- Straße (erforderlich)
- Hausnummer (erforderlich)
- PLZ (erforderlich)
- Stadt (erforderlich)
- Datum (erforderlich)
- Uhrzeit (erforderlich)

### Zusätzlich
- Notizen (optional)

## 🔄 Workflow

1. **Neuer Auftrag**: Klicken Sie auf "Auftrag erstellen"
2. **Daten eingeben**: Füllen Sie das Formular aus
3. **Speichern**: Auftrag wird automatisch in der Datenbank gespeichert
4. **Status verwalten**: Verwenden Sie die Aktions-Buttons für Status-Änderungen
5. **Verfolgen**: Alle Änderungen werden in Echtzeit angezeigt

## 📊 Status-Übersicht

| Status | Beschreibung | Farbe |
|--------|-------------|-------|
| neu | Neuer Auftrag | Blau |
| angenommen | Auftrag angenommen | Grün |
| abgelehnt | Auftrag abgelehnt | Rot |
| geplant | Auftrag geplant | Blau |
| wartend | Auftrag wartet | Gelb |
| unterwegs | Fahrer unterwegs | Lila |
| erledigt | Auftrag erledigt | Grau |

## 🛠️ Technische Details

### API-Endpunkte
- `POST /api/orders` - Neuen Auftrag erstellen
- `GET /api/orders` - Alle Aufträge abrufen
- `PATCH /api/orders/[id]` - Auftrag aktualisieren

### Datenbank-Schema
- **orders**: Haupttabelle für Aufträge
- **order_numbers**: Sequenznummern für Bestellnummern
- **invoice_numbers**: Sequenznummern für Rechnungsnummern

### Automatische Nummerierung
- **Bestellnummern**: A-YYYY-NNNNN (z.B. A-2024-00001)
- **Rechnungsnummern**: ADS-YYYY-NNNNN (z.B. ADS-2024-00001)

## 🔧 Setup

1. **Umgebungsvariablen**: Stellen Sie sicher, dass `DATABASE_URL` in `.env.local` gesetzt ist
2. **Datenbank-Schema**: Führen Sie `npm run db:push` aus
3. **Daten migrieren**: Führen Sie `npm run db:migrate-data` aus
4. **Anwendung starten**: Führen Sie `npm run dev` aus

## 📱 Verwendung

1. Öffnen Sie die Disposition-Seite
2. Klicken Sie auf "Auftrag erstellen"
3. Füllen Sie das Formular aus
4. Klicken Sie auf "Auftrag erstellen"
5. Der Auftrag wird automatisch gespeichert und angezeigt
6. Verwenden Sie die Aktions-Buttons für Status-Änderungen

## 🎯 Vorteile

- **Zentrale Speicherung**: Alle Aufträge in einer Datenbank
- **Echtzeit-Updates**: Sofortige Synchronisation
- **Automatische Nummerierung**: Keine manuellen Nummern
- **Status-Tracking**: Vollständige Nachverfolgung
- **Skalierbarkeit**: Unterstützt viele gleichzeitige Benutzer
- **Datenintegrität**: Sichere und konsistente Daten
