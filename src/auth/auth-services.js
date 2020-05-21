const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthServices = {
  insertUser(db, user) {
    return db
      .insert(user)
      .into('users')
      .returning('*')
      .then(rows => rows[0])
  },
  getUser(db, username) {
    return db('users')
      .where('username', username)
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject, 
      algorithm: 'HS256'
    })
  }
}

module.exports = AuthServices;