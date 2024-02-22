const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')
const { getApis } = require('./controllers/api.controllers')
const { getArticleById, getArticles, getCommentsByArticleId, patchArticleById } = require('./controllers/articles.controllers')
const { postComment, deleteComment } = require('./controllers/comments.controllers')
const { getUsers } = require('./controllers/users.controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticleById)

app.delete('/api/comments/:comment_id', deleteComment)

app.all("/*", ((request, response, next)=>{
    response.status(404).send({msg: 'path not found'})
}))

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status)
        .send({msg: error.msg})
    } else next(error)
})

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({msg: 'bad request'})
    } else next(error)
})


app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({msg: 'internal server error'})
})

module.exports = app