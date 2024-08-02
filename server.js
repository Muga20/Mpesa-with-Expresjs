import express from "express";
import cors from "cors";
import 'dotenv/config';

import lipaNaMpesaRoutes from "./routes/lipanampesa.js";
import transactionsRoutes from "./routes/manage.js";

import { accessToken } from "./middlewares/generateAccessToken.js";

// Initialize express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Middleware to set Safaricom access token
app.use(accessToken);

// Import routes
app.use('/api', lipaNaMpesaRoutes ,transactionsRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
