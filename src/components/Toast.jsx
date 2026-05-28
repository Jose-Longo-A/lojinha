import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import s from './Toast.module.css'

export default function Toast() {
  const { toasts, dismissToast } = useCart()

  return (
    <div className={s.container}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={s.toast}
            initial={{ opacity: 0, x: 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ShoppingBag size={16} strokeWidth={1.5} color="var(--gold)" />
            <span>{t.message}</span>
            <button onClick={() => dismissToast(t.id)} className={s.close} aria-label="Fechar">
              <X size={14} strokeWidth={2} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
