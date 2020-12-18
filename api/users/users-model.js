const db = require('../../data/dbConfig')

module.exports = {
    getAll,
    getBy,
    getById,
    add
}

function getAll() {
    return db('users')
}

function getBy(filter) {
    return db('users') 
        .where(filter)
        .orderBy('id')
}

function getById(id) {
    return db('users').where('id', id).first()
}

async function add(user){
    const [id] = await db('users').insert(user, 'id')
    return getById(id)
}