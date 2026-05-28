import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { X, Heart, Package, MapPin, ChevronRight, Pencil, Check, ShoppingBag, LogOut } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import s from './ProfilePanel.module.css'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  exit: { x: '100%', transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'C'
}

export default function ProfilePanel({ open, onClose }) {
  const { count: favCount } = useFavorites()
  const { count: cartCount } = useCart()
  const navigate = useNavigate()

  const [name, setName] = useState('Convidado')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  function saveName() {
    const trimmed = draft.trim()
    setName(trimmed || 'Convidado')
    setEditing(false)
  }

  function startEditing() {
    setDraft(name)
    setEditing(true)
  }

  function handleLink(path) {
    onClose()
    navigate(path)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={s.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            className={s.panel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Perfil"
          >
            {/* Topo */}
            <div className={s.topBar}>
              <span className={s.topLabel}>Minha Conta</span>
              <button className={s.closeBtn} onClick={onClose} aria-label="Fechar">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Avatar + nome */}
            <div className={s.hero}>
              <div className={s.avatar}>
                <span className={s.initials}>{getInitials(name)}</span>
              </div>

              <div className={s.nameWrap}>
                {editing ? (
                  <div className={s.nameEditRow}>
                    <input
                      autoFocus
                      className={s.nameInput}
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false) }}
                      maxLength={32}
                    />
                    <button className={s.nameConfirmBtn} onClick={saveName} aria-label="Confirmar">
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button className={s.nameTrigger} onClick={startEditing}>
                    <span className={s.nameText}>{name}</span>
                    <Pencil size={12} strokeWidth={1.5} className={s.pencil} />
                  </button>
                )}
                <p className={s.email}>convidado@lojinha.com.br</p>
              </div>
            </div>

            {/* Stats */}
            <div className={s.stats}>
              <button className={s.stat} onClick={() => handleLink('/favoritos')}>
                <span className={s.statNum}>{favCount}</span>
                <span className={s.statLabel}>Favoritos</span>
              </button>
              <div className={s.statDiv} />
              <button className={s.stat} onClick={() => handleLink('/carrinho')}>
                <span className={s.statNum}>{cartCount}</span>
                <span className={s.statLabel}>No carrinho</span>
              </button>
              <div className={s.statDiv} />
              <div className={s.stat}>
                <span className={s.statNum}>0</span>
                <span className={s.statLabel}>Pedidos</span>
              </div>
            </div>

            {/* Links */}
            <nav className={s.links}>
              <button className={s.link} onClick={() => handleLink('/favoritos')}>
                <span className={`${s.linkIcon} ${s.linkIconHeart}`}>
                  <Heart size={15} strokeWidth={1.5} />
                </span>
                <span className={s.linkText}>Meus Favoritos</span>
                {favCount > 0 && <span className={s.badge}>{favCount}</span>}
                <ChevronRight size={14} strokeWidth={1.5} className={s.arrow} />
              </button>

              <button className={s.link} onClick={() => handleLink('/carrinho')}>
                <span className={`${s.linkIcon} ${s.linkIconCart}`}>
                  <ShoppingBag size={15} strokeWidth={1.5} />
                </span>
                <span className={s.linkText}>Carrinho</span>
                {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
                <ChevronRight size={14} strokeWidth={1.5} className={s.arrow} />
              </button>

              <button className={s.link} onClick={() => handleLink('/checkout/endereco')}>
                <span className={`${s.linkIcon} ${s.linkIconAddr}`}>
                  <MapPin size={15} strokeWidth={1.5} />
                </span>
                <span className={s.linkText}>Meus Endereços</span>
                <ChevronRight size={14} strokeWidth={1.5} className={s.arrow} />
              </button>

              <button className={s.link} onClick={() => handleLink('/carrinho')}>
                <span className={`${s.linkIcon} ${s.linkIconOrders}`}>
                  <Package size={15} strokeWidth={1.5} />
                </span>
                <span className={s.linkText}>Meus Pedidos</span>
                <ChevronRight size={14} strokeWidth={1.5} className={s.arrow} />
              </button>
            </nav>

            {/* CTA criar conta */}
            <div className={s.cta}>
              <p className={s.ctaText}>
                Crie uma conta para salvar favoritos, acompanhar pedidos e receber ofertas.
              </p>
              <button className={s.ctaPrimary}>Criar conta gratuita</button>
              <button className={s.ctaSecondary}>Já tenho conta — Entrar</button>
            </div>

            {/* Rodapé */}
            <div className={s.footer}>
              <button className={s.footerLink}>
                <LogOut size={13} strokeWidth={1.5} />
                Sair
              </button>
              <Link to="/" onClick={onClose} className={s.footerBrand}>
                <strong>lojinha</strong>
                <small>COMPRE FÁCIL</small>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
