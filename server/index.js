const path = require('path');
const app = require('express')();
const ws = require('express-ws')(app);

app.get('/', (req, res) => {
    console.log('express connection');
    res.send({message:"Web socket is needed to talk to this server"});
});

const toEvent = (message) => {
    const event = JSON.parse(message)

    if(typeof event.type !== 'string') throw new Error()
    if(typeof event.payload !== 'object' && typeof event.payload !== 'string') throw new Error()

    return { type: event.type, payload: event.payload }
}

app.ws('/', (s, req) => {
    console.log('websocket connection');
    s.send(JSON.stringify({
        type:'hello',
        payload: 'message from server'
    }))
    s.on('message',message => {
        const event = toEvent(message)
        console.log(event.type,"event received from user",s.userId)

        if(event.type==='authenticate') {
            const userId = event.payload
            s.userId = userId
            s.send(JSON.stringify({
                type:'authenticate_success',
                payload: 'user authenticated'
            }))
        }
    })
    s.on('close',() => {
        console.log(`user ${s.userId} disconnected`)
    })
});

app.listen(3000, () => console.log('listening on http://localhost:3000/'));