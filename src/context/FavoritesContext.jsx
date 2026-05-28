import { createContext, useContext, useState, useCallback } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
