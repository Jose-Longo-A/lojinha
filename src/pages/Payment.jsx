import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Zap, FileText, ChevronLeft, Copy, Check } from 'lucide-react'
import Stepper from '../components/Stepper'
import { useCart } from '../context/CartContext'
import s from './Payment.module.css'

const page = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
}

const methods = [
  { id: 'credito', label: 'Crédito', icon: CreditCard },
  { id: 'pix', label: 'PIX', icon: Zap },
  { id: 'boleto', label: 'Boleto', icon: FileText },
]

function fmt(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedAddress = location.state?.selectedAddress
  const { items, total, clearCart } = useCart()
  const [selected, setSelected] = useState('credito')
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })

  function handleFinalize() {
    clearCart()
    navigate('/checkout/sucesso', {
      state: {
        method: selected,
        total,
        items,
        orderId: `LCF-${Math.floor(10000 + Math.random() * 90000)}`,
        address: selectedAddress,
      }
    })
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function fmtCard(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function fmtExpiry(val) {
    const d = val.replace(/\D/g, '').slice(0, 4)
    if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`
    return d
  }

  const pixKey = 'lojinha@comprefacil.com.br'
  const boletoLine = '1234.5678 9 01234.567890 12345.678901 7 00000000050000'

  return (
    <motion.main {...page} className={s.main}>
      <Stepper current={3} />

      <div className={s.container}>
        <h1 className={s.title}>carrinho</h1>
        <p className={s.sub}>você está a apenas (mais) alguns cliques de finalizar sua compra!</p>

        <h2 className={s.sectionTitle}>selecione a forma de pagamento</h2>

        <div className={s.card}>
          {/* Method tabs */}
          <div className={s.tabs}>
            {methods.map(m => {
              const Icon = m.icon
              return (
                <motion.button
                  key={m.id}
                  className={`${s.tab} ${selected === m.id ? s.tabActive : ''}`}
                  onClick={() => setSelected(m.id)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {m.label}
                </motion.button>
              )
            })}
          </div>

          {/* Method content */}
          <AnimatePresence mode="wait">
            {selected === 'credito' && (
              <motion.div
                key="credito"
                className={s.methodContent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className={s.formGroup}>
                  <label className={s.fieldLabel}>Número do cartão</label>
                  <input
                    className={s.input}
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={e => setCard(p => ({ ...p, number: fmtCard(e.target.value) }))}
                    maxLength={19}
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.fieldLabel}>Nome no cartão</label>
                  <input
                    className={s.input}
                    placeholder="Como aparece no cartão"
                    value={card.name}
                    onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className={s.formRow}>
                  <div className={s.formGroup}>
                    <label className={s.fieldLabel}>Validade</label>
                    <input
                      className={s.input}
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={e => setCard(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))}
                      maxLength={5}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.fieldLabel}>CVV</label>
                    <input
                      className={s.input}
                      placeholder="123"
                      value={card.cvv}
                      onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>
                <p className={s.installInfo}>Total em 2x de {fmt(total / 2)} sem juros</p>
              </motion.div>
            )}

            {selected === 'pix' && (
              <motion.div
                key="pix"
                className={s.methodContent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className={s.pixQR}>
                  <div className={s.qrPlaceholder}>
                    <span>QR Code</span>
                    <small>Escaneie com o app do seu banco</small>
                  </div>
                </div>
                <p className={s.pixLabel}>ou copie a chave PIX:</p>
                <div className={s.pixKey}>
                  <span>{pixKey}</span>
                  <button className={s.copyBtn} onClick={() => handleCopy(pixKey)}>
                    {copied ? <Check size={14} strokeWidth={2} color="var(--success)" /> : <Copy size={14} strokeWidth={1.5} />}
                  </button>
                </div>
                <p className={s.pixNote}>O pagamento é confirmado em até 1 minuto.</p>
              </motion.div>
            )}

            {selected === 'boleto' && (
              <motion.div
                key="boleto"
                className={s.methodContent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <p className={s.boletoLabel}>Linha digitável:</p>
                <div className={s.boletoLine}>
                  <span className={s.boletoCode}>{boletoLine}</span>
                  <button className={s.copyBtn} onClick={() => handleCopy(boletoLine)}>
                    {copied ? <Check size={14} strokeWidth={2} color="var(--success)" /> : <Copy size={14} strokeWidth={1.5} />}
                  </button>
                </div>
                <p className={s.boletoNote}>Vencimento em 3 dias úteis. Pagamento pode levar até 2 dias para confirmar.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total summary */}
        <div className={s.totalRow}>
          <span>Total a pagar</span>
          <span className={s.totalValue}>{fmt(total)}</span>
        </div>

        {/* Actions — correct hierarchy */}
        <div className={s.actions}>
          <motion.button
            className={s.primaryBtn}
            onClick={handleFinalize}
            whileTap={{ scale: 0.97 }}
          >
            Finalizar pedido
          </motion.button>
          <button className={s.secondaryBtn} onClick={() => navigate('/checkout/endereco')}>
            <ChevronLeft size={14} strokeWidth={2} />
            Voltar ao endereço
          </button>
        </div>
      </div>
    </motion.main>
  )
}
