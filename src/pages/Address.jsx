import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Check, MapPin, X } from 'lucide-react'
import Stepper from '../components/Stepper'
import { address as defaultAddress } from '../data/products'
import s from './Address.module.css'

const page = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
}

const emptyForm = { street: '', complement: '', city: '', state: '', cep: '' }

function fmtCep(val) {
  const d = val.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export default function Address() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([defaultAddress])
  const [selected, setSelected] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleSave(e) {
    e.preventDefault()
    if (!form.street || !form.city || !form.state) return
    setAddresses(prev => [...prev, { ...form }])
    setSelected(addresses.length)
    setShowForm(false)
    setForm(emptyForm)
  }

  function handleCancel() {
    setShowForm(false)
    setForm(emptyForm)
  }

  function handleContinue() {
    navigate('/checkout/pagamento', {
      state: { selectedAddress: addresses[selected] }
    })
  }

  return (
    <motion.main {...page} className={s.main}>
      <Stepper current={2} />

      <div className={s.container}>
        <h1 className={s.title}>carrinho</h1>
        <p className={s.sub}>você está a apenas (mais) alguns cliques de finalizar sua compra!</p>

        <h2 className={s.sectionTitle}>confirme seu endereço</h2>

        {/* Lista de endereços */}
        <div className={s.addressList}>
          {addresses.map((addr, i) => (
            <motion.button
              key={i}
              className={`${s.addrCard} ${selected === i ? s.addrCardActive : ''}`}
              onClick={() => setSelected(i)}
              layout
              whileTap={{ scale: 0.99 }}
            >
              <div className={`${s.addrIcon} ${selected === i ? s.addrIconActive : ''}`}>
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <div className={s.addrInfo}>
                <p className={s.addrLine}>
                  {addr.street}{addr.complement ? `, ${addr.complement}` : ''}
                </p>
                <p className={s.addrCity}>
                  {addr.city} — {addr.state}{addr.cep ? ` · ${addr.cep}` : ''}
                </p>
              </div>
              {selected === i && (
                <div className={s.addrCheck}>
                  <Check size={13} strokeWidth={2.5} />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Botão / formulário */}
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.button
              key="add-btn"
              className={s.addAddrBtn}
              onClick={() => setShowForm(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Plus size={15} strokeWidth={2} />
              Adicionar novo endereço
            </motion.button>
          ) : (
            <motion.form
              key="add-form"
              className={s.addrForm}
              onSubmit={handleSave}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <div className={s.formHeader}>
                <p className={s.formTitle}>Novo endereço</p>
                <button type="button" className={s.formClose} onClick={handleCancel} aria-label="Fechar">
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              <div className={s.formGroup}>
                <label className={s.fieldLabel}>Rua e número *</label>
                <input
                  className={s.input}
                  placeholder="Ex: Av. Paulista, 1000"
                  value={form.street}
                  onChange={e => setForm(p => ({ ...p, street: e.target.value }))}
                  required
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.fieldLabel}>Complemento</label>
                <input
                  className={s.input}
                  placeholder="Apto, bloco, casa (opcional)"
                  value={form.complement}
                  onChange={e => setForm(p => ({ ...p, complement: e.target.value }))}
                />
              </div>

              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label className={s.fieldLabel}>Cidade *</label>
                  <input
                    className={s.input}
                    placeholder="Ex: São Paulo"
                    value={form.city}
                    onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    required
                  />
                </div>
                <div className={s.formGroupSmall}>
                  <label className={s.fieldLabel}>Estado *</label>
                  <input
                    className={s.input}
                    placeholder="SP"
                    value={form.state}
                    onChange={e => setForm(p => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))}
                    required
                    maxLength={2}
                  />
                </div>
              </div>

              <div className={s.formGroup}>
                <label className={s.fieldLabel}>CEP</label>
                <input
                  className={s.input}
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={e => setForm(p => ({ ...p, cep: fmtCep(e.target.value) }))}
                  maxLength={9}
                />
              </div>

              <div className={s.formActions}>
                <button type="submit" className={s.saveBtn}>Salvar endereço</button>
                <button type="button" className={s.cancelBtn} onClick={handleCancel}>Cancelar</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className={s.actions}>
          <motion.button
            className={s.primaryBtn}
            onClick={handleContinue}
            whileTap={{ scale: 0.97 }}
          >
            Continuar para pagamento
          </motion.button>
          <button className={s.secondaryBtn} onClick={() => navigate('/carrinho')}>
            <ChevronLeft size={14} strokeWidth={2} />
            Voltar ao carrinho
          </button>
        </div>
      </div>
    </motion.main>
  )
}
