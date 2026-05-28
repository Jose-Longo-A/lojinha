import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Loader2, Check } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import s from './Product.module.css'

const page = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
}

function fmt(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = products.find(p => p.id === Number(id))

  const [selectedSize, setSelectedSize] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(false)

  if (!product) {
    return (
      <motion.div {...page} className={s.notFound}>
        <p>Produto não encontrado.</p>
        <Link to="/" className={s.back}>← Voltar</Link>
      </motion.div>
    )
  }

  const { name, ref, price, sizes, images, description, available, stock, rating, ratingCount } = product

  async function handleAddToCart() {
    if (!selectedSize || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    addItem(product, selectedSize)
    setLoading(false)
    navigate('/carrinho')
  }

  const canAdd = selectedSize !== null && available

  return (
    <motion.main {...page} className={s.main}>
      <div className={s.breadcrumb}>
        <Link to="/" className={s.back}>
          <ChevronLeft size={16} strokeWidth={1.5} />
          Voltar
        </Link>
      </div>

      <div className={s.layout}>
        {/* Gallery */}
        <div className={s.gallery}>
          <div className={s.mainImgWrap}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={images[activeImg]}
                alt={name}
                className={s.mainImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onError={e => {
                  e.target.style.background = 'linear-gradient(135deg, #e8e0d0, #d4c9b5)'
                  e.target.style.display = 'block'
                  e.target.src = ''
                }}
              />
            </AnimatePresence>
          </div>
          <div className={s.thumbs}>
            {images.map((img, i) => (
              <button
                key={i}
                className={`${s.thumb} ${activeImg === i ? s.thumbActive : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className={s.info}>
          <p className={s.ref}>ref {ref}</p>
          <h1 className={s.name}>{name}</h1>

          {/* Rating */}
          {rating != null && (
            <div className={s.ratingRow}>
              <div className={s.stars}>
                {[1, 2, 3, 4, 5].map(i => {
                  const fill = Math.min(1, Math.max(0, rating - (i - 1)))
                  return (
                    <span key={i} className={s.star}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <defs>
                          <linearGradient id={`sg${id}${i}`} x1="0" x2="1" y1="0" y2="0">
                            <stop offset={`${fill * 100}%`} stopColor="var(--gold)" />
                            <stop offset={`${fill * 100}%`} stopColor="#D4D0C8" />
                          </linearGradient>
                        </defs>
                        <path d="M7 1l1.55 3.14L12 4.74l-2.5 2.43.59 3.44L7 9l-3.09 1.61.59-3.44L2 4.74l3.45-.6z"
                          fill={`url(#sg${id}${i})`} stroke="none" />
                      </svg>
                    </span>
                  )
                })}
              </div>
              <span className={s.ratingVal}>{rating.toFixed(1)}</span>
              <span className={s.ratingCount}>({ratingCount} avaliações)</span>
            </div>
          )}

          <div className={s.pricing}>
            <p className={s.price}>{fmt(price)}</p>
            <p className={s.installment}>ou 2x de {fmt(price / 2)} sem juros</p>
          </div>

          <p className={s.description}>{description}</p>

          {/* Estoque */}
          {available && stock != null && (
            <div className={`${s.stockBadge} ${stock <= 5 ? s.stockLow : ''}`}>
              {stock <= 5
                ? `⚠ Restam apenas ${stock} unidades`
                : `✓ ${stock} unidades em estoque`}
            </div>
          )}

          {/* Size selector — inline, never modal */}
          <div className={s.sizeSection}>
            <p className={s.sizeLabel}>Selecione o tamanho</p>
            <div className={s.sizes}>
              {sizes.map(sz => (
                <motion.button
                  key={sz}
                  className={`${s.sizeBtn} ${selectedSize === sz ? s.sizeBtnActive : ''}`}
                  onClick={() => setSelectedSize(sz)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  {sz}
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA */}
          {available ? (
            <motion.button
              className={s.addBtn}
              onClick={handleAddToCart}
              disabled={!canAdd || loading}
              animate={{ opacity: canAdd ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              whileTap={canAdd ? { scale: 0.97 } : {}}
              style={{ cursor: canAdd && !loading ? 'pointer' : 'not-allowed' }}
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{ display: 'inline-flex' }}
                >
                  <Loader2 size={18} strokeWidth={2} />
                </motion.span>
              ) : (
                'Adicionar ao carrinho'
              )}
            </motion.button>
          ) : (
            <div className={s.unavailable}>
              Produto esgotado
            </div>
          )}

          {!selectedSize && available && (
            <motion.p
              className={s.sizeHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Selecione um tamanho para continuar
            </motion.p>
          )}
        </div>
      </div>
    </motion.main>
  )
}
