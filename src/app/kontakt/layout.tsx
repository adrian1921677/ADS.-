import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Kontakt | Abdullahu Drive Solutions',
  description: 'Stellen Sie Ihre Anfrage – wir melden uns schnell mit einem individuellen Angebot für die Abholung und Zustellung Ihres Fahrzeugs in Deutschland.',
}

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


