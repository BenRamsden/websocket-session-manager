const {AUTHENTICATE, AUTHENTICATE_SUCCESS, AUTHENTICATE_FAILURE, BYE} = require("../shared-helpers/constants")

const WebSocket = require('ws');
const { toEvent } = require('../shared-helpers/event')

class User {
    constructor(userId) {
        this.userId = userId
        this.connections = []
    }

    connect(callback) {
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
                callback() //callback for jest
            } else if(event.type===AUTHENTICATE_FAILURE) {
                callback(event.payload)
            }
        })
        this.connections.push(s)
    }

    disconnect(callback) {
        if(this.connections.length===0) {
            throw new Error("Cannot disconnect, no connections")
        }

        const s = this.connections.pop()

        s.send(JSON.stringify({
            type: BYE,
            payload: null
        }))

        s.addEventListener('close', (m) => {
            callback()
        })
    }
}

module.exports = {
    User
}