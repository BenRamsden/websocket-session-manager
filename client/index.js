const {AUTHENTICATE, AUTHENTICATE_SUCCESS, CHECK_CONNECTIONS} = require("../shared-helpers/constants")

const WebSocket = require('ws');
const { toEvent } = require('../shared-helpers/event')

class User {
    constructor(userId) {
        this.userId = userId
        this.connections = []
    }

    connect() {
        const s = new WebSocket('ws://localhost:3000/');
        s.addEventListener('error', (m) => {
            console.log("error")
        })
        s.addEventListener('open',m => {
            s.send(JSON.stringify({
                type:AUTHENTICATE,
                payload: this.userId
            }))
        })
        s.addEventListener('message', (m) => {
            const event = toEvent(m.data)
            console.log(event)

            if(event.type===AUTHENTICATE_SUCCESS) {
                s.send(JSON.stringify({
                    type:CHECK_CONNECTIONS,
                    payload:null
                }))
            }
        })
        this.connections.push(s)
    }

    disconnect() {
        if(this.connections.length===0) {
            throw new Error("Cannot disconnect, no connections")
        }

        this.connections[this.connections.length-1].close()
    }
}

module.exports = {
    User
}