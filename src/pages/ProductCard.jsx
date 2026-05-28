import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import s from './ProductCard.module.css'

const cardVariants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function fmt(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtParc(n) {
  return (n / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductCard({ product }) {
  const { id, name, price, available, images, category } = product
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(id)

  return (
    <motion.div variants={cardVariants} className={s.wrap}>
      <div className={s.card}>
        <Link to={`/produto/${id}`} className={s.imageLink}>
          <div className={s.imageWrap}>
            <img
              src={images[0]}
              alt={name}
              className={s.img}
              loading="lazy"
              onError={e => { e.target.style.display = 'none' }}
            />

            <div className={s.hoverOverlay}>
              <span className={s.hoverBtn}>Ver produto</span>
            </div>

            {!available && <span className={s.badgeEsgotado}>Esgotado</span>}
            {available  && <span className={s.badgeNovo}>Novo</span>}
          </div>
        </Link>

        <button
          className={`${s.favoriteBtn} ${favorited ? s.favoriteBtnActive : ''}`}
          onClick={() => toggleFavorite(id)}
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={15} strokeWidth={2} fill={favorited ? 'currentColor' : 'none'} />
        </button>

        <div className={s.info}>
          <span className={s.catTag}>{category}</span>
          <p className={s.name}>{name}</p>
          <p className={s.price}>{fmt(price)}</p>
          <p className={s.parcelamento}>3x de {fmtParc(price)} sem juros</p>
          <Link to={`/produto/${id}`}>
            <motion.span
              className={`${s.btn} ${!available ? s.btnDisabled : ''}`}
              whileTap={available ? { scale: 0.97 } : {}}
            >
              Ver produto
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
