const express = require('express');
const cors = require('cors');
require('dotenv').config();

const lipaNaMpesaRoutes = require('./finance/routes/lipanampesa.js');
const transactionsRoutes = require('./finance/routes/manage.js');
const { accessToken } = require('./finance/middlewares/generateAccessToken.js');

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
