import express from 'express'
const app = express()
let port = process.env.PORT || 3000

app.use(express.json());

// Import routers
import AuthRouter from "./routes/AuthenticationRouters.js"



// Use routers
app.use('/auth', AuthRouter);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})