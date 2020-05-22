const express = require('express')
const xss = require('xss')
const AuthServices = require('./auth-services')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter
  .route('/login')
  .post(bodyParser, (req, res, next) => {
    const { username, password } = req.body
    const loginUser = { username, password }

    for (const [key, value] of Object.entries(loginUser))
    if (value == null) res.status(400).json({ error: `Missing value for ${key} in request body` })

    AuthServices.getUser(req.app.get('db'), loginUser.username)
      .then(dbUser => {
        if (!dbUser) res.status(400).json({ error: 'Incorrect username or password. Try again.' })
        return AuthServices.comparePasswords(loginUser.password, dbUser.password)
          .then(isMatch => {
            if (!isMatch) res.status(400).json({ error: 'Incorrect username or password. Try again.' })
            const sub = dbUser.username
            const payload = { user_id: dbUser.id }
            res.send({ authToken: AuthServices.createJwt(sub, payload) })
          })
      })
      .catch(next)
  })

module.exports = authRouter;