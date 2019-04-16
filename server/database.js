const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users:[] }).write()

const increaseConnections = (userId) => {
    let user = db
        .get('users')
        .find({id:userId})
        .value()

    if(user===undefined) {
        console.log("creating user",userId)
        user = db
            .get('users')
            .push({id:userId,connections:1})
            .write()
        return user
    }

    if(user.connections>=3) {
        throw new Error("User has reached connection limit, no more connections allowed")
    }

    user = db
        .get('users')
        .find({id:userId})
        .assign({connections:user.connections+1})
        .write()

    return user
}

module.exports = {
    increaseConnections
}