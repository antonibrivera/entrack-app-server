const express = require('express')
const xss = require('xss')
const PresetTasksServices = require('../services/preset-tasks-services')

const presetTasksRouter = express.Router()
const bodyParser = express.json()

presetTasksRouter
  .route('/')
  .get((req, res, next) => {
    PresetTasksServices.getAllPresetTasks(req.app.get('db'))
      .then(tasks => {
        if (!tasks) res.status(404).json({ error: 'You have no preset tasks' })
        res.json(tasks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { user_id, task_name, duration, description } = req.body
    const newPresetTask = { user_id, task_name, duration, description }

    PresetTasksServices.insertPresetTask(req.app.get('db'), newPresetTask)
      .then(presetTask => {
        res.status(201).json(presetTask)
      })
      .catch(next)
  })

presetTasksRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params
    PresetTasksServices.getById(req.app.get('db'), id)
      .then(presetTask => {
        if (!presetTask) res.status(404).json({ error: 'That task does not exist. Try again' })
        res.json(presetTask)
      })
  })
  .patch((req, res, next) => {
    const { id } = req.params
    const { task_name, duration, description } = req.body
    const presetTaskToUpdate = { task_name, duration, description }

    const values = Object.values(presetTaskToUpdate).filter(Boolean).length
    if (values.length == 0) res.status(404).json({ error: "Request body must contain 'task name', 'duration', 'description'." })
    
    PresetTasksServices.updatePresetTask(req.app.get('db'), id, presetTaskToUpdate)
      .then(() => {
        res.json({ message: 'You have successfully updated your task.' })
      })
  })

module.exports = presetTasksRouter;