const { fetchArticleById, fetchAllArticles } = require("../models/articles.models")

function getArticleById(request, response, next) {
    const { article_id } = request.params
    fetchArticleById(article_id)
        .then((article) => {
            response.status(200)
            .send({ article: article })
        }).catch((error) => {
            next(error)
        })
}

function getArticles(request, response, next) {
    fetchAllArticles()
        .then((articles) => {
            response.status(200)
            .send({articles})
        }).catch((error) => {
            next(error)
        })
}

module.exports = { getArticleById, getArticles }