import mongoose from 'mongoose';
import { ENV } from './config/env';
import { logger } from './config/logger';
import Product from './models/Product';
import User from './models/User';

const sampleProducts = [
  // Electronics
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Computers & Accessories
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Home & Kitchen
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Clothing & Apparel
  {
    name: 'Levi\'s Men\'s 511 Slim Fit Stretch Jeans',
    description: 'A modern slim with room to move. Added stretch for all-day comfort and mobility.',
    price: 59.99,
    category: 'clothing',
    stock: 110,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80',
    ],
    ratingAvg: 4.4,
    numReviews: 3200,
  },
  {
    name: 'Columbia Men\'s Watertight II Waterproof Rain Jacket',
    description: 'Omni-Tech waterproof breathable seam-sealed jacket. Lightweight and packs down into its own hand pocket.',
    price: 79.95,
    category: 'clothing',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 1890,
  },
  {
    name: 'Nike Air Zoom Pegasus 40 Men\'s Running Shoes',
    description: 'Responsive cushioning with Nike React foam and dual Zoom Air units. Engineered mesh upper for breathable comfort.',
    price: 130.00,
    category: 'clothing',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 2450,
  },
  {
    name: 'Ray-Ban Classic Polarized Aviator Sunglasses',
    description: 'Legendary teardrop shape with crystal polarized green lenses providing 100% UV protection.',
    price: 213.00,
    category: 'clothing',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 1740,
  },
  {
    name: 'Fossil Men\'s Derrick Leather RFID Blocking Bifold Wallet',
    description: '100% genuine leather wallet with RFID blocking lining to help protect against unauthorized scans.',
    price: 45.00,
    category: 'clothing',
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 920,
  },

  // Books
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  // Sports & Outdoors
  {
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)',
    description: 'Adjusts from 5 to 52.5 lbs in 2.5 lb increments. Replaces 15 sets of weights for space-efficient home workouts.',
    price: 429.00,
    category: 'sports',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
    ],
    ratingAvg: 4.7,
    numReviews: 3120,
  },
  {
    name: 'Manduka PRO Yoga Mat Extra Thick 6mm',
    description: 'High-density cushion and joint protection with proprietary dot-pattern bottom to prevent slipping on any floor surface.',
    price: 128.00,
    category: 'sports',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    ],
    ratingAvg: 4.6,
    numReviews: 1450,
  },
  {
    name: 'Coleman Sundome Camping Tent 4-Person Waterproof',
    description: 'WeatherTec system with patented welded floors and inverted seams to keep water out. Sets up in under 10 minutes.',
    price: 89.99,
    category: 'sports',
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    ],
    ratingAvg: 4.5,
    numReviews: 2870,
  },
  {
    name: 'Fitbit Charge 6 Fitness Tracker with Built-in GPS',
    description: 'Heart rate tracking on exercise equipment, 40+ exercise modes, built-in GPS, active zone minutes, and 7-day battery life.',
    price: 159.95,
    category: 'sports',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    ],
    ratingAvg: 4.3,
    numReviews: 1940,
  },
];

async function seedDatabase(): Promise<void> {
  try {
    if (!ENV.MONGODB_URI) {
      logger.error('Cannot run seed script: MONGODB_URI is not configured in .env');
      process.exit(1);
    }

    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('Connected to MongoDB.');

    // 1. Clear existing products
    await Product.deleteMany({});
    logger.info('Cleared existing products.');

    // 2. Find or create an admin user to associate with seeded products
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@amazon.com',
        password: 'adminpassword123',
        role: 'admin',
      });
      logger.info(`Created default admin user: ${adminUser.email}`);
    }

    // 3. Attach admin user id to products
    const productsWithUser = sampleProducts.map((p) => ({
      ...p,
      user: adminUser?._id,
    }));

    // 4. Insert sample products
    const inserted = await Product.insertMany(productsWithUser);
    logger.info(`Successfully seeded ${inserted.length} products across multiple categories!`);

    await mongoose.connection.close();
    logger.info('Database connection closed.');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${(error as Error).message}`);
    process.exit(1);
  }
}

seedDatabase();
