const { increaseConnections, decreaseConnections } = require('./database')
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

describe('Decrease connections function',() => {

    it('Should decrease the connections of an existing user',async () => {

        const userId = faker.random.uuid()

        let user = await increaseConnections(userId)

        user = await decreaseConnections(userId)

        expect(user.id).toEqual(userId)
        expect(user.connections).toEqual(0)

    })

    it('Should not decrease the connections of a non-existent user',async () => {

        const userId = faker.random.uuid()

        await expect(decreaseConnections(userId)).rejects.toEqual(
            new Error("Cannot decrease connections of non-existent user, user row must be inserted on connect")
        )

    })

    it('Should not decrease the connections past 0',async () => {

        const userId = faker.random.uuid()

        let user = await increaseConnections(userId)

        user = await decreaseConnections(userId)

        await expect(decreaseConnections(userId)).rejects.toEqual(
            new Error("Cannot decrease connections, as user has 0")
        )

    })

})