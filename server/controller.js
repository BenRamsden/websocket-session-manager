const { AUTHENTICATE, AUTHENTICATE_SUCCESS, AUTHENTICATE_FAILURE, ERROR } = require('../shared-helpers/constants')
const { increaseConnections, decreaseConnections } = require('./database')

const handleEvent = (event,s) => {
    switch(event.type) {
        case AUTHENTICATE: {
            s.userId = event.payload
            increaseConnections(s.userId)
                .then(user => {
                    s.send(JSON.stringify({
                        type:AUTHENTICATE_SUCCESS,
                        payload: user
                    }))
                })
                .catch(error => {
                    s.send(JSON.stringify({
                        type: AUTHENTICATE_FAILURE,
                        payload: error.message
                    }))
                })

            break;
        }
        default:
            s.send(JSON.stringify({
                type:ERROR,
                payload:`No such event type ${event.type}`
            }))
    }
}

module.exports = {
    handleEvent
}