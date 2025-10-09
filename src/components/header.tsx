'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// removed animated title; using static logo again
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      // Sanftere Animation basierend auf Scroll-Position
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Startseite', href: '/' },
    { name: 'Leistungen', href: '/leistungen' },
    { name: 'Über uns', href: '/ueber-uns' },
    { name: 'Referenzen', href: '/referenzen' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontakt', href: '/kontakt' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-white/40 backdrop-blur-xl shadow-xl border-b border-white/10' 
        : 'bg-white/80 backdrop-blur-sm shadow-md'
    }`}>

      {/* Main Navigation */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="p-6 bg-navy-50 rounded-xl group-hover:bg-navy-100 transition-colors">
              <Image
                src="/logo.png"
                alt="Abdullahu Drive Solutions"
                width={160}
                height={160}
                className="h-40 w-auto"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-navy-600 group-hover:text-navy-700 transition-colors">Abdullahu Drive Solutions</h1>
              <p className="text-base text-gray-600">Fahrzeugüberführungen</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1" aria-label="Hauptnavigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link text-gray-700 hover:text-navy-600 hover:bg-navy-50 px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn btn-primary">
              <Link href="/kontakt">Anfrage starten</Link>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-navy-50"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-navy-600" /> : <Menu className="h-6 w-6 text-navy-600" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-6 py-4 text-lg font-medium text-gray-700 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <button className="btn btn-primary w-full">
                <Link href="/kontakt">Anfrage starten</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
