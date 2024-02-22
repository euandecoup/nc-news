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

function deleteCommentById(comment_id) {
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Comment not found'})
            }
        })
}


module.exports = {insertComment, deleteCommentById}