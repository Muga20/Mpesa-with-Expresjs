import request from "request";
import 'dotenv/config';

let cachedToken = null;
let tokenExpirationTime = null;

export const accessToken = (req, res, next) => {
    if (cachedToken && tokenExpirationTime && new Date() < tokenExpirationTime) {
        req.safaricom_access_token = cachedToken;
        return next();
    }

    try {
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const auth = new Buffer.from(`${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`).toString('base64');

        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    res.status(401).send({
                        "message": 'Something went wrong when trying to process your payment',
                        "error": error.message
                    });
                } else {
                    const { access_token, expires_in } = JSON.parse(body);
                    cachedToken = access_token;
                    tokenExpirationTime = new Date(new Date().getTime() + expires_in * 1000);
                    req.safaricom_access_token = access_token;
                    next();
                }
            }
        );
    } catch (error) {
        console.error("Access token error ", error);
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error": error.message
        });
    }
};
