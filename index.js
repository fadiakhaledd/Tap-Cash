import express from 'express'
const app = express()
let port = process.env.PORT || 3000

app.use(express.json());

// Import routers
import AuthRouter from "./routes/AuthenticationRouters.js"
import userRouter from "./routes/UserRouters.js"
import transactionRouter from "./routes/TransactionRouters.js"
import fundRouter from "./routes/FundsRouters.js"
import VCCRouter from "./routes/VirtualCreditCardRouter.js"



// Use routers
app.use('/auth', AuthRouter);
app.use('/users', userRouter);
app.use('/transactions', transactionRouter);
app.use('/funds', fundRouter)
app.use('/VCC', VCCRouter)


// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})