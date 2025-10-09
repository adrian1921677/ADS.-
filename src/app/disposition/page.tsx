'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, RefreshCcw, FileText, Search, Lock } from 'lucide-react'

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  payload: any;
}

export default function DispositionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [showDatabaseView, setShowDatabaseView] = useState(false)
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)

  const CORRECT_PASSWORD = 'ADS'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
      // Speichere Authentifizierung in sessionStorage
      sessionStorage.setItem('disposition_authenticated', 'true')
    } else {
      setLoginError('Falsches Passwort. Bitte versuchen Sie es erneut.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    sessionStorage.removeItem('disposition_authenticated')
  }

  // Prüfe beim Laden der Seite, ob bereits authentifiziert
  useEffect(() => {
    const isAuth = sessionStorage.getItem('disposition_authenticated') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  async function refreshOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fehler beim Laden der Aufträge:', error)
      setOrders([])
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshOrders()
  }, [])

  function toggleOrderExpansion(orderId: string) {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  function applySortFilter(orders: Order[], filters: { query: string; statusFilter: string; sortKey: string; sortDir: string }) {
    const filtered = orders.filter(order => {
      const matchesQuery = !filters.query || 
        order.id.toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.customer?.name || '').toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.vehicle?.make || '').toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.vehicle?.model || '').toLowerCase().includes(filters.query.toLowerCase())
      
      const matchesStatus = !filters.statusFilter || order.status === filters.statusFilter
      
      return matchesQuery && matchesStatus
    })

    return filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      return bTime - aTime // Neueste zuerst
    })
  }

  // Login-Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Disposition</h2>
            <p className="mt-2 text-sm text-gray-600">
              Bitte geben Sie das Passwort ein, um fortzufahren
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anmelden
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Disposition</h1>
            <p className="text-gray-600">Verwalte deine Fahrzeugüberführungen</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Abmelden
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading ? 'Lade...' : showDatabaseView ? `Datenbank: ${orders.length} Aufträge (alle)` : `${orders.length} Aufträge`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshOrders} title="Aktualisieren">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowCreateOrder(true)}>
                <Plus className="h-4 w-4 mr-2" />Auftrag erstellen
              </Button>
              <Button variant="secondary" onClick={() => setShowCreateInvoice(true)}>
                <FileText className="h-4 w-4 mr-2" /> Rechnung erstellen
              </Button>
              <Button 
                onClick={() => setShowDatabaseView(!showDatabaseView)} 
                variant="outline"
                className={`${showDatabaseView ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'}`}
              >
                📊 {showDatabaseView ? 'Aktive Ansicht' : 'Datenbank'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Suche nach Auftrag, Kunde oder Fahrzeug..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className={`border rounded px-3 py-2 text-sm w-full md:w-48 ${showDatabaseView ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={showDatabaseView}
            >
              <option value="">{showDatabaseView ? 'Alle Aufträge (Datenbank)' : 'Status: alle'}</option>
              <option value="neu">neu</option>
              <option value="geplant">geplant</option>
              <option value="unterwegs">unterwegs</option>
              <option value="erledigt">erledigt</option>
              <option value="problem">problem</option>
              <option value="wartend">wartend</option>
              <option value="angenommen">angenommen</option>
              <option value="abgelehnt">abgelehnt</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {applySortFilter(orders, { query, statusFilter: showDatabaseView ? '' : statusFilter, sortKey: '', sortDir: '' }).map((order) => {
            const isExpanded = expandedOrders.has(order.id)
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Kompakte Ansicht */}
                <div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/70 transition-colors">
                        <svg 
                          className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Auftrag #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })} 
                          {new Date(order.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{(order.payload as any)?.customer?.name || 'Unbekannt'}</p>
                        <p className="text-sm text-gray-600">{(order.payload as any)?.vehicle?.make || ''} {(order.payload as any)?.vehicle?.model || ''}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (order.status as string) === 'angenommen' ? 'bg-green-100 text-green-800 border border-green-200' :
                        (order.status as string) === 'abgelehnt' ? 'bg-red-100 text-red-800 border border-red-200' :
                        (order.status as string) === 'wartend' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        (order.status as string) === 'erledigt' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                        (order.status as string) === 'abgeschlossen' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {order.status}
                      </span>
                      {(order.payload as any)?.invoiceNumber && (
                        <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          {(order.payload as any).invoiceNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Erweiterte Ansicht */}
                {isExpanded && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Kunde
                        </h4>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">{(order.payload as any)?.customer?.name || 'Unbekannt'}</p>
                          <p className="text-gray-600">{(order.payload as any)?.customer?.phone || 'Unbekannt'}</p>
                          {(order.payload as any)?.customer?.email && (
                            <p className="text-blue-600 font-medium">{(order.payload as any).customer.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Fahrzeug
                        </h4>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">{(order.payload as any)?.vehicle?.make || ''} {(order.payload as any)?.vehicle?.model || ''}</p>
                          <p className="text-gray-600 font-mono">{(order.payload as any)?.vehicle?.plate || 'Unbekannt'}</p>
                          {(order.payload as any)?.vehicle?.vin && (
                            <p className="text-xs text-gray-500">VIN: {(order.payload as any).vehicle.vin}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-blue-50 rounded-lg p-5">
                        <h4 className="font-semibold text-blue-800 mb-3">📍 Abholung</h4>
                        <p className="text-gray-700">{(order.payload as any)?.pickup?.street || ''} {(order.payload as any)?.pickup?.houseNumber || ''}</p>
                        <p className="text-gray-600">{(order.payload as any)?.pickup?.postalCode || ''} {(order.payload as any)?.pickup?.city || ''}</p>
                        <p className="text-sm text-blue-600 mt-2">
                          {(order.payload as any)?.pickup?.date ? new Date((order.payload as any).pickup.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) : (order.payload as any)?.pickup?.date} um {(order.payload as any)?.pickup?.time || ''}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-5">
                        <h4 className="font-semibold text-green-800 mb-3">🎯 Ziel</h4>
                        <p className="text-gray-700">{(order.payload as any)?.delivery?.street || ''} {(order.payload as any)?.delivery?.houseNumber || ''}</p>
                        <p className="text-gray-600">{(order.payload as any)?.delivery?.postalCode || ''} {(order.payload as any)?.delivery?.city || ''}</p>
                        <p className="text-sm text-green-600 mt-2">
                          {(order.payload as any)?.delivery?.date ? new Date((order.payload as any).delivery.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) : (order.payload as any)?.delivery?.date} um {(order.payload as any)?.delivery?.time || ''}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Aktionen</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a 
                          href={`mailto:${(order.payload as any)?.customer?.email || ''}?subject=Auftrag #${order.id} - Bestätigung&body=Hallo ${(order.payload as any)?.customer?.name || 'Kunde'},%0D%0A%0D%0AIhr Auftrag #${order.id} wurde angenommen und wird bearbeitet.%0D%0A%0D%0AFahrzeug: ${(order.payload as any)?.vehicle?.make || ''} ${(order.payload as any)?.vehicle?.model || ''} (${(order.payload as any)?.vehicle?.plate || ''})%0D%0A%0D%0ABei Fragen stehen wir gerne zur Verfügung.%0D%0A%0D%0AMit freundlichen Grüßen%0D%0ADas Team von Abdullahu Drive Solutions`}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          ✓ Annehmen
                        </a>
                        <a 
                          href={`mailto:${(order.payload as any)?.customer?.email || ''}?subject=Auftrag #${order.id} - Absage&body=Hallo ${(order.payload as any)?.customer?.name || 'Kunde'},%0D%0A%0D%0Aleider können wir Ihren Auftrag #${order.id} nicht annehmen.%0D%0A%0D%0ABei Fragen stehen wir gerne zur Verfügung.%0D%0A%0D%0AMit freundlichen Grüßen%0D%0ADas Team von Abdullahu Drive Solutions`}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          ✗ Ablehnen
                        </a>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          📝 Bearbeiten
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          ⏳ Warten
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {orders.length === 0 && (
            <div className="text-sm text-gray-600">Keine Aufträge vorhanden.</div>
          )}
        </div>
      </div>

      {/* Auftrag erstellen Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Neuen Auftrag erstellen</h3>
            <p className="text-gray-600 mb-4">
              Für die Auftragserstellung verwenden Sie bitte das Kontaktformular. 
              Dort werden alle notwendigen Daten erfasst und automatisch als Auftrag im System gespeichert.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => window.open('/kontakt', '_blank')} className="flex-1">
                Zum Kontaktformular
              </Button>
              <Button variant="outline" onClick={() => setShowCreateOrder(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rechnung erstellen Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Rechnung erstellen</h3>
            <p className="text-gray-600 mb-4">
              Wählen Sie einen Auftrag aus der Liste aus und klicken Sie auf "Rechnung erstellen" 
              um eine Rechnung für diesen Auftrag zu generieren.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Hinweis:</strong> Die Rechnungserstellung ist noch in Entwicklung. 
                  Sie können Aufträge bereits verwalten und deren Status ändern.
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowCreateInvoice(false)} className="w-full">
                Verstanden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}