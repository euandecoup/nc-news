const endpoints = require('../endpoints.json')

function selectAllApis() {
    return Promise.resolve(endpoints)
}

module.exports = {selectAllApis}