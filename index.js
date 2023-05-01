// imports
import express from 'express'

const app = express()
let port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello ODC')
})

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`)
})