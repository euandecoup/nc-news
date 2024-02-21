const { checkArticleExists } = require("../models/articles.models");
const { insertComment } = require("../models/comments.models");
const { checkUsernameExists } = require("../models/users.models");

function postComment(request, response, next) {
    const {article_id} = request.params
    const {username, body} = request.body
    if (!username || !body) {
        return response.status(400).send({msg: 'bad request'})
    }
    checkUsernameExists(username)
        .then(() => {
            return checkArticleExists(article_id)
        })
        .then(() => {
            return insertComment(username, body, article_id)
        })
        .then((comment) => {
            response.status(201).send({comment})
        })
        .catch((error) => {
            next(error)
        })
}

module.exports = {postComment}