const path = require('path')
const Datastore = require('nedb')
const User = new Datastore({ filename: path.join(__dirname,'data/users'), autoload: true });

const findUser = (userId) => {
    return new Promise((resolve,reject) => {
        User.findOne({ id: userId },(err,doc) => {
            if(err) return reject(err)
            return resolve(doc)
        })
    })
}

const insertUser = (user) => {
    return new Promise((resolve,reject) => {
        User.insert(user,(err) => {
            if(err) return reject(err)
            return resolve(user)
        })
    })
}

const updateUser = (userId,update) => {
    return new Promise((resolve,reject) => {
        User.update({id:userId},update,{},(err,numReplaced) => {
            if(err) return reject(err)

            User.findOne({id: userId},(err,user) => {
                if(err) return reject(err)
                return resolve(user)
            })
        })
    })
}

const increaseConnections = async (userId) => {
    let user = await findUser(userId)

    if(user===null) {
        console.log("creating user",userId)
        user = await insertUser({ id: userId, connections: 1 })
        return user
    }

    if(user.connections>=3) {
        throw new Error("User has reached connection limit, no more connections allowed")
    }

    user = await updateUser(userId,{ $inc:{ connections:1 }})

    return user
}

const decreaseConnections = async (userId) => {
    let user = await findUser(userId)

    if(user===null) {
        throw new Error("Cannot decrease connections of non-existent user, user row must be inserted on connect")
    }

    if(user.connections<=0) {
        throw new Error(`Cannot decrease connections, as user has ${user.connections}`)
    }

    user = updateUser(userId,{$inc:{connections:-1}})

    return user
}

module.exports = {
    findUser,
    increaseConnections,
    decreaseConnections
}