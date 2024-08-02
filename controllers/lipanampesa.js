import axios from "axios";
import 'dotenv/config';
import StkRequest from '../model/stkRequest.js';


// @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
export const initiateSTKPush = async (req, res) => {
    try {
        const { amount, phone, Order_ID } = req.body;

        const auth = "Bearer " + req.safaricom_access_token

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

        // Save initial payment details in MySQL
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
        console.error('Error simulating STK push:', error);
        res.status(500).send('Failed to simulate STK push');
    }
};


// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const stkPushCallback = async (req, res) => {
    try {
        // order id
        const { Order_ID } = req.params;

        // callback details
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        } = req.body.Body.stkCallback;

        console.log(req.body.Body.stkCallback);

        if (ResultCode === 1032) {
            // User canceled the request
            await StkRequest.update(
                { status: 'canceled' },
                { where: { CheckoutRequestID } }
            );

            console.log(`Request with CheckoutRequestID: ${CheckoutRequestID} was canceled by user.`);

            res.json({ message: 'Request canceled by user' });
            return;
        } else if (ResultCode === 0) {
            // Transaction was successful
            if (!CallbackMetadata || !CallbackMetadata.Item) {
                throw new Error('CallbackMetadata or Item is undefined');
            }

            // get the meta data from the meta
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
            // Handle other ResultCodes
            await StkRequest.update(
                { status: 'failed' },
                { where: { CheckoutRequestID } }
            );

            console.log(`Request with CheckoutRequestID: ${CheckoutRequestID} failed with ResultCode: ${ResultCode}`);
            res.json({ message: `Request failed with ResultCode: ${ResultCode}` });
        }
    } catch (e) {
        console.error("Error while trying to update LipaNaMpesa details from the callback", e);
        res.status(503).send({
            message: "Something went wrong with the callback",
            error: e.message
        });
    }
};



// @desc Check from safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access public
export const confirmPayment = async (req, res) => {
    try {
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
        
        const auth = "Bearer " + req.safaricom_access_token;

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);

        //shortcode + passkey + timestamp
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
        console.error("Error while trying to create LipaNaMpesa details", e);
        res.status(503).send({
            message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error: e.message
        });
    }
};


