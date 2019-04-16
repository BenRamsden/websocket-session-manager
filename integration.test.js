const request = require('supertest')
const app = require('./server/index')
const { User } = require('./client/index')
const WebSocket = require('ws');
const faker = require('faker')
const { findUser } = require('./server/database')

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

        let dbUser = await findUser(userId)
        expect(dbUser).toEqual(null)

        await new Promise((resolve,reject) => {
            user.connect(() => {
                return resolve()
            })
        })

        dbUser = await findUser(userId)
        expect(dbUser.id).toEqual(userId)
        expect(dbUser.connections).toEqual(1)

        await new Promise((resolve,reject) => {
            user.disconnect(() => {
                return resolve()
            })
        })

        dbUser = await findUser(userId)
        expect(dbUser.id).toEqual(userId)
        expect(dbUser.connections).toEqual(0)

    })

    it('Caps connection number at 3',async () => {

        const user = new User(faker.random.uuid())

        for(let i = 0; i < 3; i++) {
            await new Promise(resolve => {
                user.connect(() => {
                    resolve()
                })
            })
        }

        //Expect AUTHENTICATE_FAILURE to be returned
        await expect(new Promise((resolve,reject) => {
            user.connect((err) => {
                if(err) return reject(err)
                return resolve()
            })
        })).rejects.toEqual("User has reached connection limit, no more connections allowed")

        //TODO: Would be better if this was 3, auto close connection if limit is reached
        for(let i = 0; i < 4; i++) {
            await new Promise(resolve => {
                user.disconnect(() => {
                    resolve()
                })
            })
        }

    })

    it('Works for multiple users',async () => {

        let users = []

        for(let i = 0; i < 10; i++) {
            users.push(new User(faker.random.uuid()))
        }

        const connectPromises = users.map(user => {
            return new Promise(resolve => {
                user.connect(() => {
                    resolve()
                })
            })
        })

        await Promise.all(connectPromises)

        const disconnectPromises = users.map(user => {
            return new Promise(resolve => {
                user.disconnect(() => {
                    resolve()
                })
            })
        })

        await Promise.all(disconnectPromises)

    })
})