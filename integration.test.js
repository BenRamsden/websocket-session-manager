const request = require('supertest')
const app = require('./server/index')
const { User } = require('./client/index')

describe('Server http endpoint',() => {
    it('Details the server is web socket only',async () => {
        const response = await request(app)
            .get('/')
            .expect(200)

        expect(response.body).toEqual({ message:"Web socket is needed to talk to this server" })
    })
})