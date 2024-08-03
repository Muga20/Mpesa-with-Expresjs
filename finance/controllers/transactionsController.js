const StkRequest = require('../model/stkRequest.js');
const { Op } = require('sequelize');

// Controller to get transactions made today and by status
export const getTransactions = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get all transactions made today
    const transactionsToday = await StkRequest.findAll({
      where: {
        TransactionDate: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    // Count of transactions made today
    const countToday = transactionsToday.length;

    // Get transactions by status
    const statuses = ['paid', 'completed', 'failed', 'initiated'];
    const transactionsByStatus = {};

    for (const status of statuses) {
      transactionsByStatus[status] = await StkRequest.findAll({
        where: { status: status }
      });
    }

    res.status(200).json({
      countToday,
      transactionsToday,
      transactionsByStatus
    });

    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Failed to fetch transactions');
  }
};
