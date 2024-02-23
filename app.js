const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router')

app.use(express.json())

app.use('/api', apiRouter)

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
    if (error.code === '23502') {
        response.status(400).send({msg: 'bad request'})
    } else next(error)
})

app.use((error, request, response, next) => {
    if (error.code === '42601') {
        response.status(400).send({msg: 'invalid order query'})
    } else next(error)
})

app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({msg: 'internal server error'})
})

module.exports = app