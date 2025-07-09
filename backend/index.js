const express = require('express')
const http = require('http')
const cors = require('cors')
const { initializeSocket } = require('./services/socket')
const alertsRouter = require('./routes/alerts')
const app = express()
const port = 3001

const allowedOrigins = ['http://localhost:3000']

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
}

app.use(cors(corsOptions))

const server = http.createServer(app)

initializeSocket(server, corsOptions)

app.use('/alerts', alertsRouter)

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
