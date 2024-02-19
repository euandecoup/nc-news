const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status)
        .send({msg: error.msg})
    }
})

app.all("/*", ((request, response, next)=>{
    response.status(404).send({msg: 'path not found'})
}))

module.exports = app