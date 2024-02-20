const endpoints = require('../endpoints.json')


function getApis(request, response, next) {
        response.status(200).send(endpoints)
}

module.exports = { getApis }