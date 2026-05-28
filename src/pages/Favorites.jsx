import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ChevronRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { products } from '../data/products'
import ProductCard from './ProductCard'
import s from './Favorites.module.css'

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const container = {
  animate: { transition: { staggerChildren: 0.07 } },
}

export default function Favorites() {
  const { favorites } = useFavorites()
  const favProducts = products.filter(p => favorites.includes(p.id))

  return (
    <motion.main {...page} className={s.main}>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.titleRow}>
            <Heart size={22} strokeWidth={1.5} className={s.titleIcon} />
            <h1 className={s.title}>Meus Favoritos</h1>
          </div>
          <p className={s.sub}>
            {favProducts.length > 0
              ? `${favProducts.length} ${favProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}`
              : 'Salve os produtos que você ama clicando no coração'}
          </p>
        </div>

        {favProducts.length > 0 ? (
          <>
            <motion.div
              className={s.grid}
              variants={container}
              initial="initial"
              animate="animate"
            >
              {favProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>

            <div className={s.footer}>
              <Link to="/" className={s.footerLink}>
                Ver todos os produtos <ChevronRight size={14} />
              </Link>
            </div>
          </>
        ) : (
          <motion.div
            className={s.empty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className={s.emptyIcon}>
              <Heart size={40} strokeWidth={1} />
            </div>
            <p className={s.emptyTitle}>Nenhum favorito ainda</p>
            <p className={s.emptyText}>
              Clique no coração dos produtos para salvá-los aqui e nunca perdê-los de vista.
            </p>
            <Link to="/" className={s.emptyBtn}>
              Explorar produtos <ChevronRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
