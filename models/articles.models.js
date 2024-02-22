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

function fetchAllArticles(topic) {
    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`
    let queryValues = []
    if (topic) {
        queryString += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }
    queryString += ` GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`

    return db.query(queryString, queryValues)
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
                return []
            }
            return rows
        })
}

function checkArticleExists(article_id) {
    return db.query(
        `SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'article not found'})
            }
        })
}

function updateArticleVotes(article_id, inc_votes) {
    return db.query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
        .then(({rows}) => {
            return rows[0]
        })
}

module.exports = { fetchArticleById, fetchAllArticles, fetchAllCommentsByArticleId, checkArticleExists, updateArticleVotes }
