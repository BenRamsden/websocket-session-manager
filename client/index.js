const WebSocket = require('ws');

console.log('opening websocket connection');
const s = new WebSocket('ws://localhost:3000/');
s.addEventListener('error', (m) => {
    console.log("error");
});

s.addEventListener('open', (m) => {
    console.log("websocket connection open");
    s.send(JSON.stringify({
        type:'authenticate',
        payload: 'userid123'
    }))
});

const toEvent = (message) => {
    const event = JSON.parse(message)

    if(typeof event.type !== 'string') throw new Error()
    if(typeof event.payload !== 'object' && typeof event.payload !== 'string') throw new Error()

    return { type: event.type, payload: event.payload }
}

s.addEventListener('message', (m) => {
    const event = toEvent(m.data)
    console.log(event)

    if(event.type==='authenticate_success') {
        s.send(JSON.stringify({
            type:'check_connections',
            payload:null
        }))
    }
});