
# M-Pesa STK Push Integration

This project demonstrates how to integrate Safaricom's M-Pesa STK push functionality into a Node.js application. It includes routes to initiate an STK push, handle callbacks, and confirm payments.

## Environment Variables

Ensure that you have the following environment variables set in your `.env` file:

```env
# Safaricom API Credentials
SAFARICOM_CONSUMER_KEY=
SAFARICOM_CONSUMER_SECRET=
PASS_KEY=
BUSINESS_SHORT_CODE=

# Server Configuration
PORT=

# Database Configuration
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=l
DB_DIALECT=
```

## Installation

1. Clone the repository:

    ```bash
    git clone (https://github.com/Muga20/Mpesa-with-Expresjs)
    ```

2. Navigate to the project directory:

    ```bash  Mpesa-with-Expresjs
    cd 
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory of the project and add the environment variables listed above.

## Running the Application

1. Start the server:

    ```bash
    npm start
    ```

   This will start the server on the port specified in the `PORT` environment variable (default: `5000`).

## Endpoints

### Initiate STK Push

- **Method:** POST
- **Route:** `/api/stkPush`
- **Body:**

    ```json
    {
      "amount": <amount>,
      "phone": <phone-number>,
      "Order_ID": <order-id>
    }
    ```

- **Description:** Initiates an STK push request.

### STK Push Callback

- **Method:** POST
- **Route:** `/api/stkPushCallback/:Order_ID`
- **Description:** Handles the callback from Safaricom for STK push status updates.

### Confirm Payment

- **Method:** GET
- **Route:** `/api/confirmPayment/:CheckoutRequestID`
- **Description:** Checks the status of a payment request from Safaricom.

## Configuration

- **Safaricom Credentials:** Update the `SAFARICOM_CONSUMER_KEY`, `SAFARICOM_CONSUMER_SECRET`, `PASS_KEY`, and `BUSINESS_SHORT_CODE` with your Safaricom credentials.
- **Database:** Configure the database settings in the `.env` file. Ensure that the database specified in `DB_NAME` exists and is accessible with the provided `DB_USER` and `DB_PASSWORD`.

## Troubleshooting

- **Ngrok Issues:** If using Ngrok, ensure it is running and the URL is correctly configured in your environment variables or callback URLs.
- **Token Expiration:** If you encounter issues with token expiration, make sure that your application properly handles token refresh.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to adjust any details according to your project's specific requirements!