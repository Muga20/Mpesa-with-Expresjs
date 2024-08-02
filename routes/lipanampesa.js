import express from 'express';
import { initiateSTKPush, stkPushCallback, confirmPayment } from '../controllers/lipanampesa.js';
import { validatePaymentInput } from '../middlewares/validatePaymentInput.js'


const router = express.Router();

router.post('/stkPush', validatePaymentInput, initiateSTKPush);
router.post('/stkPushCallback/:Order_ID' , stkPushCallback);
router.get('/confirmPayment/:CheckoutRequestID', confirmPayment);

export default router;
