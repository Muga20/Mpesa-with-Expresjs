const express = require('express');
const { initiateSTKPush, stkPushCallback, confirmPayment } = require('../controllers/lipanampesa.js');
const { validatePaymentInput } = require('../middlewares/validatePaymentInput.js');


const router = express.Router();

router.post('/stkPush', validatePaymentInput, initiateSTKPush);
router.post('/stkPushCallback/:Order_ID' , stkPushCallback);
router.get('/confirmPayment/:CheckoutRequestID', confirmPayment);

export default router;
