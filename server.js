const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/walletfy', {
  family: 4
})
.then(() => console.log('🟢 Connected to MongoDB successfully'))
.catch(err => console.error('❌ Database connection error:', err));
const transactionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// --- الـ Routes (Endpoints) ---

// 1. جلب كل المعاملات
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. إضافة معاملة جديدة
app.post('/api/transactions', async (req, res) => {
    try {
        const { text, amount, type, category } = req.body;
        const newTransaction = new Transaction({ text, amount, type, category });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});