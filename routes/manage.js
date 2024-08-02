import express from 'express';
import { getTransactions } from '../controllers/transactionsController.js';

const router = express.Router();

// Route to get transactions
router.get('/transactions', getTransactions);

export default router;
