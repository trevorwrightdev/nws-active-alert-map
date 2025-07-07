const express = require('express')
const app = express()
const port = 3001

const cors = require('cors')
app.use(cors())

const alertsRouter = require('./routes/alerts')
app.use('/alerts', alertsRouter)

app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
