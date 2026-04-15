import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './models/db';
import Product from './models/Product';

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones.',
    category: 'Audio',
    price: 348.00,
    rating: 4.8,
    available: true,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    name: 'Apple AirPods Pro 2nd Gen',
    description: 'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.',
    category: 'Audio',
    price: 249.99,
    rating: 4.7,
    available: true,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80',
  },
  {
    name: 'JBL Charge 5 Portable Speaker',
    description: 'Powerful JBL Original Pro Sound with deep bass. IP67 waterproof and dustproof. 20 hours of playtime.',
    category: 'Audio',
    price: 179.95,
    rating: 4.6,
    available: true,
    stock: 67,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Quiet clicks. 8K DPI tracking on any surface. USB-C quick charging. Ergonomic design for productivity.',
    category: 'Accessories',
    price: 99.99,
    rating: 4.9,
    available: true,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    description: 'Wireless mechanical keyboard with Gateron switches. Compact 75% layout. Mac and Windows compatible.',
    category: 'Accessories',
    price: 89.99,
    rating: 4.5,
    available: true,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  },
  {
    name: 'Samsung 27" 4K Monitor',
    description: 'UHD 4K resolution with IPS panel. HDR10 support. USB-C connectivity with 90W power delivery.',
    category: 'Office',
    price: 449.99,
    rating: 4.6,
    available: true,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  },
  {
    name: 'Rain Design mStand Laptop Stand',
    description: 'Elevate your laptop for ergonomic viewing. Sand-blasted aluminum finish matches your MacBook perfectly.',
    category: 'Office',
    price: 49.99,
    rating: 4.8,
    available: true,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1527434261542-bbd73e5e6324?w=600&q=80',
  },
  {
    name: 'Anker PowerCore 26800 Power Bank',
    description: 'Ultra high capacity 26800mAh. Dual input charging. PowerIQ technology for optimal charging speed.',
    category: 'Accessories',
    price: 65.99,
    rating: 4.4,
    available: true,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced health features including blood oxygen and ECG. Always-On Retina display. S9 SiP chip.',
    category: 'Wearables',
    price: 399.00,
    rating: 4.7,
    available: true,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80',
  },
  {
    name: 'Fitbit Charge 6 Fitness Tracker',
    description: 'Built-in GPS. 24/7 heart rate monitoring. Stress management score. 7 day battery life.',
    category: 'Wearables',
    price: 159.95,
    rating: 4.3,
    available: true,
    stock: 90,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
  },
  {
    name: 'Philips Hue Smart Bulb Starter Kit',
    description: '4 smart bulbs with hub. 16 million colors. Voice control with Alexa and Google Home.',
    category: 'Home',
    price: 199.99,
    rating: 4.5,
    available: true,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals microscopic dust. Intelligently optimizes suction power. Up to 60 minutes of run time.',
    category: 'Home',
    price: 749.99,
    rating: 4.8,
    available: false,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
  },
  {
    name: 'Bose QuietComfort Earbuds',
    description: 'World-class noise cancellation. Comfortable secure fit. CustomTune sound calibration technology.',
    category: 'Audio',
    price: 279.00,
    rating: 4.6,
    available: true,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80',
  },
  {
    name: 'Kindle Paperwhite 11th Gen',
    description: '6.8" display with adjustable warm light. Waterproof design. Weeks of battery life on a single charge.',
    category: 'Electronics',
    price: 139.99,
    rating: 4.7,
    available: true,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=600&q=80',
  },
  {
    name: 'Ember Temperature Control Mug',
    description: 'Keep your coffee at the perfect temperature for up to 1.5 hours. App-controlled smart mug.',
    category: 'Home',
    price: 129.95,
    rating: 4.2,
    available: true,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
  },
  {
    name: 'iPad Air M2 Chip',
    description: 'M2 chip for next-level performance. 11" Liquid Retina display. Works with Apple Pencil Pro.',
    category: 'Electronics',
    price: 599.00,
    rating: 4.8,
    available: true,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  },
  {
    name: 'Herman Miller Aeron Chair',
    description: 'Ergonomic office chair with PostureFit SL. 8Z Pellicle suspension. 12-year warranty.',
    category: 'Office',
    price: 1395.00,
    rating: 4.9,
    available: false,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80',
  },
  {
    name: 'Nintendo Switch OLED',
    description: '7-inch OLED screen with vivid colors. Wide adjustable stand. Enhanced audio. 64GB internal storage.',
    category: 'Electronics',
    price: 349.99,
    rating: 4.7,
    available: true,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
  },
  {
    name: 'Sonos One SL Smart Speaker',
    description: 'Rich, room-filling sound with two Class-D amplifiers. Trueplay tuning. AirPlay 2 compatible.',
    category: 'Audio',
    price: 199.00,
    rating: 4.5,
    available: true,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
  },
  {
    name: 'Garmin Venu 3 Smartwatch',
    description: 'Advanced health and fitness features. Body Battery energy monitoring. Up to 14 days battery life.',
    category: 'Wearables',
    price: 449.99,
    rating: 4.6,
    available: true,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('🌱 Seeding products...');
    await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
