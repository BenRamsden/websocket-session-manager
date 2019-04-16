const toEvent = (message) => {
    const event = JSON.parse(message)

    if(typeof event.type !== 'string') throw new Error()
    if(typeof event.payload !== 'object' && typeof event.payload !== 'string') throw new Error()

    return { type: event.type, payload: event.payload }
}

module.exports = {
    toEvent
}