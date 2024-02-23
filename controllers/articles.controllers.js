const { fetchArticleById, fetchAllArticles, fetchAllCommentsByArticleId, checkArticleExists, updateArticleVotes } = require("../models/articles.models")
const { checkTopicExists } = require("../models/topics.models")

function getArticleById(request, response, next) {
    const { article_id } = request.params
    fetchArticleById(article_id)
        .then((article) => {
            response.status(200)
            .send({ article })
        }).catch((error) => {
            next(error)
        })
}

function getArticles(request, response, next) {
    const { topic, sort_by, order } = request.query
    if (topic) {
        checkTopicExists(topic)
            .then(() => fetchAllArticles(topic, sort_by, order))
            .then((articles) => {
                response.status(200)
            .send({articles})
            }).catch((error) => {
                next(error)
            })
        } else {
            fetchAllArticles(undefined, sort_by, order)
                .then((articles) => {
                    response.status(200)
                    .send({articles})
                }).catch((error) => {
                    next(error)
                })
    }
}

function getCommentsByArticleId(request, response, next) {
    const { article_id } = request.params
    checkArticleExists(article_id)
        .then(() => {
            return fetchAllCommentsByArticleId(article_id)
        })
        .then((comments) => {
            response.status(200)
            .send({comments})
        }).catch((error) => {
            next(error)
        })
}


function patchArticleById(request, response, next) {
    const { article_id } = request.params
    const { inc_votes } = request.body
    checkArticleExists(article_id)
        .then(() => {
            return updateArticleVotes(article_id, inc_votes)
        })
        .then((article) => {
            response.status(200).send({article})
        })
        .catch((error) => {
            next(error)
        })
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId, patchArticleById }