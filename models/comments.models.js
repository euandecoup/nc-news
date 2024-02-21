const db = require('../db/connection')

function insertComment(username, body, article_id) {
    return db.query(
        `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [username, body, article_id])
        .then(({rows}) => {
            return rows[0]
        })
}

module.exports = {insertComment}