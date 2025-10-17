import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Impressum
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Angaben gemäß § 5 TMG
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Anbieter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Abdullahu Drive Solutions</h3>
                  <p className="text-neutral-600">Fahrzeugüberführungen</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Anschrift:</h4>
                  <p className="text-neutral-600">
                    Alhausstraße 35<br />
                    42281 Wuppertal<br />
                    Deutschland
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Kontakt:</h4>
                  <p className="text-neutral-600">
                    Telefon: +49 160 4245116<br />
                    E-Mail: info@abdullahu-drive.de
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Rechtliche Angaben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Vertretungsberechtigte Geschäftsführer:</h4>
                  <p className="text-neutral-600">Ahmed Abdullahu</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Handelsregister:</h4>
                  <p className="text-neutral-600">
                    Registergericht: Amtsgericht Musterstadt<br />
                    Registernummer: HRB 12345
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Umsatzsteuer-ID:</h4>
                  <p className="text-neutral-600">
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:<br />
                    DE123456789
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Berufsbezeichnung:</h4>
                  <p className="text-neutral-600">
                    Fahrzeugüberführung<br />
                    Verliehen in: Deutschland
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsible for Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Ahmed Abdullahu<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Haftungsausschluss</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Haftung für Inhalte</h4>
                  <p className="text-neutral-600 text-sm">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Haftung für Links</h4>
                  <p className="text-neutral-600 text-sm">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Urheberrecht</h4>
                  <p className="text-neutral-600 text-sm">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Online Dispute Resolution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Online-Streitbeilegung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a href="https://ec.europa.eu/consumers/odr/" className="text-primary-600 hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <br /><br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.<br /><br />
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
