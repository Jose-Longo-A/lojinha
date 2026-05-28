import { Check } from 'lucide-react'
import s from './Stepper.module.css'

const steps = ['Carrinho', 'Endereço', 'Pagamento', 'Confirmação']

export default function Stepper({ current }) {
  return (
    <div className={s.stepper}>
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current

        return (
          <div key={label} className={s.step}>
            <div className={`${s.circle} ${done ? s.done : ''} ${active ? s.active : ''}`}>
              {done ? <Check size={13} strokeWidth={2.5} /> : idx}
            </div>
            <span className={`${s.label} ${active ? s.activeLabel : ''}`}>{label}</span>
            {i < steps.length - 1 && (
              <div className={`${s.line} ${done ? s.lineDone : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
