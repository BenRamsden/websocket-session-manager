const request = require('supertest')
const app = require('./server/index')
const { User } = require('./client/index')
const WebSocket = require('ws');
const faker = require('faker')

afterAll(() => {
    app.close() //stop express listening
})

describe('Server http endpoint',() => {
    it('Details the server is web socket only',async () => {
        const response = await request(app)
            .get('/')
            .expect(200)

        expect(response.body).toEqual({ message:"Web socket is needed to talk to this server" })
    })
})

describe('Web socket application',() => {
    it('Is connectable',(done) => {
        const s = new WebSocket('ws://localhost:3000/');
        s.addEventListener('error', (m) => {
            done(m)
        })
        s.addEventListener('open',m => {
            s.close()
        })
        s.addEventListener('close',m => {
            setTimeout(() => {
                done(null,m)
            },100)
        })
    })

    it('Is connectable by a vuser',async () => {

        const userId = faker.random.uuid()

        const user = new User(userId)

        await new Promise((resolve,reject) => {
            user.connect((err,res) => {
                if(err) return reject(err)
                return resolve(res)
            })
        })

        console.log("user connected")

        await new Promise((resolve,reject) => {
            user.disconnect((err,res) => {
                if(err) return reject(err)
                return resolve(res)
            })
        })

        console.log("user disconnected")

    })
})