const express = require('express')
const NotesServices = require('../services/notes-services')

const notesRouter = express.Router()
const bodyParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    NotesServices.getAllNotes(knex)
      .then(notes => {
        res.json(notes)
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    const { name,  } = req.body;
  })

  module.exports = notesRouter;