const { Server } = require('socket.io')
const { getAlerts } = require('../utils/get-alerts')

function initializeSocket(server, corsOptions) {
    const io = new Server(server, {
        cors: corsOptions,
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        },
    })

    io.on('connection', socket => {
        console.log(socket.id + ' connected.')
    })

    setInterval(async () => {
        const { data, error } = await getAlerts()

        if (!error) {
            io.emit('alerts-update', data)
        }
    }, 60000)

    return io
}

module.exports = { initializeSocket }
