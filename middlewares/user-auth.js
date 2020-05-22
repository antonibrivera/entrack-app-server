const bcrypt = require('bcryptjs')
const AuthServices = require('../src/auth/auth-services')

function requireAuth(req, res, next) {
  const authValue = req.get('Authorization' || '')

  if (!authValue) res.status(401).json({ error: 'Missing necessary authentication. Login to access this page.' })

}

module.exports = requireAuth;