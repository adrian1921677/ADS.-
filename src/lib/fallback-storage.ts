// Fallback-Speicherung für den Fall, dass die Datenbank nicht verfügbar ist
export interface FallbackOrder {
  id: string
  createdAt: string
  status: string
  payload: Record<string, unknown>
}

export function saveOrderToFallback(order: FallbackOrder): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingOrders = getOrdersFromFallback()
    const updatedOrders = [order, ...existingOrders]
    localStorage.setItem('fallback_orders', JSON.stringify(updatedOrders))
  } catch (error) {
    console.error('Fehler beim Speichern in Fallback-Storage:', error)
  }
}

export function getOrdersFromFallback(): FallbackOrder[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('fallback_orders')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Fehler beim Laden aus Fallback-Storage:', error)
    return []
  }
}

export function clearFallbackOrders(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('fallback_orders')
  } catch (error) {
    console.error('Fehler beim Löschen der Fallback-Orders:', error)
  }
}
