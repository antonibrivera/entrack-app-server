require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const tasksRouter = require('./routers/tasks-router')
const presetTasksRouter = require('./routers/preset-tasks-router')
const authRouter = require('./auth/auth-router')

const app = express()
const { NODE_ENV } = require('./config')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


app.use('/tasks', tasksRouter)
app.use('/preset-tasks', presetTasksRouter)
app.use('/auth', authRouter)


app.use(function errorHandling(err, req, res, next) {
  let response;
  if (NODE_ENV === 'production')  {
    response = { error: { message: 'server error' } }
  } else {
    console.error(err)
    response = { message: err.message, err }
  }
  res.status(500).json(response)
})


module.exports = app