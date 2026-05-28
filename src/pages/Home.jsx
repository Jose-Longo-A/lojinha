import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, Truck, RefreshCw, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { products, heroImages } from '../data/products'
import ProductCard from './ProductCard'
import s from './Home.module.css'

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const benefits = [
  { icon: Truck,        title: 'Frete Grátis',    sub: 'Acima de R$299' },
  { icon: CreditCard,   title: 'Parcele em 10x',  sub: 'Sem juros no cartão' },
  { icon: RefreshCw,    title: 'Troca Fácil',     sub: 'Em até 30 dias' },
  { icon: ShieldCheck,  title: 'Compra Segura',   sub: 'Seus dados protegidos' },
]

export default function Home() {
  const [params] = useSearchParams()
  const cat = params.get('cat')
  const q = params.get('q') || ''
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filtered = products.filter(p => {
    const matchCat = cat ? p.category === cat : true
    const matchQ = q
      ? p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      : true
    return matchCat && matchQ
  })

  useEffect(() => {
    if (cat || q) {
      setTimeout(() => {
        document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }, [cat, q])

  function getSectionTitle() {
    if (q) return `Resultados para "${q}"`
    if (cat === 'feminino') return 'Roupas Femininas'
    if (cat === 'masculino') return 'Roupas Masculinas'
    return 'Todos os produtos'
  }

  function handleNewsletter(e) {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  return (
    <motion.main {...page} className={s.main}>

      {/* Hero */}
      <section className={s.hero}>
        <div
          className={s.heroBg}
          style={{ backgroundImage: `url(${heroImages.main})` }}
        />
        <div className={s.heroOverlay} />
        <div className={s.heroContent}>
          <motion.p
            className={s.heroEyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Coleção Verão 2025
          </motion.p>
          <motion.p
            className={s.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            você na moda
          </motion.p>
          <motion.p
            className={s.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.47 }}
          >
            em alguns cliques
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <a href="#produtos" className={s.heroCta}>
              Explorar coleção <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
        <p className={s.heroWatermark}>BOAS COMPRAS</p>
      </section>

      {/* Benefícios */}
      <section className={s.benefits}>
        {benefits.map(({ icon: Icon, title, sub }) => (
          <div key={title} className={s.benefit}>
            <Icon size={22} strokeWidth={1.5} className={s.benefitIcon} />
            <div>
              <p className={s.benefitTitle}>{title}</p>
              <p className={s.benefitSub}>{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Produtos */}
      <section className={s.section} id="produtos">
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>{getSectionTitle()}</h2>
          {(cat || q) && (
            <Link to="/" className={s.clearFilter}>
              Ver todos <ChevronRight size={14} />
            </Link>
          )}
        </div>

        <div className={s.tabs}>
          <Link to="/" className={`${s.tab} ${!cat && !q ? s.tabActive : ''}`}>Todos</Link>
          <Link to="/?cat=feminino" className={`${s.tab} ${cat === 'feminino' ? s.tabActive : ''}`}>Feminino</Link>
          <Link to="/?cat=masculino" className={`${s.tab} ${cat === 'masculino' ? s.tabActive : ''}`}>Masculino</Link>
        </div>

        <motion.div
          className={s.grid}
          variants={container}
          initial="initial"
          animate="animate"
        >
          {filtered.length > 0
            ? filtered.map(p => <ProductCard key={p.id} product={p} />)
            : <p className={s.emptyState}>Nenhum produto encontrado para sua busca.</p>
          }
        </motion.div>
      </section>

      {/* Banner editorial */}
      <section className={s.editorial}>
        <div
          className={s.editorialBg}
          style={{ backgroundImage: `url(${heroImages.feminino})` }}
        />
        <div className={s.editorialOverlay} />
        <div className={s.editorialContent}>
          <p className={s.editorialEyebrow}>Destaques da Coleção</p>
          <p className={s.editorialTitle}>
            Porque o que é bonito,<br />é usável
          </p>
          <p className={s.editorialSub}>
            Compre com facilidade, sem fricção, sem surpresas.
          </p>
          <Link to="/?cat=feminino" className={s.editorialCta}>
            Ver coleção feminina <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className={s.categories}>
        <Link to="/?cat=feminino" className={s.catCard}>
          <div
            className={s.catImg}
            style={{ backgroundImage: `url(${heroImages.feminino2})`, backgroundPosition: '25% top', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
          />
          <div className={s.catOverlay} />
          <div className={s.catLabelWrap}>
            <span className={s.catLabel}>Roupas femininas</span>
            <span className={s.catCta}>Ver tudo <ChevronRight size={14} /></span>
          </div>
        </Link>
        <Link to="/?cat=masculino" className={s.catCard}>
          <div
            className={s.catImg}
            style={{ backgroundImage: `url(${heroImages.masculino})`, backgroundPosition: '80% 0%', backgroundSize: '140%', backgroundRepeat: 'no-repeat' }}
          />
          <div className={s.catOverlay} />
          <div className={s.catLabelWrap}>
            <span className={s.catLabel}>Roupas masculinas</span>
            <span className={s.catCta}>Ver tudo <ChevronRight size={14} /></span>
          </div>
        </Link>
      </section>

      {/* Newsletter */}
      <section className={s.newsletter}>
        <div className={s.newsletterInner}>
          <p className={s.newsletterTitle}>Fique por dentro das novidades</p>
          <p className={s.newsletterSub}>
            Receba ofertas exclusivas e lançamentos diretamente no seu e-mail.
          </p>
          {subscribed ? (
            <motion.p
              className={s.newsletterSuccess}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Obrigada por se inscrever!
            </motion.p>
          ) : (
            <form onSubmit={handleNewsletter} className={s.newsletterForm}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={s.newsletterInput}
                required
              />
              <button type="submit" className={s.newsletterBtn}>Assinar</button>
            </form>
          )}
        </div>
      </section>

      {/* Rodapé */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <div className={s.footerLogo}>
              <strong>lojinha</strong>
              <small>COMPRE FÁCIL</small>
            </div>
            <p className={s.footerSlogan}>Moda acessível com identidade própria.</p>
            <div className={s.footerSocial}>
              <a href="#" className={s.socialIcon} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className={s.socialIcon} aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={s.footerCol}>
            <p className={s.footerColTitle}>Atendimento</p>
            <ul className={s.footerLinks}>
              <li><a href="#">SAC</a></li>
              <li><a href="#">Trocas e Devoluções</a></li>
              <li><a href="#">Dúvidas Frequentes</a></li>
              <li><a href="#">Rastrear Pedido</a></li>
            </ul>
          </div>

          <div className={s.footerCol}>
            <p className={s.footerColTitle}>Institucional</p>
            <ul className={s.footerLinks}>
              <li><a href="#">Sobre a lojinha</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Imprensa</a></li>
              <li><a href="#">Sustentabilidade</a></li>
            </ul>
          </div>

          <div className={s.footerCol}>
            <p className={s.footerColTitle}>Minha Conta</p>
            <ul className={s.footerLinks}>
              <li><a href="#">Meus Pedidos</a></li>
              <li><a href="#">Endereços Salvos</a></li>
              <li><a href="#">Favoritos</a></li>
              <li><Link to="/carrinho">Carrinho</Link></li>
            </ul>
          </div>
        </div>

        <div className={s.footerBottom}>
          <p>© 2025 lojinha — Todos os direitos reservados</p>
          <p className={s.footerCredit}>um projeto criado por Anna Forlepa</p>
        </div>
      </footer>
    </motion.main>
  )
}
