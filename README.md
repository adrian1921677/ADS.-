# Abdullahu Drive Solutions Website

Eine moderne, responsive Website für Abdullahu Drive Solutions - ein Familienunternehmen für Fahrzeugüberführungen.

## 🚗 Über das Projekt

Diese Website wurde mit Next.js 14, TypeScript, Tailwind CSS und shadcn/ui erstellt. Sie bietet eine vollständige Online-Präsenz für das Fahrzeugüberführungsunternehmen mit allen notwendigen Funktionen für Kundenanfragen und Informationsbereitstellung.

## ✨ Features

- **Responsive Design**: Optimiert für alle Geräte (Desktop, Tablet, Mobile)
- **Moderne UI**: Sauberes, professionelles Design mit shadcn/ui Komponenten
- **DSGVO-konform**: Vollständige Datenschutzerklärung und Impressum
- **SEO-optimiert**: Meta-Tags, Schema.org Markup, Sitemap
- **Barrierefreiheit**: WCAG-konforme Navigation und Interaktionen
- **Performance**: Optimierte Bilder und schnelle Ladezeiten
- **Kontaktformular**: Mit Validierung und DSGVO-Einwilligung

## 🛠️ Technologie-Stack

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **UI-Komponenten**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Formulare**: React Hook Form + Zod
- **Deployment**: Vercel (empfohlen)

## 🚀 Installation & Entwicklung

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd abdullahu-drive-solutions

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Website ist dann unter `http://localhost:3000` erreichbar.

### Verfügbare Scripts

```bash
# Entwicklungsserver
npm run dev

# Produktions-Build
npm run build

# Produktions-Server
npm start

# Linting
npm run lint

# Type-Checking
npm run type-check
```

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globale Styles
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Startseite
│   ├── leistungen/        # Leistungsseite
│   ├── ueber-uns/         # Über uns Seite
│   ├── referenzen/        # Referenzen Seite
│   ├── faq/               # FAQ Seite
│   ├── kontakt/           # Kontaktseite
│   ├── impressum/         # Impressum
│   └── datenschutz/       # Datenschutzerklärung
├── components/            # React Komponenten
│   ├── ui/               # UI-Komponenten (shadcn/ui)
│   ├── header.tsx        # Header-Komponente
│   └── footer.tsx        # Footer-Komponente
└── lib/                  # Utilities
    ├── utils.ts          # Helper-Funktionen
    └── design-tokens.ts  # Design-System
```

## 🎨 Design-System

### Farben

- **Primary**: Navy (#0C2A3A) - Hauptfarbe
- **Accent**: Rot (#E23D3D) - Akzentfarbe  
- **Neutral**: Grautöne für Text und Hintergründe

### Typografie

- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)

### Komponenten

Alle UI-Komponenten basieren auf shadcn/ui und sind vollständig anpassbar.

## 📱 Seiten

1. **Startseite** (`/`) - Hero, Services, Prozess, Testimonials
2. **Leistungen** (`/leistungen`) - Detaillierte Service-Übersicht
3. **Über uns** (`/ueber-uns`) - Firmengeschichte, Team, Werte
4. **Referenzen** (`/referenzen`) - Kundenstimmen und Erfolge
5. **FAQ** (`/faq`) - Häufige Fragen und Antworten
6. **Kontakt** (`/kontakt`) - Kontaktformular und Informationen
7. **Impressum** (`/impressum`) - Rechtliche Angaben
8. **Datenschutz** (`/datenschutz`) - DSGVO-konforme Datenschutzerklärung

## 🔧 Anpassungen

### Inhalte ändern

Die meisten Inhalte können direkt in den entsprechenden Seiten-Dateien geändert werden:

- `src/app/page.tsx` - Startseite
- `src/app/leistungen/page.tsx` - Leistungen
- `src/app/ueber-uns/page.tsx` - Über uns
- etc.

### Design anpassen

- **Farben**: `tailwind.config.ts` und `src/lib/design-tokens.ts`
- **Komponenten**: `src/components/ui/`
- **Globale Styles**: `src/app/globals.css`

### Kontaktdaten aktualisieren

Kontaktdaten sind in mehreren Dateien zu finden:

- `src/components/header.tsx`
- `src/components/footer.tsx`
- `src/app/impressum/page.tsx`
- `src/app/datenschutz/page.tsx`

## 🚀 Deployment

### Vercel (Empfohlen)

1. Repository zu GitHub/GitLab pushen
2. Vercel-Account erstellen
3. Projekt importieren
4. Automatisches Deployment bei jedem Push

### Andere Hosting-Anbieter

```bash
# Build erstellen
npm run build

# Build-Ordner deployen
# (dist/ Ordner auf Ihren Server hochladen)
```

## 📊 SEO & Performance

- **Meta-Tags**: Vollständig konfiguriert
- **Schema.org**: LocalBusiness Markup
- **Sitemap**: Automatisch generiert
- **Robots.txt**: SEO-optimiert
- **Performance**: Lighthouse-Score > 90

## 🔒 DSGVO & Rechtliches

- Vollständige Datenschutzerklärung
- Impressum nach deutschem Recht
- DSGVO-konforme Kontaktformulare
- Cookie-Banner (falls erforderlich)

## 📞 Support

Bei Fragen oder Problemen:

- E-Mail: info@abdullahu-drive-solutions.de
- Telefon: +49 (0) 123 456 789

## 📄 Lizenz

© 2024 Abdullahu Drive Solutions. Alle Rechte vorbehalten.

---

**Entwickelt mit ❤️ für Abdullahu Drive Solutions**