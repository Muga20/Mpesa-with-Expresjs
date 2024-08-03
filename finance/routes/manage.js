const express = require('express');
const { getTransactions } = require('../controllers/transactionsController.js');

const router = express.Router();

// Route to get transactions
router.get('/transactions', getTransactions);

export default router;
