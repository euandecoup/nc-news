const db = require('../db/connection')

function checkUsernameExists(username) {
    return db.query(
        `SELECT * FROM users WHERE username = $1`, [username])
        .then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'user not found'})
            }
        })
}

module.exports = {checkUsernameExists}