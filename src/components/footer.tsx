import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0C2A3A] to-[#102538] text-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <Image
                  src="/logo.png"
                  alt="Abdullahu Drive Solutions"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Abdullahu Drive Solutions</h3>
                <p className="text-gray-300">Fahrzeugüberführungen</p>
              </div>
            </div>
            <p className="text-gray-200 mb-8 max-w-md leading-relaxed">
              Familiengeführt, zuverlässig und transparent – wir bringen Ihr Fahrzeug 
              sicher von A nach B. Deutschlandweit.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Phone className="h-4 w-4 text-red-400" />
                </div>
                <span className="font-medium text-white">+49 20287021547</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Mail className="h-4 w-4 text-red-400" />
                </div>
                <span className="font-medium text-white">info@abdullahu-drive-solutions.de</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <MapPin className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-white">Musterstraße 123, 12345 Musterstadt</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Clock className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-white">Mo-Fr: 8:00-18:00, Sa: 9:00-14:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Schnellzugriff</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/leistungen" className="text-gray-200 hover:text-red-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  Leistungen
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="text-gray-200 hover:text-red-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/referenzen" className="text-gray-200 hover:text-red-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  Referenzen
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-200 hover:text-red-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-200 hover:text-red-400 transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:bg-red-400 transition-colors"></span>
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Unsere Leistungen</h4>
            <ul className="space-y-3">
              <li className="text-gray-200 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                Fahrzeugüberführung Deutschland
              </li>
              <li className="text-gray-200 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                Deutschlandweite Abholung
              </li>
              <li className="text-gray-200 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                Zulassungsservice
              </li>
              <li className="text-gray-200 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                Abhol- & Zustellservice
              </li>
              <li className="text-gray-200 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                Versicherungsschutz
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-500/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-200 text-sm">
              © 2024 Abdullahu Drive Solutions. Alle Rechte vorbehalten.
            </div>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="/impressum" className="text-gray-200 hover:text-red-400 text-sm transition-colors duration-200">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-gray-200 hover:text-red-400 text-sm transition-colors duration-200">
                Datenschutz
              </Link>
              <Link href="/disposition" className="text-gray-200 hover:text-red-400 text-sm transition-colors duration-200">
                Disposition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
