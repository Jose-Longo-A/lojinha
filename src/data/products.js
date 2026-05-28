export const products = [
  {
    id: 1,
    name: 'camisa colorida',
    ref: '337302_0010',
    price: 400,
    available: true,
    stock: 8,
    rating: 4.3,
    ratingCount: 27,
    sizes: ['P', 'M', 'G'],
    images: [
      '/images/camisa-colorida.jpg',
      '/images/camisa-colorida.jpg',
    ],
    category: 'masculino',
    description: 'Camisa listrada em algodão premium com caimento relaxado. Perfeita para looks casuais e esportivos.',
  },
  {
    id: 2,
    name: 'calça bege',
    ref: '337302_0011',
    price: 400,
    available: false,
    stock: 0,
    rating: 4.7,
    ratingCount: 43,
    sizes: ['P', 'M', 'G'],
    images: [
      '/images/calca-bege.jpg',
      '/images/calca-bege.jpg',
    ],
    category: 'feminino',
    description: 'Calça wide-leg em linho bege com acabamento refinado. Confortável e elegante para todas as ocasiões.',
  },
  {
    id: 3,
    name: 'vestido preto',
    ref: '337302_0012',
    price: 400,
    available: false,
    stock: 0,
    rating: 4.9,
    ratingCount: 61,
    sizes: ['P', 'M', 'G'],
    images: [
      '/images/vestido-preto.jpg',
      '/images/vestido-preto.jpg',
    ],
    category: 'feminino',
    description: 'Vestido longo boho com bordado floral azul e detalhes metálicos. Uma peça única para ocasiões especiais.',
  },
  {
    id: 4,
    name: 'blazer preto',
    ref: '337302_0013',
    price: 500,
    available: true,
    stock: 3,
    rating: 4.5,
    ratingCount: 18,
    sizes: ['P', 'M', 'G'],
    images: [
      '/images/blazer-preto.jpg',
      '/images/blazer-preto.jpg',
    ],
    category: 'feminino',
    description: 'Blazer oversized em tecido premium. Caimento estruturado, atitude sofisticada.',
  },
]

export const address = {
  street: 'Rua das Flores, 345',
  complement: 'Apto 14',
  city: 'Curitiba',
  state: 'PR',
}

export const heroImages = {
  main: '/images/hero.jpg',
  feminino: '/images/categoria-feminino.jpg',
  feminino2: '/images/categoria-feminino2.jpg',
  masculino: '/images/categoria-masculino.jpg',
}
