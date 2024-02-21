const { insertComment } = require("../models/comments.models");

function postComment(request, response, next) {
    const {article_id} = request.params
    const {username, body} = request.body
    if (!username || !body) {
        return response.status(400).send({msg: 'bad request'})
    }
    const newComment = {...request.body, article_id}
    insertComment(newComment)
        .then((comment) => {
            response.status(201).send({comment})
        })
}

module.exports = {postComment}