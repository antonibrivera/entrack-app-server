const express = require('express')
const NotesServices = require('../services/notes-services')

const foldersRouter = express.Router()
const bodyParser = express.json()

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    
  })

  module.exports = foldersRouter;