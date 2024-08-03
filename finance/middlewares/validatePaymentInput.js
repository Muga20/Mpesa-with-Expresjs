const { body, validationResult } =require ('express-validator');

// Middleware for validation
export const validatePaymentInput = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('Order_ID').isLength({ min: 2, max: 16 }).withMessage('Order ID must be between 2 and 16 characters long')
  .isNumeric().withMessage('Order ID must be numeric'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


