const request = require('supertest')
const app  = require('../app.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const db = require('../db/connection.js')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

describe('App', ()=>{

    describe('GET /api/topics', () => {
        test('GET 200: should return an array of topics objects with expected keys', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                const { topics } = body
                expect(topics).toBeInstanceOf(Array)
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
            })
        });
    })
    describe('path not found', () => {
        test('returns 404 for apth that doesn;t exist', () => {
            return request(app)
            .get('/api/topicz')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('path not found')
            })
        })
    })

})