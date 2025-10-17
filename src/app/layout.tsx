import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Fahrzeugüberführung Deutschland | Abdullahu Drive Solutions | #1 Service',
  description: '🚗 Professionelle Fahrzeugüberführung in ganz Deutschland! Vollversichert, termintreu & transparent. Über 10 Jahre Erfahrung. Jetzt kostenloses Angebot anfordern!',
  keywords: 'Fahrzeugüberführung, Auto transport Deutschland, Fahrzeugtransport, Auto überführen, Fahrzeug abholen, Auto zustellen, Wuppertal, NRW, Deutschland, Abdullahu Drive Solutions, professionell, versichert, termintreu',
  authors: [{ name: 'Abdullahu Drive Solutions' }],
  creator: 'Abdullahu Drive Solutions',
  publisher: 'Abdullahu Drive Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://abdullahu-drive-solutions.de'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fahrzeugüberführung Deutschland | Abdullahu Drive Solutions | #1 Service',
    description: '🚗 Professionelle Fahrzeugüberführung in ganz Deutschland! Vollversichert, termintreu & transparent. Über 10 Jahre Erfahrung.',
    url: 'https://abdullahu-drive-solutions.de',
    siteName: 'Abdullahu Drive Solutions',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Abdullahu Drive Solutions - Professionelle Fahrzeugüberführung Deutschland',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fahrzeugüberführung Deutschland | Abdullahu Drive Solutions | #1 Service',
    description: '🚗 Professionelle Fahrzeugüberführung in ganz Deutschland! Vollversichert, termintreu & transparent.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'google-site-verification': 'your-google-verification-code',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0C2A3A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://abdullahu-drive-solutions.de/#organization',
              name: 'Abdullahu Drive Solutions',
              alternateName: 'ADS Fahrzeugüberführung',
              description: 'Professionelle Fahrzeugüberführung in ganz Deutschland. Vollversichert, termintreu und transparent.',
              url: 'https://abdullahu-drive-solutions.de',
              logo: {
                '@type': 'ImageObject',
                url: 'https://abdullahu-drive-solutions.de/logo.png',
                width: 300,
                height: 300
              },
              image: 'https://abdullahu-drive-solutions.de/logo.png',
              telephone: '+49 160 4245116',
              email: 'info@abdullahu-drive.de',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Alhausstraße 35',
                postalCode: '42281',
                addressLocality: 'Wuppertal',
                addressRegion: 'NRW',
                addressCountry: 'DE'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '51.2562',
                longitude: '7.1508'
              },
              openingHours: 'Mo-Fr 08:00-18:00',
              priceRange: '€€',
              serviceArea: {
                '@type': 'Country',
                name: 'Deutschland'
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Fahrzeugüberführung Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Fahrzeugüberführung Deutschland',
                      description: 'Professionelle Abholung und Zustellung von Fahrzeugen in ganz Deutschland'
                    }
                  }
                ]
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
                bestRating: '5',
                worstRating: '1'
              },
              sameAs: [],
              foundingDate: '2014',
              numberOfEmployees: '5-10',
              slogan: 'Sicher & zuverlässig von A nach B'
            })
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-white text-navy-600 px-4 py-2 rounded">Zum Inhalt springen</a>
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}` }} />
        <GoogleAnalytics measurementId="G-R7VFWEVBPQ" />
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}