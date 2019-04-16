const { AUTHENTICATE, AUTHENTICATE_SUCCESS, AUTHENTICATE_FAILURE, ERROR, BYE, BYE_SUCCESS } = require('../shared-helpers/constants')
const { increaseConnections, decreaseConnections } = require('./database')

const authenticate = async (event,s) => {
    const userId = event.payload

    try {
        const user = await increaseConnections(userId)

        //Only authenticate socket once we know they can connect
        s.userId = userId

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

const bye = async (event,s) => {
    if(s.userId) {
        await decreaseConnections(s.userId)
            .then(user => {
                console.log(`user ${s.userId} said bye, connections decreased to ${user.connections}`)
                s.loggedOut = true
            })
            .catch(error => {
                console.log(`user ${s.userId} said bye, error decreasing connections`)
            })
    }

    return { type:BYE_SUCCESS, payload:null }
}

const handleEvent = async (event,s) => {
    switch(event.type) {
        case AUTHENTICATE:
            return authenticate(event,s)
        case BYE:
            return bye(event,s)
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