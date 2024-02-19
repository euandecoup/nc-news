const { selectAllTopics } = require("../models/topics.models")

function getTopics(request, response) {
    selectAllTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getTopics }