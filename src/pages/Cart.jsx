import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ChevronLeft, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Stepper from '../components/Stepper'
import s from './Cart.module.css'

const page = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
}

const SHIPPING_OPTIONS = [
  { id: 'economico', label: 'Econômico',  price: 0,    days: '10–15 dias úteis' },
  { id: 'pac',       label: 'PAC',         price: 12.9, days: '5–7 dias úteis'   },
  { id: 'sedex',     label: 'SEDEX',       price: 29.9, days: '1–2 dias úteis'   },
]

function fmt(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtCep(val) {
  const d = val.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart()
  const navigate = useNavigate()
  const empty = items.length === 0

  const [cep, setCep] = useState('')
  const [shippingReady, setShippingReady] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState(null)

  const shippingCost = SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price ?? 0
  const displayTotal = total + shippingCost

  async function handleCalcShipping(e) {
    e.preventDefault()
    if (cep.replace(/\D/g, '').length < 8) return
    setCalculating(true)
    setShippingReady(false)
    setSelectedShipping(null)
    await new Promise(r => setTimeout(r, 900))
    setShippingReady(true)
    setCalculating(false)
  }

  return (
    <motion.main {...page} className={s.main}>
      <Stepper current={1} />

      <div className={s.container}>
        <h1 className={s.title}>carrinho</h1>
        <p className={s.sub}>você está a apenas (mais) alguns cliques de finalizar sua compra!</p>

        {empty ? (
          <div className={s.empty}>
            <p>Seu carrinho está vazio.</p>
            <Link to="/" className={s.emptyLink}>Ver produtos</Link>
          </div>
        ) : (
          <>
            <div className={s.section}>
              <h2 className={s.sectionTitle}>revisar pedido</h2>
              <div className={s.items}>
                {items.map(item => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    className={s.item}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <div className={s.itemImg}>
                      <img src={item.images[0]} alt={item.name} />
                    </div>
                    <div className={s.itemInfo}>
                      <p className={s.itemRef}>ref {item.ref}</p>
                      <p className={s.itemName}>{item.name}</p>
                      <p className={s.itemSize}>Tamanho: <strong>{item.size}</strong></p>
                      <p className={s.itemPrice}>{fmt(item.price)}</p>
                    </div>
                    <div className={s.itemControls}>
                      <div className={s.qty}>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                          className={s.qtyBtn}
                          aria-label="Diminuir"
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <span className={s.qtyNum}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                          className={s.qtyBtn}
                          aria-label="Aumentar"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className={s.removeBtn}
                        aria-label="Remover item"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Calculadora de frete */}
            <div className={s.section}>
              <h2 className={s.sectionTitle}>calcular frete</h2>
              <form onSubmit={handleCalcShipping} className={s.cepForm}>
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={e => setCep(fmtCep(e.target.value))}
                  className={s.cepInput}
                  maxLength={9}
                  aria-label="CEP"
                />
                <button
                  type="submit"
                  className={s.cepBtn}
                  disabled={calculating || cep.replace(/\D/g, '').length < 8}
                >
                  {calculating
                    ? <Loader2 size={14} strokeWidth={2} className={s.spinning} />
                    : 'Calcular'}
                </button>
              </form>

              <AnimatePresence>
                {shippingReady && (
                  <motion.div
                    className={s.shippingOptions}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {SHIPPING_OPTIONS.map(opt => (
                      <label
                        key={opt.id}
                        className={`${s.shippingOpt} ${selectedShipping === opt.id ? s.shippingOptActive : ''}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.id}
                          checked={selectedShipping === opt.id}
                          onChange={() => setSelectedShipping(opt.id)}
                          className={s.hiddenRadio}
                        />
                        <div className={s.shippingDot} />
                        <div className={s.shippingInfo}>
                          <span className={s.shippingLabel}>{opt.label}</span>
                          <span className={s.shippingDays}>{opt.days}</span>
                        </div>
                        <span className={s.shippingPrice}>
                          {opt.price === 0 ? <span className={s.free}>Grátis</span> : fmt(opt.price)}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resumo */}
            <div className={s.summary}>
              <div className={s.summaryRow}>
                <span>Subtotal</span>
                <span>{fmt(total)}</span>
              </div>
              <div className={s.summaryRow}>
                <span>Frete</span>
                {selectedShipping
                  ? <span className={shippingCost === 0 ? s.freeShipping : ''}>{shippingCost === 0 ? 'Grátis' : fmt(shippingCost)}</span>
                  : <span className={s.freeShipping}>Grátis</span>
                }
              </div>
              <div className={`${s.summaryRow} ${s.totalRow}`}>
                <span>Total</span>
                <span>{fmt(displayTotal)}</span>
              </div>
            </div>

            <div className={s.actions}>
              <motion.button
                className={s.primaryBtn}
                onClick={() => navigate('/checkout/endereco')}
                whileTap={{ scale: 0.97 }}
              >
                Finalizar compra
              </motion.button>
              <Link to="/" className={s.secondaryBtn}>
                <ChevronLeft size={14} strokeWidth={2} />
                Continuar comprando
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.main>
  )
}
