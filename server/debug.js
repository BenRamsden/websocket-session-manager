const { increaseConnections } = require('./database')

const result = increaseConnections(123)

console.log("Increase result",result)