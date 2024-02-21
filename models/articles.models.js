const db = require('../db/connection')

function fetchArticleById(id) {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'article not found'})
            }
            return rows[0]
        })
}

function fetchAllArticles() {
    return db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'articles not found'})
            }
            rows = rows.map((article) => ({
                ...article,
                comment_count: Number(article.comment_count)
            }))
            return rows
        })
}

function fetchAllCommentsByArticleId(id) {
    return db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id=$1
        ORDER BY created_at DESC`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'comments not found'})
            }
            return rows
        })
}

module.exports = { fetchArticleById, fetchAllArticles, fetchAllCommentsByArticleId }
