import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { Shirt, MapPin, CreditCard, Package, Truck } from 'lucide-react'
import Stepper from '../components/Stepper'
import { address as defaultAddress } from '../data/products'
import s from './Success.module.css'

const page = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

function fmt(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const methodLabels = {
  credito: 'Cartão de crédito',
  pix:     'PIX',
  boleto:  'Boleto bancário',
}

const methodIcons = {
  credito: CreditCard,
  pix:     Package,
  boleto:  Package,
}

export default function Success() {
  const { state } = useLocation()
  const orderId  = state?.orderId  || 'LCF-00001'
  const total    = state?.total    || 500
  const items    = state?.items    || []
  const method   = state?.method   || 'credito'
  const address  = state?.address  || defaultAddress

  const MethodIcon = methodIcons[method] || CreditCard

  return (
    <motion.main {...page} className={s.main}>
      <Stepper current={4} />

      <div className={s.container}>
        {/* Check animado */}
        <div className={s.checkWrap}>
          <motion.div
            className={s.checkCircle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={s.checkSvg}
            >
              <motion.circle
                cx="24" cy="24" r="22"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.path
                d="M14 24l8 8 14-16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          className={s.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Pedido realizado!
        </motion.h1>

        <motion.p
          className={s.orderId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          #{orderId}
        </motion.p>

        <motion.p
          className={s.thankYou}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
        >
          Obrigada pela compra! Você receberá um e-mail de confirmação em breve.
        </motion.p>

        {/* Itens do pedido */}
        <motion.div
          className={s.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <h2 className={s.cardTitle}>
            <Package size={15} strokeWidth={1.5} />
            Itens do pedido
          </h2>

          <div className={s.itemsList}>
            {items.map(item => (
              <div key={`${item.id}-${item.size}`} className={s.item}>
                <div className={s.itemImg}>
                  <img src={item.images[0]} alt={item.name} />
                </div>
                <div className={s.itemInfo}>
                  <p className={s.itemName}>{item.name}</p>
                  <p className={s.itemMeta}>Tamanho: {item.size} · Qtd: {item.qty}</p>
                </div>
                <span className={s.itemPrice}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className={s.divider} />

          <div className={s.totalLine}>
            <span>Total pago</span>
            <span className={s.totalVal}>{fmt(total)}</span>
          </div>
        </motion.div>

        {/* Detalhes da entrega */}
        <motion.div
          className={s.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92, duration: 0.4 }}
        >
          <h2 className={s.cardTitle}>
            <Truck size={15} strokeWidth={1.5} />
            Entrega
          </h2>

          <div className={s.detailRow}>
            <div className={s.detailIcon}>
              <MapPin size={15} strokeWidth={1.5} />
            </div>
            <div>
              <p className={s.detailLabel}>Endereço de entrega</p>
              <p className={s.detailVal}>
                {address.street}{address.complement ? `, ${address.complement}` : ''}
              </p>
              <p className={s.detailSub}>
                {address.city} — {address.state}{address.cep ? ` · ${address.cep}` : ''}
              </p>
            </div>
          </div>

          <div className={s.detailRow}>
            <div className={s.detailIcon}>
              <MethodIcon size={15} strokeWidth={1.5} />
            </div>
            <div>
              <p className={s.detailLabel}>Pagamento</p>
              <p className={s.detailVal}>{methodLabels[method]}</p>
            </div>
          </div>

          <div className={s.detailRow}>
            <div className={s.detailIcon}>
              <Truck size={15} strokeWidth={1.5} />
            </div>
            <div>
              <p className={s.detailLabel}>Prazo estimado</p>
              <p className={s.detailVal}>Até 7 dias úteis</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className={s.backWrap}
        >
          <Link to="/" className={s.backBtn}>Voltar à loja</Link>
        </motion.div>

        <div className={s.brand}>
          <Shirt size={18} strokeWidth={1.5} color="var(--gold)" />
          <strong>lojinha</strong>
          <small>COMPRE FÁCIL</small>
        </div>
      </div>
    </motion.main>
  )
}
