const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const app = express()
const port = 3001

const IDLE_TIMEOUT_IN_MINUTES = 2

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

const io = new Server(server, {
    cors: corsOptions,
    connectionStateRecovery: {
        maxDisconnectionDuration: IDLE_TIMEOUT_IN_MINUTES * 60 * 1000,
        skipMiddlewares: true,
    },
})

io.on('connection', socket => {
    console.log(socket.id + ' connected.')
})

const alertsRouter = require('./routes/alerts')
app.use('/alerts', alertsRouter)

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
