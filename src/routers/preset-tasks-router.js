const express = require('express')
const xss = require('xss')
const PresetTasksServices = require('../services/preset-tasks-services')
const requireAuth = require('../../middlewares/user-auth')

const presetTasksRouter = express.Router()
const bodyParser = express.json()

presetTasksRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PresetTasksServices.getAllUserPresetTasks(req.app.get('db'), req.user.id)
      .then(tasks => {
        if (!tasks || tasks.length == 0) res.status(404).json({ error: 'You have no preset tasks' })
        res.json(tasks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { task_name, duration, description } = req.body
    const user_id = req.user.id
    const newPresetTask = { user_id, task_name, duration, description }

    PresetTasksServices.insertPresetTask(req.app.get('db'), newPresetTask)
      .then(presetTask => {
        res.status(201).json(presetTask)
      })
      .catch(next)
  })

presetTasksRouter
  .route('/:id')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params
    PresetTasksServices.getByIdForUser(req.app.get('db'), id, req.user.id)
      .then(presetTask => {
        if (!presetTask) res.status(404).json({ error: 'That task does not exist. Try again' })
        res.json(presetTask)
      })
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params
    const { user_id, task_name, duration, description } = req.body
    const presetTaskToUpdate = { user_id, task_name, duration, description }

    const values = Object.values(presetTaskToUpdate).filter(Boolean).length
    if (values.length == 0) res.status(404).json({ error: "Request body must contain 'task name', 'duration', 'description'." })
    
    PresetTasksServices.updatePresetTask(req.app.get('db'), id, presetTaskToUpdate)
      .then(() => {
        res.json({ message: 'You have successfully updated your task.' })
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { id } = req.params
    PresetTasksServices.deletePresetTask(req.app.get('db'), id)
      .then(() => {
        res.status(200).json({ message: 'You have successfully deleted your note.' })
      })
      .catch(next)
  })

module.exports = presetTasksRouter;