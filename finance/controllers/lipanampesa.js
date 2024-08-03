const axios = require('axios');
require('dotenv').config();
const StkRequest = require('../model/stkRequest.js');
const axiosRetry = require('axios-retry');


axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// @desc Initiate STK push
// @method POST
// @route /stkPush
// @access Public
export const initiateSTKPush = async (req, res) => {
    try {
        const { amount, phone, Order_ID } = req.body;
        const auth = "Bearer " + req.safaricom_access_token;
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortCode = process.env.BUSINESS_SHORT_CODE;
        const passKey = process.env.PASS_KEY;
        const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phone,
            PartyB: shortCode,
            PhoneNumber: phone,
            CallBackURL: `https://69c3-41-209-57-168.ngrok-free.app/api/stkPushCallback/${Order_ID}`,
            AccountReference: 'Ekazi Online',
            TransactionDesc: 'Paid online'
        };

        const response = await axios.post('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
            headers: {
                Authorization: auth,
                'Content-Type': 'application/json',
            }
        });

        await StkRequest.create({
            phone,
            amount,
            reference: 'Ekazi Jobs',
            description: 'Paid online',
            BusinessShortCode: shortCode,
            CheckoutRequestID: response.data.CheckoutRequestID,
            status: 'initiated',
        });

        res.status(200).json({ ...response.data });

    } catch (error) {
        console.error('Error initiating STK push:', error);
        res.status(500).send('Failed to initiate STK push');
    }
};

// @desc Callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access Public
export const stkPushCallback = async (req, res) => {
    try {
        const { Order_ID } = req.params;
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = req.body.Body.stkCallback;

        console.log(req.body.Body.stkCallback);

        if (ResultCode === 1032) {
            await StkRequest.update(
                { status: 'canceled' },
                { where: { CheckoutRequestID } }
            );
            console.log(`Request with CheckoutRequestID: ${CheckoutRequestID} was canceled by user.`);
            res.json({ message: 'Request canceled by user' });
            return;
        } else if (ResultCode === 0) {
            if (!CallbackMetadata || !CallbackMetadata.Item) {
                throw new Error('CallbackMetadata or Item is undefined');
            }

            const meta = Object.values(await CallbackMetadata.Item);
            const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber')?.Value?.toString();
            const Amount = meta.find(o => o.Name === 'Amount')?.Value?.toString();
            const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber')?.Value?.toString();
            const TransactionDate = meta.find(o => o.Name === 'TransactionDate')?.Value?.toString();

            if (!PhoneNumber || !Amount || !MpesaReceiptNumber || !TransactionDate) {
                throw new Error('One or more required fields are missing in CallbackMetadata');
            }

            await StkRequest.update(
                {
                    status: 'paid',
                    phone: PhoneNumber,
                    amount: Amount,
                    MpesaReceiptNumber: MpesaReceiptNumber,
                    description: 'Paid online',
                    ResultDesc : ResultDesc,
                    TransactionDate: TransactionDate
                },
                { where: { CheckoutRequestID } }
            );

            console.log("-".repeat(20), " OUTPUT IN THE CALLBACK ", "-".repeat(20));
            console.log(`
                Order_ID : ${Order_ID},
                MerchantRequestID : ${MerchantRequestID},
                CheckoutRequestID: ${CheckoutRequestID},
                ResultCode: ${ResultCode},
                ResultDesc: ${ResultDesc},
                PhoneNumber : ${PhoneNumber},
                Amount: ${Amount},
                MpesaReceiptNumber: ${MpesaReceiptNumber},
                TransactionDate : ${TransactionDate}
            `);

            res.json(true);
        } else {
            await StkRequest.update(
                { status: 'failed' },
                { where: { CheckoutRequestID } }
            );
            console.log(`Request with CheckoutRequestID: ${CheckoutRequestID} failed with ResultCode: ${ResultCode}`);
            res.json({ message: `Request failed with ResultCode: ${ResultCode}` });
        }
    } catch (e) {
        console.error("Error while updating LipaNaMpesa details from the callback", e);
        res.status(503).send({
            message: "Something went wrong with the callback",
            error: e.message
        });
    }
};

// @desc Check from Safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access Public
export const confirmPayment = async (req, res) => {
    try {
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
        const auth = "Bearer " + req.safaricom_access_token;
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64');

        const payload = {
            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: req.params.CheckoutRequestID
        };

        console.log('Request URL:', url);
        console.log('Payload:', payload);

        const response = await axios.post(url, payload, {
            headers: {
                "Authorization": auth,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);

    } catch (e) {
        console.error("Error while confirming LipaNaMpesa details", e);
        res.status(503).send({
            message: "Something went wrong while confirming LipaNaMpesa details. Contact admin",
            error: e.message
        });
    }
};
