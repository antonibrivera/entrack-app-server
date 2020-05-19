const express = require('express')
const TasksServices = require('../services/tasks-services')

const tasksRouter = express.Router()
const bodyParser = express.json()

tasksRouter
  .route('/')
  .get((req, res, next) => {
    TasksServices.getAllTasks(req.app.get('db'))
      .then(tasks => res.json(tasks))
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { user_id, task_name, duration, description, task_date } = req.body
    let newTask = { user_id, task_name, duration, description, task_date }

    TasksServices.insertTask(req.app.get('db'), newTask)
      .then(task => {
        res.status(201).json(task)
      })
      .catch(next)
  })
  
tasksRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params
    TasksServices.getById(req.app.get('db'), id)
      .then(task => {
        if (!task) return res.status(404).json({ error: 'Sorry, that task does not exists' })
        res.json(task);
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { id } = req.params
    TasksServices.deleteTask(req.app.get('db'), id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = tasksRouter;