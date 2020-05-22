const AuthServices = require('../src/auth/auth-services')

function requireAuth(req, res, next) {
  const authValue = req.get('Authorization' || '')

  let bearerToken
  if (!authValue) res.status(400).json({ error: 'Missing necessary authentication. Login to access this page.' })
  if (!authValue.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing necessary authentication. Login to access this page.' })
  } else {
    bearerToken = authValue.split(' ')[1]
  }

  try {
    let payload = AuthServices.verifyJwt(bearerToken)

    AuthServices.getUser(req.app.get('db'), payload.sub)
      .then(dbUser => {
        if (!dbUser) res.status(401).json({ error: 'Unauthorized request' })
        req.user = dbUser
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch(err) {
    res.status(401).json({ error: 'Unauthorized request' })
  }
}

module.exports = requireAuth;