const request = require('supertest')
const app  = require('../app.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const db = require('../db/connection.js')
const expectedApiResponse = require('../endpoints.json')
const { response } = require('express')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    return db.end()
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
    describe('GET 404: path not found', () => {
        test('GET 404: returns 404 for a path that does not exist', () => {
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
                expect(body).toEqual(expectedApiResponse)
        });
    });

    describe('GET /api/articles/:article_id', () => {
        test('GET 200: should return an article object with the correct properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
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
        test('GET 200: additional feature of comment_count property should be present on returned article objects', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    comment_count: expect.any(Number)                    
                })
            })
        });
        test('GET 400: should return 400 for invalid article id', () => {
            return request(app)
            .get('/api/articles/invalid_id')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    });

    describe('GET /api/articles', () => {
        test('GET 200: should return an array of article objects with expected keys', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeInstanceOf(Array)
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                    expect(article).not.toHaveProperty('body')
                })
            })
        });
        test('GET 200: articles should be sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const { articles } = body
                expect(articles).toBeSortedBy('created_at', {descending: true})
                }
        )})
        })
        test('GET 200: articles should be sorted by created_at in descending order as default', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const {articles} = body
                expect(articles).toBeSortedBy('created_at', {descending: true})
            })
        });
        test('GET 200: articles should be sorted by a valid column in ascending order', () => {
            return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then(({body}) => {
                const {articles} = body
                expect(articles).toBeSortedBy('title', {ascending: true})
            })
        });
        test('GET 400: should return 400 when an invalid sort_by column is given', () => {
            return request(app)
            .get('/api/articles?sort_by=invalid_column')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('invalid sort query') 
            })
        });
        test('GET 400: should return 400 when an invalid order is given', () => {
            return request(app)
            .get('/api/articles?order=invalid_order')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('invalid order query') 
            })
        });
    })
    describe('GET /api/articles/:article_id/comments', () => {
        test('GET 200: should receive an array of all comment objects associated with an article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeInstanceOf(Array)
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    })

                })
            })
        });
        test('GET 200: comments should be sorted by created_at in descending order', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                const { comments } = body
                expect(comments).toBeSortedBy('created_at', {descending: true})
                }
        )})
        test('GET 200: should return an empty array when article has no comments', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeInstanceOf(Array)
                expect(body.comments.length).toBe(0)
            })
        });
        test('GET 400: should return 400 for invalid article_id', () => {
            return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('POST 201: should add a comment to an article', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({username: 'lurker', body: 'test body'})
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toMatchObject({
                    article_id: 1,
                    author: 'lurker',
                    body: 'test body',
                    comment_id: 19,
                    created_at: expect.any(String),
                    votes: 0
                })
            })
        });
        test('POST 201: should ignore unnecessary properties', () => {
            return request(app)
            .post('/api/articles/1/comments') 
            .send({username: 'lurker', body: 'test body', unnecessary: 'property'})
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toMatchObject({
                    article_id: 1,
                    author: 'lurker',
                    body: 'test body',
                    comment_id: 19,
                    created_at: expect.any(String),
                    votes: 0
                })
                expect(body.comment.unnecessary).toBeUndefined()
            })
        });
        test('POST 400: should return 400 if no username provided', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({body: 'test body'})
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
        test('POST 400: should return 400 if no body provided', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({username: 'lurker'})
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
        test('POST 400: should return 400 for invalid article_id', () => {
            return request(app)
            .post('/api/articles/not-an-id/comments')
            .send({username: 'lurker', body: 'test body'})
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    })
    describe('PATCH /api/articles/:article_id', () => {
        test('PATCH 200: should update an article by article_id', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    article_id: 1,
                    votes: 101
                })
            })
        });
        test('PATCH 400: should return an error if no inc_votes is provided', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
        test('PATCH 400: should return an error if invalid article_id is provided', () => {
            return request(app)
            .patch('/api/articles/not-a-number')
            .send({ inc_votes: 1 })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    })
    describe('DELETE /api/comments/:comment_id', () => {
        test('DELETE 204: should delete a comment with the given comment_id', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
        });
        test('DELETE 400: should respond with 400 when comment_id is not a number', () => {
            return request(app)
            .delete('/api/comments/not-a-number')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe('bad request')
            })
        });
    })
    describe('GET /api/users', () => {
        test('GET 200: should return an array of users objects with expected keys', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const users = response.body
                expect(Array.isArray(users)).toBe(true)
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        });
    })
    describe('GET /api/articles (topic query)', () => {
        test('GET 200: should return an array of article objects filtered by topic when topic query is provided', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(Array.isArray(articles)).toBe(true)
                expect(articles.length).toBe(1)
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: 'cats',
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
        });
        test('GET 200: should return an empty array when valid topic is queried but no articles exist on given topic', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(Array.isArray(articles)).toBe(true)
                expect(articles.length).toBe(0)
            })
        });
        test('GET 400: should respond with 400 for invalid topic query', () => {
            return request(app)
            .get('/api/articles?topic=123')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('topic not found')
            })
        });
    })
    // GET 200: should return a user object with expected
})