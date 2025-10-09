import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abdullahu Drive Solutions - Fahrzeugüberführungen sicher & zuverlässig',
  description: 'Familiengeführt, zuverlässig und transparent – wir bringen Ihr Fahrzeug sicher von A nach B. Deutschlandweit mit vollständiger Versicherung.',
  keywords: 'Fahrzeugüberführung, Auto transport, Deutschland, Zulassungsservice, Abdullahu Drive Solutions',
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
    title: 'Abdullahu Drive Solutions - Fahrzeugüberführungen sicher & zuverlässig',
    description: 'Familiengeführt, zuverlässig und transparent – wir bringen Ihr Fahrzeug sicher von A nach B. Deutschlandweit.',
    url: 'https://abdullahu-drive-solutions.de',
    siteName: 'Abdullahu Drive Solutions',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Abdullahu Drive Solutions Logo',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdullahu Drive Solutions - Fahrzeugüberführungen sicher & zuverlässig',
    description: 'Familiengeführt, zuverlässig und transparent – wir bringen Ihr Fahrzeug sicher von A nach B.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0C2A3A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Abdullahu Drive Solutions',
              url: 'https://abdullahu-drive-solutions.de',
              logo: 'https://abdullahu-drive-solutions.de/logo.png',
              sameAs: []
            })
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-white text-navy-600 px-4 py-2 rounded">Zum Inhalt springen</a>
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}` }} />
        {children}
      </body>
    </html>
  )
}