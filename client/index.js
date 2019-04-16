const {AUTHENTICATE, AUTHENTICATE_SUCCESS, CHECK_CONNECTIONS} = require("../shared-helpers/constants")

const WebSocket = require('ws');
const { toEvent } = require('../shared-helpers/event')

console.log('opening websocket connection');
const s = new WebSocket('ws://localhost:3000/');
s.addEventListener('error', (m) => {
    console.log("error");
});

s.addEventListener('open', (m) => {
    console.log("websocket connection open");
    s.send(JSON.stringify({
        type:AUTHENTICATE,
        payload: 'userid123'
    }))
});

s.addEventListener('message', (m) => {
    const event = toEvent(m.data)
    console.log(event)

    if(event.type===AUTHENTICATE_SUCCESS) {
        s.send(JSON.stringify({
            type:CHECK_CONNECTIONS,
            payload:null
        }))
    }
});