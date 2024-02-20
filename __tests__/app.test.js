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
    describe('GET /api', () => {
        test('GET 200: should provide a description, accepted queries, format of the request body and example response of all other endpoints available in an object', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.apis).toHaveProperty('GET /api/topics')
                expect(body.apis).toHaveProperty('GET /api/articles')
                expect(body.apis['GET /api/topics']).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    exampleResponse: {
                        topics: expect.arrayContaining([
                            {
                                slug: expect.any(String),
                                description: expect.any(String)
                            }
                        ])
                    }
                })
                expect(body.apis['GET /api/articles']).toMatchObject({
                    description: expect.any(String),
                    queries: expect.arrayContaining([expect.any(String)]),
                    exampleResponse: {
                        articles: expect.arrayContaining([
                            {
                                title: expect.any(String),
                                topic: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            }
                        ])
                    }
                })
            })
        });
    });

    describe('GET /api/articles/:article_id', () => {
        test('GET 200: should return an article object with the correct properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                console.log(body);
                expect(body.article).toMatchObject({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: 1,
                    body: 'I find this existence challenging',
                    topic: 'mitch',
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url: expect.any(String)
                })
            })
        });
        test('GET 404: should return 404 if article not found', () => {
            return request(app)
            .get('/api/articles/10000')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('article not found')
            })
        })
        test('GET 400: should return 400 for invalid article id', () => {
            return request(app)
            .get('/api/articles/invalid_id')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    })
})