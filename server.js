const path = require('path');
const app = require('express')();
const ws = require('express-ws')(app);

app.get('/', (req, res) => {
    console.log('express connection');
    res.send({message:"Web socket is needed to talk to this server"});
});

app.ws('/', (s, req) => {
    console.log('websocket connection');
    s.send('message from server')
});

app.listen(3000, () => console.log('listening on http://localhost:3000/'));