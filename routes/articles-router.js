const articlesRouter = require('express').Router()
const { getArticleById, getArticles, getCommentsByArticleId, patchArticleById } = require('../controllers/articles.controllers')
const { postComment } = require('../controllers/comments.controllers')

articlesRouter.get('/:article_id', getArticleById)

articlesRouter.get('/?topic=:topic', getArticles)

articlesRouter.get('/', getArticles)

articlesRouter.get('/:article_id/comments', getCommentsByArticleId)

articlesRouter.post('/:article_id/comments', postComment)

articlesRouter.patch('/:article_id', patchArticleById)

module.exports = articlesRouter