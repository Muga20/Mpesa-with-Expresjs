import express from 'express'
const router = express.Router()
import {
    initiateSTKPush,
    stkPushCallback,
    confirmPayment
} from "../controllers/lipanampesa.js";


import {accessToken} from "../middlewares/generateAccessToken.js";

router.route('/stkPush').post(accessToken,initiateSTKPush)
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback)
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment)

export default router
