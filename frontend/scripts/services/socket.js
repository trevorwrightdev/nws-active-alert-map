import { API_BASE_URL } from './api.js'

export const socket = io(API_BASE_URL)

export function initializeSocket() {
    socket.on('connect', () => {
        console.log('Connected to server')
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from server')
    })
}
