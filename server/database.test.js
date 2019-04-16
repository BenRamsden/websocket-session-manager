const { increaseConnections } = require('./database')
const faker = require('faker')

describe('Increase connections function',() => {

    it('Should create a user that doesn\'t exist',() => {

        const userId = faker.random.uuid()

        const user = increaseConnections(userId)

        expect(user).toEqual({
            id:userId,
            connections:1
        })

    })

})