const express = require('express');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Use default system DNS if override fails
}
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config();

const app = express();
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API routes
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/canteenDB';

const seedItems = async () => {
  try {
    // Remove quantity field from all existing items in DB
    await Item.updateMany({}, { $unset: { quantity: 1 } });

    // Wipe items that are missing price (old schema) and re-seed
    await Item.deleteMany({ price: { $exists: false } });

    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany([
        { name: 'Pizza',    price: 120, icon: '🍕' },
        { name: 'Burger',   price: 80,  icon: '🍔' },
        { name: 'Pasta',    price: 100, icon: '🍝' },
        { name: 'Sandwich', price: 60,  icon: '🥪' }
      ]);
      console.log('Items seeded without quantity');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedItems();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
