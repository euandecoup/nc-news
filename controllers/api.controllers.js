const { selectAllApis } = require("../models/api.models")

function getApis(request, response, next) {
    selectAllApis()
    .then((apis)=>{
        response.status(200).send({apis})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getApis }