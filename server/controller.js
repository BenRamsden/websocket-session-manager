const { AUTHENTICATE, AUTHENTICATE_SUCCESS, ERROR } = require('../shared-helpers/constants')

const handleEvent = async (event,s) => {
    switch(event.type) {
        case AUTHENTICATE: {
            const userId = event.payload
            s.userId = userId
            s.send(JSON.stringify({
                type:AUTHENTICATE_SUCCESS,
                payload: 'user authenticated'
            }))
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