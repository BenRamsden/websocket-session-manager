const WebSocket = require('ws');

console.log('opening websocket connection');
const s = new WebSocket('ws://localhost:3000/');
s.addEventListener('error', (m) => {
    console.log("error");
});

s.addEventListener('open', (m) => {
    console.log("websocket connection open");
});

s.addEventListener('message', (m) => {
    console.log(m.data);
});