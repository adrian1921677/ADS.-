import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Informationen zum Umgang mit Ihren personenbezogenen Daten
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">1. Datenschutz auf einen Blick</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Allgemeine Hinweise</h4>
                  <p className="text-neutral-600 text-sm">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Datenerfassung auf dieser Website</h4>
                  <p className="text-neutral-600 text-sm">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt &ldquo;Hinweis zur Verantwortlichen Stelle&rdquo; in dieser Datenschutzerklärung entnehmen.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsible Party */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">2. Verantwortliche Stelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-neutral-600">Abdullahu Drive Solutions</p>
                  <p className="text-neutral-600">Musterstraße 123</p>
                  <p className="text-neutral-600">12345 Musterstadt</p>
                  <p className="text-neutral-600">Deutschland</p>
                  <br />
                  <p className="text-neutral-600">Telefon: +49 20287021547</p>
                  <p className="text-neutral-600">E-Mail: info@abdullahu-drive-solutions.de</p>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">3. Datenerfassung auf dieser Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Server-Log-Dateien</h4>
                  <p className="text-neutral-600 text-sm">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                  </p>
                  <ul className="list-disc list-inside text-neutral-600 text-sm mt-2 space-y-1">
                    <li>Browsertyp und Browserversion</li>
                    <li>verwendetes Betriebssystem</li>
                    <li>Referrer URL</li>
                    <li>Hostname des zugreifenden Rechners</li>
                    <li>Uhrzeit der Serveranfrage</li>
                    <li>IP-Adresse</li>
                  </ul>
                  <p className="text-neutral-600 text-sm mt-2">
                    Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Kontaktformular</h4>
                  <p className="text-neutral-600 text-sm">
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Processing Purposes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">4. Zweck der Datenverarbeitung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Kontaktaufnahme</h4>
                  <p className="text-neutral-600 text-sm">
                    Wir verarbeiten Ihre personenbezogenen Daten zur Bearbeitung Ihrer Anfragen und zur Bereitstellung unserer Dienstleistungen. Dies umfasst die Kommunikation bezüglich Fahrzeugüberführungen, die Erstellung von Angeboten und die Koordination von Terminen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Vertragserfüllung</h4>
                  <p className="text-neutral-600 text-sm">
                    Zur Erfüllung unserer vertraglichen Verpflichtungen verarbeiten wir Ihre Daten für die Durchführung von Fahrzeugüberführungen, die Abwicklung von Zahlungen und die Bereitstellung von Zusatzleistungen wie dem Zulassungsservice.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">5. Rechtsgrundlage der Verarbeitung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Art. 6 Abs. 1 lit. b DSGVO</h4>
                  <p className="text-neutral-600 text-sm">
                    Die Verarbeitung erfolgt zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Art. 6 Abs. 1 lit. f DSGVO</h4>
                  <p className="text-neutral-600 text-sm">
                    Die Verarbeitung erfolgt zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Art. 6 Abs. 1 lit. a DSGVO</h4>
                  <p className="text-neutral-600 text-sm">
                    Die Verarbeitung erfolgt mit Einwilligung des Betroffenen.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Storage Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">6. Speicherdauer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung der Zwecke erforderlich ist, für die sie erhoben wurden, oder solange gesetzliche Aufbewahrungsfristen bestehen. Nach Ablauf der Speicherfrist werden die Daten gelöscht, es sei denn, eine weitere Speicherung ist gesetzlich vorgeschrieben.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">7. Ihre Rechte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Auskunftsrecht (Art. 15 DSGVO)</h4>
                  <p className="text-neutral-600 text-sm">
                    Sie haben das Recht, Auskunft über die von uns verarbeiteten personenbezogenen Daten zu verlangen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Berichtigungsrecht (Art. 16 DSGVO)</h4>
                  <p className="text-neutral-600 text-sm">
                    Sie haben das Recht auf Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Löschungsrecht (Art. 17 DSGVO)</h4>
                  <p className="text-neutral-600 text-sm">
                    Sie haben das Recht auf Löschung Ihrer personenbezogenen Daten.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h4>
                  <p className="text-neutral-600 text-sm">
                    Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten zu widersprechen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Beschwerderecht (Art. 77 DSGVO)</h4>
                  <p className="text-neutral-600 text-sm">
                    Sie haben das Recht, sich bei einer Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">8. Datensicherheit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
                </p>
              </CardContent>
            </Card>

            {/* Contact for Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">9. Kontakt bei datenschutzrechtlichen Fragen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an:
                </p>
                <div className="mt-4 space-y-1">
                  <p className="text-neutral-600">E-Mail: datenschutz@abdullahu-drive-solutions.de</p>
                  <p className="text-neutral-600">Telefon: +49 20287021547</p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">10. Änderungen dieser Datenschutzerklärung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um sie an geänderte Rechtslagen oder bei Änderungen unserer Dienstleistungen sowie der Datenverarbeitung anzupassen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
