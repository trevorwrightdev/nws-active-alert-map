const express = require('express')
const app = express()
const port = 3001

const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
