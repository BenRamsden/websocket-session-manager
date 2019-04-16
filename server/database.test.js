const { increaseConnections } = require('./database')
const faker = require('faker')

describe('Increase connections function',() => {

    it('Should create a user that doesn\'t exist', async () => {

        const userId = faker.random.uuid()

        const user = await increaseConnections(userId)

        expect(user.id).toEqual(userId)
        expect(user.connections).toEqual(1)

    })

    it('Update a user that already exists', async () => {

        const userId = faker.random.uuid()

        let user = await increaseConnections(userId)

        user = await increaseConnections(userId)

        expect(user.id).toEqual(userId)
        expect(user.connections).toEqual(2)

    })

})