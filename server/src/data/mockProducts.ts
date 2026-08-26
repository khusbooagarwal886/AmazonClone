export interface MockProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  ratingAvg: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockReview {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // Electronics
  {
    _id: '65df10000000000000000001',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging, crystal clear hands-free calling, and multipoint connection.',
    price: 398.00,
    category: 'electronics',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 1240,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000002',
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe Case',
    description: 'Up to 2x more active noise cancellation, adaptive transparency, personalized spatial audio with dynamic head tracking, and dust, sweat, and water resistance.',
    price: 249.00,
    category: 'electronics',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 3820,
    createdAt: '2026-01-16T08:00:00.000Z',
    updatedAt: '2026-01-16T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000003',
    name: 'Samsung 55-Inch Class QLED 4K Smart TV',
    description: 'Quantum HDR delivers a wider range of brightness and color. Dual LED backlight technology adjusts color tone for natural visuals. Includes Alexa built-in.',
    price: 697.99,
    category: 'electronics',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    ],
    ratingAvg: 4.5,
    numReviews: 540,
    createdAt: '2026-01-17T08:00:00.000Z',
    updatedAt: '2026-01-17T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000004',
    name: 'JBL Flip 6 Portable Waterproof Bluetooth Speaker',
    description: '2-way speaker system delivers loud, crystal clear, powerful sound. IP67 waterproof and dustproof design with 12 hours of playtime on a single charge.',
    price: 129.95,
    category: 'electronics',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 890,
    createdAt: '2026-01-18T08:00:00.000Z',
    updatedAt: '2026-01-18T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000005',
    name: 'Logitech C920 HD Pro Webcam',
    description: 'Full HD 1080p video calling with stereo audio. Automatic light correction and autofocus deliver razor-sharp images even in dim lighting.',
    price: 69.99,
    category: 'electronics',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    ],
    ratingAvg: 4.4,
    numReviews: 610,
    createdAt: '2026-01-19T08:00:00.000Z',
    updatedAt: '2026-01-19T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000006',
    name: 'Canon EOS R50 Mirrorless Vlogging Camera',
    description: 'Compact 24.2 MP APS-C sensor camera with Dual Pixel CMOS AF II, 4K 30p uncropped video, and vari-angle touchscreen LCD display.',
    price: 679.99,
    category: 'electronics',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 310,
    createdAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-01-20T08:00:00.000Z',
  },

  // Computers & Accessories
  {
    _id: '65df10000000000000000007',
    name: 'Apple MacBook Air 13-Inch M3 Chip 256GB SSD',
    description: 'Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Up to 18 hours of battery life, liquid retina display, and backlit Magic Keyboard.',
    price: 1099.00,
    category: 'computers',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    ],
    ratingAvg: 4.9,
    numReviews: 1850,
    createdAt: '2026-01-21T08:00:00.000Z',
    updatedAt: '2026-01-21T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000008',
    name: 'Dell XPS 15 9530 Laptop 15.6" OLED Touch Display',
    description: 'Intel Core i7-13700H, 32GB DDR5 RAM, 1TB NVMe SSD, and NVIDIA GeForce RTX 4060 graphics. High-precision CNC aluminum chassis.',
    price: 1899.99,
    category: 'computers',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 420,
    createdAt: '2026-01-22T08:00:00.000Z',
    updatedAt: '2026-01-22T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000009',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    description: 'Quiet clicks with 8K DPI any-surface tracking. MagSpeed electromagnetic scrolling delivers remarkable speed and precision.',
    price: 99.99,
    category: 'computers',
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 4120,
    createdAt: '2026-01-23T08:00:00.000Z',
    updatedAt: '2026-01-23T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000010',
    name: 'Keychron K2 Wireless Mechanical Keyboard (RGB Backlit)',
    description: '75% layout compact Bluetooth mechanical keyboard for Mac and Windows. Gateron G Pro Brown switches with hot-swappable PCB.',
    price: 89.99,
    category: 'computers',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 950,
    createdAt: '2026-01-24T08:00:00.000Z',
    updatedAt: '2026-01-24T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000011',
    name: 'Samsung T7 Shield 2TB Portable SSD',
    description: 'Rugged external solid state drive with up to 1050MB/s transfer speed. IP65 rated for water and dust resistance, drop resistant up to 9.8 feet.',
    price: 169.99,
    category: 'computers',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 1200,
    createdAt: '2026-01-25T08:00:00.000Z',
    updatedAt: '2026-01-25T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000012',
    name: 'Anker 7-in-1 USB-C Hub Adapter with 4K HDMI & Power Delivery',
    description: 'Massive expansion with 4K@60Hz HDMI, 100W Power Delivery port, SD & microSD card reader, and 3 USB 3.0 data ports.',
    price: 34.99,
    category: 'computers',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
    ],
    ratingAvg: 4.5,
    numReviews: 2310,
    createdAt: '2026-01-26T08:00:00.000Z',
    updatedAt: '2026-01-26T08:00:00.000Z',
  },

  // Home & Kitchen
  {
    _id: '65df10000000000000000013',
    name: 'Breville Barista Touch Espresso Machine Stainless Steel',
    description: 'Automated touchscreen operation simplifies how to make your favorite cafe coffee in 3 easy steps: Grind, Brew, and Milk.',
    price: 999.95,
    category: 'home',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 870,
    createdAt: '2026-01-27T08:00:00.000Z',
    updatedAt: '2026-01-27T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000014',
    name: 'Ninja AF101 Air Fryer 4-Quart Capacity',
    description: 'Crisps with up to 75% less fat than traditional frying methods. Wide temperature range from 105 to 400 degrees Fahrenheit.',
    price: 89.99,
    category: 'home',
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 6420,
    createdAt: '2026-01-28T08:00:00.000Z',
    updatedAt: '2026-01-28T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000015',
    name: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum',
    description: 'Avoids pet waste and cords. Empties itself into the Clean Base automatic dirt disposal for up to 60 days.',
    price: 599.00,
    category: 'home',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    ],
    ratingAvg: 4.3,
    numReviews: 1100,
    createdAt: '2026-01-29T08:00:00.000Z',
    updatedAt: '2026-01-29T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000016',
    name: 'Fellow Stagg EKG Electric Gooseneck Pour-Over Kettle',
    description: 'Variable temperature control with precision pour spout. Built-in stopwatch and LCD display screen.',
    price: 165.00,
    category: 'home',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 730,
    createdAt: '2026-01-30T08:00:00.000Z',
    updatedAt: '2026-01-30T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000017',
    name: 'GreenPan Paris Pro Ceramic Nonstick 11-Piece Cookware Set',
    description: 'Thermolon healthy ceramic nonstick coating free of PFAS, PFOA, lead, and cadmium. Hard anodized aluminum bodies.',
    price: 249.99,
    category: 'home',
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1584990347449-39906f97ef92?w=800&q=80',
    ],
    ratingAvg: 4.5,
    numReviews: 480,
    createdAt: '2026-01-31T08:00:00.000Z',
    updatedAt: '2026-01-31T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000018',
    name: 'Hydro Flask 32 oz Wide Mouth with Straw Lid',
    description: 'TempShield double-wall vacuum insulation keeps drinks ice cold up to 24 hours or piping hot up to 12 hours.',
    price: 44.95,
    category: 'home',
    stock: 140,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 5320,
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  },

  // Clothing & Apparel
  {
    _id: '65df10000000000000000019',
    name: 'Levi\'s Men\'s 511 Slim Fit Stretch Jeans',
    description: 'A modern slim with room to move. Added stretch for all-day comfort and mobility.',
    price: 59.99,
    category: 'apparel',
    stock: 110,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80',
    ],
    ratingAvg: 4.4,
    numReviews: 3200,
    createdAt: '2026-02-02T08:00:00.000Z',
    updatedAt: '2026-02-02T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000020',
    name: 'Columbia Men\'s Watertight II Waterproof Rain Jacket',
    description: 'Omni-Tech waterproof breathable seam-sealed jacket. Lightweight and packs down into its own hand pocket.',
    price: 79.95,
    category: 'apparel',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 1890,
    createdAt: '2026-02-03T08:00:00.000Z',
    updatedAt: '2026-02-03T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000021',
    name: 'Nike Air Zoom Pegasus 40 Men\'s Running Shoes',
    description: 'Responsive cushioning with Nike React foam and dual Zoom Air units. Engineered mesh upper for breathable comfort.',
    price: 130.00,
    category: 'apparel',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 2450,
    createdAt: '2026-02-04T08:00:00.000Z',
    updatedAt: '2026-02-04T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000022',
    name: 'Ray-Ban Classic Polarized Aviator Sunglasses',
    description: 'Legendary teardrop shape with crystal polarized green lenses providing 100% UV protection.',
    price: 213.00,
    category: 'apparel',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 1740,
    createdAt: '2026-02-05T08:00:00.000Z',
    updatedAt: '2026-02-05T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000023',
    name: 'Fossil Men\'s Derrick Leather RFID Blocking Bifold Wallet',
    description: '100% genuine leather wallet with RFID blocking lining to help protect against unauthorized scans.',
    price: 45.00,
    category: 'apparel',
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 920,
    createdAt: '2026-02-06T08:00:00.000Z',
    updatedAt: '2026-02-06T08:00:00.000Z',
  },

  // Books
  {
    _id: '65df10000000000000000024',
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'By Robert C. Martin. Learn how to write robust, maintainable, and readable code through timeless principles and practical examples.',
    price: 43.99,
    category: 'books',
    stock: 95,
    images: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 4890,
    createdAt: '2026-02-07T08:00:00.000Z',
    updatedAt: '2026-02-07T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000025',
    name: 'Designing Data-Intensive Applications',
    description: 'By Martin Kleppmann. The definitive guide to the architecture of storage engines, distributed consensus, and scalable data processing.',
    price: 49.99,
    category: 'books',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    ],
    ratingAvg: 4.9,
    numReviews: 5310,
    createdAt: '2026-02-08T08:00:00.000Z',
    updatedAt: '2026-02-08T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000026',
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    description: 'By James Clear. Revolutionary framework for improving every day through tiny changes that deliver remarkable long-term results.',
    price: 18.00,
    category: 'books',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    ],
    ratingAvg: 4.9,
    numReviews: 12400,
    createdAt: '2026-02-09T08:00:00.000Z',
    updatedAt: '2026-02-09T08:00:00.000Z',
  },
  {
    _id: '65df10000000000000000027',
    name: 'The Pragmatic Programmer: Your Journey to Mastery',
    description: 'By David Thomas & Andrew Hunt. 20th Anniversary Edition covering career development, software design, and architectural best practices.',
    price: 44.95,
    category: 'books',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    ],
    ratingAvg: 4.8,
    numReviews: 2980,
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T08:00:00.000Z',
  },
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    _id: '65df20000000000000000001',
    product: '65df10000000000000000001',
    user: {
      _id: '65df30000000000000000001',
      name: 'Alex Johnson',
    },
    rating: 5,
    title: 'Outstanding sound quality and ANC',
    comment: 'The noise cancellation is unmatched. I use them for remote work and flights. Battery easily lasts days of heavy usage.',
    createdAt: '2026-02-12T14:32:00.000Z',
  },
  {
    _id: '65df20000000000000000002',
    product: '65df10000000000000000001',
    user: {
      _id: '65df30000000000000000002',
      name: 'Sarah Williams',
    },
    rating: 4,
    title: 'Great headphones, slightly bulky case',
    comment: 'Sound stage and comfort are 10/10. The only downside is the travel case does not fold as small as previous generations.',
    createdAt: '2026-02-14T09:15:00.000Z',
  },
  {
    _id: '65df20000000000000000003',
    product: '65df10000000000000000007',
    user: {
      _id: '65df30000000000000000003',
      name: 'Michael Chen',
    },
    rating: 5,
    title: 'The best portable laptop ever built',
    comment: 'M3 performance is incredible. Zero fan noise, brilliant screen, and lasts literally 15+ hours on a single charge.',
    createdAt: '2026-02-15T18:40:00.000Z',
  },
];
