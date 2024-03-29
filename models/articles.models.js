const db = require('../db/connection')

function fetchArticleById(id) {
    return db.query(
        `SELECT articles.*, 
        COUNT(comments.comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id=$1
        GROUP BY articles.article_id`, [id])
        .then(({rows}) => {
            rows = rows.map((article) => ({
                ...article,
                comment_count: Number(article.comment_count)
            }))
            return rows[0]
        })
}

function fetchAllArticles(topic, sort_by = 'created_at', order = 'DESC') {
    const validSortBys = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']
    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`
    let queryValues = []
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'invalid sort query'})
    }
    if (topic) {
        queryString += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }
    queryString += ` GROUP BY articles.article_id`

    if (sort_by === 'comment_count') {
        queryString += ` ORDER BY comment_count ${order}`
    } else {
        queryString += ` ORDER BY articles.${sort_by} ${order}`
    }

    return db.query(queryString, queryValues)
        .then(({rows}) => {
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
