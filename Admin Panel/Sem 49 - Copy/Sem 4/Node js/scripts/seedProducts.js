require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../Models/Product');

let MONGO_URI = process.env.MONGO_URI || process.env.E_commerce || 'mongodb://localhost:27017/Ecommerce';

// sanitize MONGO_URI if it contains an extra path segment like '/Ecommerce/Products'
try {
  const url = new URL(MONGO_URI);
  // if pathname contains more than one segment, keep only the first (database name)
  if (url.pathname && url.pathname.split('/').filter(Boolean).length > 1) {
    const firstDb = '/' + url.pathname.split('/').filter(Boolean)[0];
    url.pathname = firstDb;
    MONGO_URI = url.toString();
  }
} catch (e) {
  // fallback: attempt simple string fix
  const parts = MONGO_URI.split('/');
  if (parts.length > 3) {
    // mongodb://host:port/db/other -> keep first db
    MONGO_URI = parts.slice(0, 3).join('/') + '/' + parts[3];
  }
}

const products = [
  {
    name: 'Apex Legion Mechanical Keyboard',
    price: 7999,
    description: 'RGB mechanical keyboard with hot-swappable switches and aircraft-grade aluminum frame.',
    image: 'https://images.unsplash.com/photo-1616628180680-6f7ae1d3e1a4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d',
    category: 'Peripherals'
  },
  {
    name: 'Phantom Edge Gaming Mouse',
    price: 2999,
    description: 'Ergonomic gaming mouse with adjustable DPI and programmable buttons.',
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e',
    category: 'Peripherals'
  },
  {
    name: 'Nebula Pro Headset',
    price: 4999,
    description: 'Surround sound gaming headset with noise-cancelling mic and memory foam earcups.',
    image: 'https://images.unsplash.com/photo-1592012872309-cf40a9af6c9a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4d5e6f',
    category: 'Audio'
  },
  {
    name: 'Vortex 144Hz Gaming Monitor',
    price: 24999,
    description: '27-inch 144Hz IPS gaming monitor with 1ms response time and adaptive sync.',
    image: 'https://images.unsplash.com/photo-1585079549614-8f3d9e9b1a3d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=4d5e6f7g',
    category: 'Displays'
  },
  {
    name: 'Titanium RGB Gaming Chair',
    price: 8999,
    description: 'Adjustable racing-style gaming chair with lumbar support and RGB accents.',
    image: 'https://images.unsplash.com/photo-1598300057202-3b7f5b0b7b7f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5e6f7g8h',
    category: 'Furniture'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB:', MONGO_URI);

    // Optionally clear existing products (commented out to avoid data loss)
    // await Product.deleteMany({});

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log('Inserted:', p.name);
      } else {
        // if product exists but category is missing, update it
        if ((!exists.category || exists.category === '') && p.category) {
          exists.category = p.category;
          await exists.save();
          console.log('Updated category for:', p.name);
        } else {
          console.log('Already exists:', p.name);
        }
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
