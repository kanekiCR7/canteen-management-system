const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');

// Create new order — price fetched from DB, never hardcoded
router.post('/', async (req, res) => {
  try {
    const { customerName, foodItem, quantity, phoneNumber } = req.body;

    const item = await Item.findOne({ name: foodItem });
    if (!item) {
      return res.status(404).json({ message: `Item "${foodItem}" not found in database.` });
    }

    const amount = item.price * Number(quantity);

    const newOrder = new Order({
      customerName,
      foodItem,
      quantity: Number(quantity),
      phoneNumber,
      amount,
      paymentStatus: 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Confirm payment for an order
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    let order;

    if (orderId && !orderId.startsWith('temp-')) {
      order = await Order.findByIdAndUpdate(
        orderId,
        { paymentMethod, paymentStatus: 'Confirmed' },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
