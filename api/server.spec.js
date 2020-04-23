const request = require('supertest');

const server = require('./server.js');
const db = require('../data/dbConfig');

describe('server', () => {
    describe('GET /', () => {
        it('should return 200 OK', () => {
            // make GET a request to / endpoint on the server
            return request(server).get('/').then(res => {
                // assert that the HTTP status code is 200
                expect(res.status).toBe(200)
            })
        })
    })

    describe('POST /hobbits', () => {

        beforeEach(async () => {
            await db('hobbits').truncate(); //empty the table and reset the id back to 1
        })

        it('should return 201 OK', () => {
            // make GET a request to / endpoint on the server
            return request(server)
                .post('/hobbits')
                .send({ name: 'john' })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })

        it('should return a message saying "Hobbit created successfully"', () => {
            return request(server)
                .post('/hobbits')
                .send({ name: 'john' })
                .then(res => {
                    expect(res.body.message).toBe("Hobbit created successfully")
                })

        })

        it('add  the hobbit to the db', async function () {
            const hobbitName = "gaffer";
            const existing = await db('hobbits').where({ name: hobbitName })
            expect(existing).toHaveLength(0);

            await request(server)
                .post('/hobbits')
                .send({ name: hobbitName })
                .then(res => {
                    expect(res.body.message).toBe("Hobbit created successfully")
                })

            await request(server)
                .post('/hobbits')
                .send({ name: hobbitName })
                .then(res => {
                    expect(res.body.message).toBe("Hobbit created successfully")
                })

            const inserted = await db('hobbits').where({ name: hobbitName })
            expect(inserted).toHaveLength(2)

        })
    })

})