const db = require('../db/connection')

function selectAllTopics() {
    return db.query("SELECT * FROM topics")
    .then((response)=>{
        return response.rows
    })
}

function checkTopicExists(topic) {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 400, msg: 'topic not found'})
            }
        })
}

module.exports = { selectAllTopics, checkTopicExists }