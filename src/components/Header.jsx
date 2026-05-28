import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, X, Shirt, Heart, Menu } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import ProfilePanel from './ProfilePanel'
import s from './Header.module.css'

const PROMO = 'FRETE GRÁTIS ACIMA DE R$299  ·  PARCELE EM 10X SEM JUROS  ·  TROCA FÁCIL EM 30 DIAS  ·  '

export default function Header() {
  const { count: cartCount } = useCart()
  const { count: favCount } = useFavorites()
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
    }
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <header className={s.header}>
        <div className={s.promoBar}>
          <div className={s.promoTrack}>
            <span className={s.promoText}>{PROMO}{PROMO}</span>
            <span className={s.promoText} aria-hidden="true">{PROMO}{PROMO}</span>
          </div>
        </div>

        <div className={s.inner}>
          <button
            className={s.hamburger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <Link to="/" className={s.logo}>
            <Shirt size={20} strokeWidth={1.5} />
            <span className={s.logoText}>
              <strong>lojinha</strong>
              <small>COMPRE FÁCIL</small>
            </span>
          </Link>

          <nav className={s.nav}>
            <Link to="/?cat=feminino" className={s.navLink}>Feminino</Link>
            <Link to="/?cat=masculino" className={s.navLink}>Masculino</Link>
            <Link to="/" className={s.navLink}>Novidades</Link>
            <Link to="/" className={`${s.navLink} ${s.navSale}`}>Sale</Link>
          </nav>

          <div className={s.actions}>
            <motion.button
              className={s.iconBtn}
              onClick={() => setSearchOpen(v => !v)}
              whileTap={{ scale: 0.92 }}
              aria-label="Buscar"
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </motion.button>

            {/* Favoritos com badge */}
            <motion.button
              className={s.iconBtn}
              onClick={() => navigate('/favoritos')}
              whileTap={{ scale: 0.92 }}
              aria-label={`Favoritos — ${favCount} itens`}
              style={{ position: 'relative' }}
            >
              <Heart size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {favCount > 0 && (
                  <motion.span
                    className={`${s.badge} ${s.badgeHeart}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={favCount}
                  >
                    {favCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Perfil */}
            <motion.button
              className={`${s.iconBtn} ${profileOpen ? s.iconBtnActive : ''}`}
              onClick={() => setProfileOpen(v => !v)}
              whileTap={{ scale: 0.92 }}
              aria-label="Minha conta"
            >
              <User size={20} strokeWidth={1.5} />
            </motion.button>

            {/* Carrinho */}
            <motion.button
              className={s.iconBtn}
              onClick={() => navigate('/carrinho')}
              whileTap={{ scale: 0.92 }}
              aria-label={`Carrinho — ${cartCount} itens`}
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    className={s.badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className={s.searchBar}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 52, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <form onSubmit={handleSearch} className={s.searchForm}>
                <Search size={16} strokeWidth={1.5} color="var(--gray)" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={s.searchInput}
                />
                {searchQuery && (
                  <button type="submit" className={s.searchSubmitBtn}>Buscar</button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={s.mobileMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/?cat=feminino" className={s.mobileLink} onClick={() => setMenuOpen(false)}>Feminino</Link>
              <Link to="/?cat=masculino" className={s.mobileLink} onClick={() => setMenuOpen(false)}>Masculino</Link>
              <Link to="/" className={s.mobileLink} onClick={() => setMenuOpen(false)}>Novidades</Link>
              <Link to="/favoritos" className={s.mobileLink} onClick={() => setMenuOpen(false)}>Meus Favoritos</Link>
              <Link to="/" className={`${s.mobileLink} ${s.mobileSale}`} onClick={() => setMenuOpen(false)}>Sale</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ProfilePanel fora do header pra evitar stacking context */}
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
