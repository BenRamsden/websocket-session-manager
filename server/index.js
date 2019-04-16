const {handleEvent} = require("./controller")
const {HELLO} = require("../shared-helpers/constants")
const { increaseConnections, decreaseConnections } = require('./database')

const path = require('path');
const app = require('express')();
const ws = require('express-ws')(app);
const { toEvent } = require('../shared-helpers/event')

app.get('/', (req, res) => {
    console.log('express connection');
    res.send({message:"Web socket is needed to talk to this server"});
});

app.ws('/', (s, req) => {
    console.log('websocket connection');

    s.send(JSON.stringify({
        type:HELLO,
        payload: 'message from server'
    }))

    s.on('message',message => {
        const event = toEvent(message)
        console.log(event.type,"event received from user",s.userId)

        handleEvent(event,s)
            .then(response => {
                s.send(JSON.stringify(response))
            })
            .catch(error => {
                throw error
            })

    })

    s.on('close',() => {
        if(s.userId===undefined) {
            console.log("unauthenticated user disconnected")
        }

        decreaseConnections(s.userId)
            .then(user => {
                console.log(`user ${s.userId} disconnected, connections decreased to ${user.connections}`)
            })
            .catch(error => {
                console.log(`user ${s.userId} disconnected, error decreasing connections`)
                console.error(error)
            })
    })
});

app.listen(3000, () => console.log('listening on http://localhost:3000/'));