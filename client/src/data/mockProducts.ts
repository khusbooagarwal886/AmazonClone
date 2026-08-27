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
  {
    "_id": "65df10000000000000000001",
    "name": "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    "description": "Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging, crystal clear hands-free calling, and multipoint connection.",
    "price": 29990,
    "category": "electronics",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 1240,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000002",
    "name": "Apple AirPods Pro (2nd Generation) with MagSafe Case",
    "description": "Up to 2x more active noise cancellation, adaptive transparency, personalized spatial audio with dynamic head tracking, and dust, sweat, and water resistance.",
    "price": 20990,
    "category": "electronics",
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 3820,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000003",
    "name": "Samsung 55-Inch Class QLED 4K Smart TV",
    "description": "Quantum HDR delivers a wider range of brightness and color. Dual LED backlight technology adjusts color tone for natural visuals. Includes Alexa built-in.",
    "price": 58990,
    "category": "electronics",
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80"
    ],
    "ratingAvg": 4.5,
    "numReviews": 540,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000004",
    "name": "JBL Flip 6 Portable Waterproof Bluetooth Speaker",
    "description": "2-way speaker system delivers loud, crystal clear, powerful sound. IP67 waterproof and dustproof design with 12 hours of playtime on a single charge.",
    "price": 9999,
    "category": "electronics",
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 890,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000005",
    "name": "Logitech C920 HD Pro Webcam",
    "description": "Full HD 1080p video calling with stereo audio. Automatic light correction and autofocus deliver razor-sharp images even in dim lighting.",
    "price": 6495,
    "category": "electronics",
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"
    ],
    "ratingAvg": 4.4,
    "numReviews": 610,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000006",
    "name": "Canon EOS R50 Mirrorless Vlogging Camera",
    "description": "Compact 24.2 MP APS-C sensor camera with Dual Pixel CMOS AF II, 4K 30p uncropped video, and vari-angle touchscreen LCD display.",
    "price": 58995,
    "category": "electronics",
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 310,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000007",
    "name": "Sony PlayStation 5 Slim Digital Edition Console",
    "description": "Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
    "price": 44990,
    "category": "electronics",
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 4890,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000008",
    "name": "Microsoft Xbox Series X 1TB Gaming Console",
    "description": "The fastest, most powerful Xbox ever. Explore rich worlds with 12 teraflops of raw graphic processing power, DirectX ray tracing, and 4K gaming.",
    "price": 52990,
    "category": "electronics",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 3120,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000009",
    "name": "Nintendo Switch OLED Model with White Joy-Con",
    "description": "Features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    "price": 31990,
    "category": "electronics",
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 5410,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000010",
    "name": "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones",
    "description": "Breakthrough spatial audio for immersive listening. World-class noise cancellation, CustomTune technology, and plush luxury comfort.",
    "price": 35900,
    "category": "electronics",
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 920,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000011",
    "name": "Sonos Era 100 Smart Speaker with Bluetooth & WiFi",
    "description": "Next-gen acoustic architecture powers stereo sound and rich bass. Stream audio using WiFi, Bluetooth, and 3.5mm line-in.",
    "price": 26999,
    "category": "electronics",
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 670,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000012",
    "name": "GoPro HERO12 Black Waterproof Action Camera",
    "description": "Incredible 5.3K60 HDR video, HyperSmooth 6.0 video stabilization, rugged waterproof build to 33ft, and Bluetooth audio support for AirPods.",
    "price": 37990,
    "category": "electronics",
    "stock": 28,
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 1430,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000013",
    "name": "DJI Mini 4 Pro Drone with RC 2 Controller & 4K HDR Video",
    "description": "Under 249g ultralight foldable drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical shooting, and 20km FHD video transmission.",
    "price": 78990,
    "category": "electronics",
    "stock": 18,
    "images": [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 890,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000014",
    "name": "Amazon Kindle Paperwhite 16GB (6.8\" Glare-Free Display)",
    "description": "Now with a 6.8\" display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    "price": 14999,
    "category": "electronics",
    "stock": 95,
    "images": [
      "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 8750,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000015",
    "name": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case",
    "description": "Powered by the S9 SiP chip with Double Tap gesture, brighter edge-to-edge Always-On display, and precision finding for iPhone.",
    "price": 41900,
    "category": "electronics",
    "stock": 55,
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 2900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000016",
    "name": "Anker Prime 20,000mAh 200W Power Bank with Smart Digital Display",
    "description": "Ultra-fast 200W total output with dual USB-C ports capable of 100W each. Smart digital display shows remaining battery life and recharge time.",
    "price": 11999,
    "category": "electronics",
    "stock": 70,
    "images": [
      "https://images.unsplash.com/photo-1609592424300-8fa3b00bb044?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 1540,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000017",
    "name": "Apple MacBook Air 13-Inch M3 Chip 256GB SSD",
    "description": "Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Up to 18 hours of battery life, liquid retina display, and backlit Magic Keyboard.",
    "price": 104900,
    "category": "computers",
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 1850,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000018",
    "name": "Dell XPS 15 9530 Laptop 15.6\" OLED Touch Display",
    "description": "Intel Core i7-13700H, 32GB DDR5 RAM, 1TB NVMe SSD, and NVIDIA GeForce RTX 4060 graphics. High-precision CNC aluminum chassis.",
    "price": 184990,
    "category": "computers",
    "stock": 12,
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 420,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000019",
    "name": "Logitech MX Master 3S Wireless Performance Mouse",
    "description": "Quiet clicks with 8K DPI any-surface tracking. MagSpeed electromagnetic scrolling delivers remarkable speed and precision.",
    "price": 8995,
    "category": "computers",
    "stock": 90,
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 4120,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000020",
    "name": "Keychron K2 Wireless Mechanical Keyboard (RGB Backlit)",
    "description": "75% layout compact Bluetooth mechanical keyboard for Mac and Windows. Gateron G Pro Brown switches with hot-swappable PCB.",
    "price": 7999,
    "category": "computers",
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 950,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000021",
    "name": "Samsung T7 Shield 2TB Portable SSD",
    "description": "Rugged external solid state drive with up to 1050MB/s transfer speed. IP65 rated for water and dust resistance, drop resistant up to 9.8 feet.",
    "price": 15499,
    "category": "computers",
    "stock": 55,
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 1200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000022",
    "name": "Anker 7-in-1 USB-C Hub Adapter with 4K HDMI & Power Delivery",
    "description": "Massive expansion with 4K@60Hz HDMI, 100W Power Delivery port, SD & microSD card reader, and 3 USB 3.0 data ports.",
    "price": 3299,
    "category": "computers",
    "stock": 120,
    "images": [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80"
    ],
    "ratingAvg": 4.5,
    "numReviews": 2310,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000023",
    "name": "ASUS ROG Zephyrus G14 14\" OLED 120Hz Gaming Laptop",
    "description": "AMD Ryzen 9 8945HS, 32GB LPDDR5X RAM, 1TB PCIe 4.0 SSD, NVIDIA GeForce RTX 4070, and ROG Nebula 3K OLED Display.",
    "price": 174990,
    "category": "computers",
    "stock": 14,
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 610,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000024",
    "name": "LG 27-Inch UltraGear OLED QHD 240Hz Gaming Monitor",
    "description": "0.03ms response time with 240Hz refresh rate. DCI-P3 98.5% color gamut, HDR10, NVIDIA G-SYNC and AMD FreeSync Premium compatible.",
    "price": 69999,
    "category": "computers",
    "stock": 22,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 840,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000025",
    "name": "Razer DeathAdder V3 Pro Wireless Ergonomic Esports Mouse",
    "description": "63g ultra-lightweight design with Focus Pro 30K Optical Sensor, Gen-3 Optical Switches, and 90 hours of battery life.",
    "price": 12499,
    "category": "computers",
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 1820,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000026",
    "name": "SteelSeries Apex Pro TKL Wireless Mechanical Gaming Keyboard",
    "description": "World's fastest OmniPoint 2.0 adjustable hypermagnetic switches with 0.1mm - 4.0mm actuation and OLED smart display.",
    "price": 21999,
    "category": "computers",
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 980,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000027",
    "name": "Western Digital 4TB Black SN850X NVMe Internal Gaming SSD",
    "description": "Blistering speeds up to 7300MB/s for top-tier performance and ridiculously short load times on PC and PS5.",
    "price": 28999,
    "category": "computers",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 2400,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000028",
    "name": "Blue Yeti USB Microphone for Streaming & Podcasting",
    "description": "Custom three-capsule array produces clear, powerful, broadcast-quality sound for YouTube, Twitch streaming, and podcasting.",
    "price": 10999,
    "category": "computers",
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 6900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000029",
    "name": "Elgato Stream Deck MK.2 Studio Controller with 15 LCD Keys",
    "description": "15 customizable LCD keys to control apps, tools, and platforms. One-touch tactile operation for live streaming and productivity.",
    "price": 13499,
    "category": "computers",
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 3150,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000030",
    "name": "CalDigit TS4 Thunderbolt 4 18-in-1 Docking Station",
    "description": "98W power delivery with 18 ports including DisplayPort 1.4, 2.5GbE Ethernet, UHS-II SD card reader, and front USB-C 20W charging.",
    "price": 36999,
    "category": "computers",
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 760,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000031",
    "name": "Herman Miller Aeron Ergonomic Office Chair (Size B)",
    "description": "The benchmark for ergonomic seating with 8Z Pellicle breathable mesh, PostureFit SL back support, and fully adjustable arms.",
    "price": 125000,
    "category": "computers",
    "stock": 10,
    "images": [
      "https://images.unsplash.com/photo-1580481077195-c54d173c38ef?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 1290,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000032",
    "name": "Ergotron LX Premium Single Monitor Arm Desk Mount",
    "description": "Polished aluminum monitor arm with patented Constant Force lift and pivot motion technology. Supports monitors up to 34 inches and 25 lbs.",
    "price": 16499,
    "category": "computers",
    "stock": 40,
    "images": [
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 2100,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000033",
    "name": "Breville Barista Touch Espresso Machine Stainless Steel",
    "description": "Automated touchscreen operation simplifies how to make your favorite cafe coffee in 3 easy steps: Grind, Brew, and Milk.",
    "price": 84999,
    "category": "home",
    "stock": 18,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 870,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000034",
    "name": "Ninja AF101 Air Fryer 4-Quart Capacity",
    "description": "Crisps with up to 75% less fat than traditional frying methods. Wide temperature range from 105 to 400 degrees Fahrenheit.",
    "price": 7999,
    "category": "home",
    "stock": 75,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 6420,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000035",
    "name": "iRobot Roomba j7+ Self-Emptying Robot Vacuum",
    "description": "Avoids pet waste and cords. Empties itself into the Clean Base automatic dirt disposal for up to 60 days.",
    "price": 54900,
    "category": "home",
    "stock": 22,
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"
    ],
    "ratingAvg": 4.3,
    "numReviews": 1100,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000036",
    "name": "Fellow Stagg EKG Electric Gooseneck Pour-Over Kettle",
    "description": "Variable temperature control with precision pour spout. Built-in stopwatch and LCD display screen.",
    "price": 14999,
    "category": "home",
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 730,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000037",
    "name": "GreenPan Paris Pro Ceramic Nonstick 11-Piece Cookware Set",
    "description": "Thermolon healthy ceramic nonstick coating free of PFAS, PFOA, lead, and cadmium. Hard anodized aluminum bodies.",
    "price": 21999,
    "category": "home",
    "stock": 28,
    "images": [
      "https://images.unsplash.com/photo-1584990347449-39906f97ef92?w=800&q=80"
    ],
    "ratingAvg": 4.5,
    "numReviews": 480,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000038",
    "name": "Hydro Flask 32 oz Wide Mouth with Straw Lid",
    "description": "TempShield double-wall vacuum insulation keeps drinks ice cold up to 24 hours or piping hot up to 12 hours.",
    "price": 3899,
    "category": "home",
    "stock": 140,
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 5320,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000039",
    "name": "Nespresso VertuoPlus Coffee and Espresso Machine by De'Longhi",
    "description": "Single-serve coffee and espresso system using Centrifusion extraction technology. Heats up in 25 seconds with motorized brew head.",
    "price": 16990,
    "category": "home",
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 3200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000040",
    "name": "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker 6 Qt",
    "description": "Replaces 9 kitchen appliances: pressure cooker, slow cooker, rice cooker, yogurt maker, steamer, sauté pan, sous vide, sterilizer, and food warmer.",
    "price": 11499,
    "category": "home",
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 8900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000041",
    "name": "Dyson V15 Detect Cordless Vacuum Cleaner (Laser Slim Fluffy)",
    "description": "Engineered for whole-home deep cleaning. Laser reveals invisible dust on hard floors with piezo sensor acoustic particle counting.",
    "price": 65900,
    "category": "home",
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 2450,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000042",
    "name": "Le Creuset Enameled Cast Iron Signature Round Dutch Oven 5.5 Qt",
    "description": "Iconic French enameled cast iron delivers superior heat distribution and retention. Ready to use with no seasoning required.",
    "price": 34500,
    "category": "home",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1584990347449-39906f97ef92?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 1870,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000043",
    "name": "KitchenAid Artisan Series 5-Quart Tilt-Head Stand Mixer",
    "description": "10 speeds to thoroughly mix, knead, and whip ingredients. Includes 5-quart stainless steel bowl, flat beater, dough hook, and wire whip.",
    "price": 39990,
    "category": "home",
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 9400,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000044",
    "name": "Philips Hue White and Color Ambiance 3-Bulb Smart Starter Kit",
    "description": "Transform home lighting with 16 million colors and shades of white light. Controlled via Hue app, Apple HomeKit, Alexa, and Google Assistant.",
    "price": 11999,
    "category": "home",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 2310,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000045",
    "name": "Vitamix 5200 Professional-Grade 64oz Blender",
    "description": "Variable speed control with aircraft-grade stainless steel blades designed to handle the toughest ingredients and create steaming hot soups in minutes.",
    "price": 44990,
    "category": "home",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 4520,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000046",
    "name": "COSORI Pro II Smart Air Fryer Oven 5.8-Quart Capacity",
    "description": "12 customizable one-touch cooking functions with smartphone app control and Alexa voice support. Dishwasher-safe nonstick basket.",
    "price": 9999,
    "category": "home",
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 7600,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000047",
    "name": "Zwilling J.A. Henckels Twin Signature 7-Piece Knife Block Set",
    "description": "Precision-stamped German stainless steel blades with ergonomic three-rivet handles and hardwood storage block.",
    "price": 17499,
    "category": "home",
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 1420,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000048",
    "name": "Ember Temperature Control Smart Mug 2 (14 oz, Black)",
    "description": "Keeps your hot drink at your exact preferred temperature (120°F - 145°F) for up to 80 minutes on a single charge or all day on the charging coaster.",
    "price": 12995,
    "category": "home",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
    ],
    "ratingAvg": 4.5,
    "numReviews": 2150,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000049",
    "name": "Levi's Men's 511 Slim Fit Stretch Jeans",
    "description": "A modern slim with room to move. Added stretch for all-day comfort and mobility.",
    "price": 2799,
    "category": "clothing",
    "stock": 110,
    "images": [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80"
    ],
    "ratingAvg": 4.4,
    "numReviews": 3200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000050",
    "name": "Columbia Men's Watertight II Waterproof Rain Jacket",
    "description": "Omni-Tech waterproof breathable seam-sealed jacket. Lightweight and packs down into its own hand pocket.",
    "price": 6499,
    "category": "clothing",
    "stock": 60,
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 1890,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000051",
    "name": "Nike Air Zoom Pegasus 40 Men's Running Shoes",
    "description": "Responsive cushioning with Nike React foam and dual Zoom Air units. Engineered mesh upper for breathable comfort.",
    "price": 9995,
    "category": "clothing",
    "stock": 70,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 2450,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000052",
    "name": "Ray-Ban Classic Polarized Aviator Sunglasses",
    "description": "Legendary teardrop shape with crystal polarized green lenses providing 100% UV protection.",
    "price": 10890,
    "category": "clothing",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 1740,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000053",
    "name": "Fossil Men's Derrick Leather RFID Blocking Bifold Wallet",
    "description": "100% genuine leather wallet with RFID blocking lining to help protect against unauthorized scans.",
    "price": 3495,
    "category": "clothing",
    "stock": 85,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 920,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000054",
    "name": "Patagonia Men's Classic Retro-X Windproof Fleece Jacket",
    "description": "Warm and windproof 100% polyester (85% recycled) bonded sherpa fleece with moisture-wicking warp-knit mesh lining.",
    "price": 18990,
    "category": "clothing",
    "stock": 35,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 1120,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000055",
    "name": "Nike Air Force 1 '07 Low Top Classic White Sneakers",
    "description": "The radiance lives on in the Nike Air Force 1 ’07, the b-ball icon that puts a fresh spin on stitched overlays and bold details.",
    "price": 8995,
    "category": "clothing",
    "stock": 90,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 6800,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000056",
    "name": "Adidas Originals Stan Smith Leather Sneakers",
    "description": "Timeless tennis court silhouette crafted from Primegreen high-performance recycled materials with signature perforated 3-Stripes.",
    "price": 7999,
    "category": "clothing",
    "stock": 75,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 4300,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000057",
    "name": "Champion Reverse Weave Heavyweight Crewneck Sweatshirt",
    "description": "Cut on the cross-grain to resist vertical shrinkage with signature ribbed side panels for maximum range of motion.",
    "price": 4499,
    "category": "clothing",
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 3150,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000058",
    "name": "Under Armour Men's Tech 2.0 Short-Sleeve T-Shirt (3-Pack)",
    "description": "UA Tech fabric is quick-drying, ultra-soft, and has a more natural feel. Anti-odor technology prevents the growth of odor-causing microbes.",
    "price": 4999,
    "category": "clothing",
    "stock": 120,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 5400,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000059",
    "name": "Carhartt Men's Loose Fit Heavyweight Long-Sleeve Pocket T-Shirt",
    "description": "Durable 6.75-ounce 100% cotton jersey knit with rib-knit crewneck, side-seam construction, and left-chest pocket.",
    "price": 2299,
    "category": "clothing",
    "stock": 150,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 8900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000060",
    "name": "The North Face Borealis Commuter Laptop Backpack 28L",
    "description": "FlexVent suspension system certified by the American Chiropractic Association. Dedicated protective 15\" laptop compartment and front bungee system.",
    "price": 7990,
    "category": "clothing",
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 4210,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000061",
    "name": "Timberland Men's 6-Inch Premium Waterproof Leather Boots",
    "description": "Direct-attach, seam-sealed waterproof construction keeps feet dry in any weather. 400 grams of PrimaLoft insulation and anti-fatigue footbed.",
    "price": 15999,
    "category": "clothing",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 3800,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000062",
    "name": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "description": "By Robert C. Martin. Learn how to write robust, maintainable, and readable code through timeless principles and practical examples.",
    "price": 1299,
    "category": "books",
    "stock": 95,
    "images": [
      "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 4890,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000063",
    "name": "Designing Data-Intensive Applications",
    "description": "By Martin Kleppmann. The definitive guide to the architecture of storage engines, distributed consensus, and scalable data processing.",
    "price": 1699,
    "category": "books",
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 5310,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000064",
    "name": "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    "description": "By James Clear. Revolutionary framework for improving every day through tiny changes that deliver remarkable long-term results.",
    "price": 499,
    "category": "books",
    "stock": 200,
    "images": [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 12400,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000065",
    "name": "The Pragmatic Programmer: Your Journey to Mastery",
    "description": "By David Thomas & Andrew Hunt. 20th Anniversary Edition covering career development, software design, and architectural best practices.",
    "price": 1499,
    "category": "books",
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 2980,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000066",
    "name": "System Design Interview – An Insider's Guide (Volume 1)",
    "description": "By Alex Xu. Step-by-step framework to ace system design interviews at FAANG and top tech companies with real-world architectural diagrams.",
    "price": 2499,
    "category": "books",
    "stock": 85,
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 3600,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000067",
    "name": "Thinking, Fast and Slow by Daniel Kahneman",
    "description": "Nobel Memorial Prize winner Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast/emotional) and System 2 (slow/logical).",
    "price": 499,
    "category": "books",
    "stock": 110,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 8900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000068",
    "name": "Sapiens: A Brief History of Humankind by Yuval Noah Harari",
    "description": "From renowned historian Yuval Noah Harari, a groundbreaking narrative of humanity’s creation and evolution from hunter-gatherers to global masters.",
    "price": 399,
    "category": "books",
    "stock": 130,
    "images": [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 11200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000069",
    "name": "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
    "description": "By Morgan Housel. Doing well with money isn’t necessarily about what you know. It’s about how you behave. 19 short stories exploring how people think about money.",
    "price": 349,
    "category": "books",
    "stock": 140,
    "images": [
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 9800,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000070",
    "name": "Steve Jobs: The Exclusive Biography by Walter Isaacson",
    "description": "Based on more than forty interviews with Jobs conducted over two years, Walter Isaacson tells the astonishing story of the roller-coaster life and creative genius.",
    "price": 699,
    "category": "books",
    "stock": 75,
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 6100,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000071",
    "name": "Dune: Deluxe Edition Hardcover by Frank Herbert",
    "description": "Frank Herbert’s masterpiece—one of the greatest sci-fi epics of all time. Deluxe collector’s edition with custom endpapers and stained edges.",
    "price": 1899,
    "category": "books",
    "stock": 90,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 7450,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000072",
    "name": "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
    "description": "Adjusts from 5 to 52.5 lbs in 2.5 lb increments. Replaces 15 sets of weights for space-efficient home workouts.",
    "price": 36990,
    "category": "sports",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 3120,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000073",
    "name": "Manduka PRO Yoga Mat Extra Thick 6mm",
    "description": "High-density cushion and joint protection with proprietary dot-pattern bottom to prevent slipping on any floor surface.",
    "price": 9999,
    "category": "sports",
    "stock": 50,
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80"
    ],
    "ratingAvg": 4.6,
    "numReviews": 1450,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000074",
    "name": "Coleman Sundome Camping Tent 4-Person Waterproof",
    "description": "WeatherTec system with patented welded floors and inverted seams to keep water out. Sets up in under 10 minutes.",
    "price": 6999,
    "category": "sports",
    "stock": 38,
    "images": [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
    ],
    "ratingAvg": 4.5,
    "numReviews": 2870,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000075",
    "name": "Fitbit Charge 6 Fitness Tracker with Built-in GPS",
    "description": "Heart rate tracking on exercise equipment, 40+ exercise modes, built-in GPS, active zone minutes, and 7-day battery life.",
    "price": 14999,
    "category": "sports",
    "stock": 65,
    "images": [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80"
    ],
    "ratingAvg": 4.3,
    "numReviews": 1940,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000076",
    "name": "YETI Tundra 45 Hard Cooler with PermaFrost Insulation",
    "description": "Rotomolded construction makes it armored to the core and virtually indestructible. FatWall design holds up to two inches of pressure-injected insulation.",
    "price": 27990,
    "category": "sports",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 3800,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000077",
    "name": "Wilson Evolution Game Indoor Official Basketball",
    "description": "Cushion Core Carcass combines low-density sponge rubber and ultra-durable butyl rubber for exceptional feel and grip.",
    "price": 5499,
    "category": "sports",
    "stock": 70,
    "images": [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80"
    ],
    "ratingAvg": 4.9,
    "numReviews": 7200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000078",
    "name": "TRX All-in-One Bodyweight Suspension Training System",
    "description": "Portable full-body workout system utilizing your bodyweight and gravity. Anchors in seconds to any door, beam, or post.",
    "price": 13999,
    "category": "sports",
    "stock": 45,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 2900,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000079",
    "name": "Theragun Prime Percussive Deep Tissue Therapy Massage Gun",
    "description": "Smart percussive therapy device with Bluetooth connectivity. Reaches 60% deeper into muscle than consumer-grade vibration massagers.",
    "price": 24990,
    "category": "sports",
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 1850,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000080",
    "name": "Black Diamond Storm 500-R Rechargeable Headlamp",
    "description": "Emits 500 lumens on max setting with PowerTap technology for instant transition between full and dimmed power. IP67 waterproof.",
    "price": 5999,
    "category": "sports",
    "stock": 80,
    "images": [
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&q=80"
    ],
    "ratingAvg": 4.7,
    "numReviews": 960,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  },
  {
    "_id": "65df10000000000000000081",
    "name": "Osprey Atmos AG 65 Men's Backpacking Backpack",
    "description": "Anti-Gravity suspension system with continuous backpanel of lightweight mesh. Custom Fit-on-the-Fly hipbelt and harness.",
    "price": 26500,
    "category": "sports",
    "stock": 20,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    "ratingAvg": 4.8,
    "numReviews": 1200,
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-15T08:00:00.000Z"
  }
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    _id: '65df20000000000000000001',
    product: '65df10000000000000000001',
    user: {
      _id: '65df00000000000000000001',
      name: 'Sarah Jenkins',
    },
    rating: 5,
    title: 'Absolute game changer for flights!',
    comment:
      'The noise cancellation on these Sony headphones is incredible. I wore them on a 10-hour flight and could barely hear the engine hum.',
    createdAt: '2026-02-01T14:30:00.000Z',
  },
  {
    _id: '65df20000000000000000002',
    product: '65df10000000000000000001',
    user: {
      _id: '65df00000000000000000002',
      name: 'Alex Rivera',
    },
    rating: 4,
    title: 'Great sound quality, comfortable fit',
    comment:
      'Sound profile is balanced and bass is punchy without being overwhelming. The touch controls take a little getting used to.',
    createdAt: '2026-02-10T09:15:00.000Z',
  },
  {
    _id: '65df20000000000000000003',
    product: '65df10000000000000000007',
    user: {
      _id: '65df00000000000000000003',
      name: 'David Chen',
    },
    rating: 5,
    title: 'Best ultrabook I have ever owned',
    comment:
      'The M3 MacBook Air is super fast, completely silent, and battery lasts all day and night. Screen is gorgeous.',
    createdAt: '2026-02-14T18:45:00.000Z',
  },
];
