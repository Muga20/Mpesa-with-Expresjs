import express from "express";
import cors from "cors";
import 'dotenv/config'
import lipaNaMpesaRoutes from "./routes/lipanampesa.js"

// initialize express
const app = express()

// middlewares
app.use(express.json())
app.use(cors())

// import routes
app.use('/api',lipaNaMpesaRoutes)

const port = process.env.PORT

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
