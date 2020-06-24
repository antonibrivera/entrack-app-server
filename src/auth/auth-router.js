const express = require('express')
const xss = require('xss')
const AuthServices = require('./auth-services')
const requireAuth = require('../../middlewares/user-auth')

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

authRouter
  .route('/user')
  .get(requireAuth, (req, res, next) => {
    const { id } = req.user
    AuthServices.getUserById(req.app.get('db'), id)
      .then(user => {
        if (!user) return res.status(404).json({ error: 'That user does not exist.' })
        res.json({
          first_name: user.first_name,
          last_name: user.last_name
        })
      })
      .catch(next)
  })

module.exports = authRouter;