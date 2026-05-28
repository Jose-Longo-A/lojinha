import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Header from './components/Header'
import Toast from './components/Toast'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Address from './pages/Address'
import Payment from './pages/Payment'
import Success from './pages/Success'
import Favorites from './pages/Favorites'

function AnimatedRoutes() {
  const location = useLocation()
  const isCheckout = location.pathname.startsWith('/checkout')

  return (
    <>
      {!isCheckout && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<Product />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout/endereco" element={<Address />} />
          <Route path="/checkout/pagamento" element={<Payment />} />
          <Route path="/checkout/sucesso" element={<Success />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Routes>
      </AnimatePresence>
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  )
}
