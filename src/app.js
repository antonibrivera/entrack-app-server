require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const notesRouter = require('./routers/notes-router')
const foldersRouter = require('./routers/folders-router')

const app = express()
const { NODE_ENV } = require('./config')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


app.use('/notes', notesRouter)
app.use('/folders', foldersRouter)

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