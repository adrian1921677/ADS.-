'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, RefreshCcw, FileText, Search } from 'lucide-react'
import OrderForm from '@/components/OrderForm'

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  payload: any;
}

export default function DispositionPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [showDatabaseView, setShowDatabaseView] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

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
    console.log('Disposition Filter Debug:', {
      totalOrders: orders.length,
      statusFilter: filters.statusFilter,
      query: filters.query,
      orderStatuses: orders.map(o => ({ id: o.id, status: o.status, createdAt: o.createdAt }))
    })

    const filtered = orders.filter(order => {
      const matchesQuery = !filters.query || 
        order.id.toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.customer?.name || '').toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.vehicle?.make || '').toLowerCase().includes(filters.query.toLowerCase()) ||
        (order.payload?.vehicle?.model || '').toLowerCase().includes(filters.query.toLowerCase())
      
      const matchesStatus = !filters.statusFilter || order.status === filters.statusFilter
      
      const matches = matchesQuery && matchesStatus
      
      if (!matches && filters.statusFilter) {
        console.log(`Order ${order.id} filtered out:`, {
          status: order.status,
          expectedStatus: filters.statusFilter,
          matchesQuery,
          matchesStatus
        })
      }
      
      return matches
    })

    console.log('Filtered orders:', {
      before: orders.length,
      after: filtered.length,
      filteredIds: filtered.map(o => o.id)
    })

    return filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      return bTime - aTime // Neueste zuerst
    })
  }

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev])
    setShowOrderForm(false)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await refreshOrders()
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disposition</h1>
          <p className="text-gray-600">Verwalte deine Fahrzeugüberführungen</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading ? 'Lade...' : showDatabaseView ? `Datenbank: ${orders.length} Aufträge (alle)` : `${orders.length} Aufträge`}
              {statusFilter && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Filter: {statusFilter}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshOrders} title="Aktualisieren">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowOrderForm(true)}>
                <Plus className="h-4 w-4 mr-2" />Auftrag erstellen
              </Button>
              <Button variant="secondary" disabled>
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
          
          {/* Debug Panel */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Debug Info:</strong> {orders.length} Aufträge geladen | 
            Status-Filter: {statusFilter || 'keiner'} | 
            Suche: {query || 'keine'} | 
            Letzte Aktualisierung: {new Date().toLocaleTimeString()}
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
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'angenommen')}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          ✓ Annehmen
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'abgelehnt')}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          ✗ Ablehnen
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'geplant')}
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          📅 Planen
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'wartend')}
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          ⏳ Warten
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'unterwegs')}
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-purple-500 text-purple-600 hover:bg-purple-50"
                        >
                          🚗 Unterwegs
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'erledigt')}
                          variant="outline" 
                          className="flex items-center justify-center gap-2 px-4 py-3 border-gray-500 text-gray-600 hover:bg-gray-50"
                        >
                          ✅ Erledigt
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

        {/* Order Form Modal */}
        {showOrderForm && (
          <OrderForm 
            onClose={() => setShowOrderForm(false)} 
            onOrderCreated={handleOrderCreated}
          />
        )}
      </div>
    </div>
  )
}