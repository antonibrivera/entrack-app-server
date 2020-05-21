const bcrypt = require('bcryptjs')
const AuthServices = require('../src/auth/auth-services')

function requireAuth(req, res, next) {
  const authValue = req.get('Authorization' || '')
}

module.exports = requireAuth;