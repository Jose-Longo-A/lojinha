import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [toasts, setToasts] = useState([])

  const addItem = useCallback((product, size) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { ...product, size, qty: 1 }]
    })
    showToast(`${product.name} adicionado ao carrinho`)
  }, [])

  const removeItem = useCallback((id, size) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }, [])

  const updateQty = useCallback((id, size, qty) => {
    if (qty < 1) return
    setItems(prev =>
      prev.map(i => (i.id === id && i.size === size ? { ...i, qty } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const showToast = useCallback((message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count, toasts, dismissToast,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
