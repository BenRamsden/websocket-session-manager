const { AUTHENTICATE, AUTHENTICATE_SUCCESS, AUTHENTICATE_FAILURE, ERROR } = require('../shared-helpers/constants')
const { increaseConnections, decreaseConnections } = require('./database')

const authenticate = async (event,s) => {
    s.userId = event.payload

    try {
        const user = await increaseConnections(s.userId)
        return {
            type:AUTHENTICATE_SUCCESS,
            payload: user
        }
    } catch(error ) {
        return {
            type: AUTHENTICATE_FAILURE,
            payload: error.message
        }
    }
}

const handleEvent = async (event,s) => {
    switch(event.type) {
        case AUTHENTICATE:
            return authenticate(event,s)
        default:
            return {
                type:ERROR,
                payload:`No such event type ${event.type}`
            }
    }
}

module.exports = {
    handleEvent
}