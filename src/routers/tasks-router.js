const express = require('express')
const xss = require('xss')
const TasksServices = require('../services/tasks-services')
const requireAuth = require('../../middlewares/user-auth')

const tasksRouter = express.Router()
const bodyParser = express.json()

tasksRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    TasksServices.getAllUserTasks(req.app.get('db'), req.user.id)
      .then(tasks => {
        if (!tasks || tasks.length == 0) res.status(404).json({ error: 'There are no tasks.' })
        res.json(tasks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { task_name, duration, description, task_date } = req.body
    const user_id = req.user.id
    const newTask = { user_id, task_name, duration, description, task_date }

    TasksServices.insertTask(req.app.get('db'), newTask)
      .then(task => {
        res.status(201).json(task)
      })
      .catch(next)
  })
  
tasksRouter
  .route('/:id')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params
    TasksServices.getByIdForUser(req.app.get('db'), id, req.user.id)
      .then(task => {
        if (!task) res.status(404).json({ error: 'That task does not exists. Try again.' })
        res.json({
          id: task.id,
          task_name: xss(task.task_name),
          duration: task.duration,
          description: xss(task.description),
          task_date: task.task_date
        });
      })
      .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params
    const { task_name, duration, description, task_date } = req.body
    const taskToUpdate = { task_name, duration, description, task_date }

    const values = Object.values(taskToUpdate).filter(Boolean).length
    if (values == 0) res.status(400).json({ error: "Request body must contain 'task name', 'duration', or 'description'." })

    TasksServices.updateTask(req.app.get('db'), id, taskToUpdate)
      .then(task => {
        res.json({ message: 'You have successfully updated your task.' })
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    const { id } = req.params
    TasksServices.deleteTask(req.app.get('db'), id)
      .then(() => {
        res.status(200).json({ message: 'You have successfully deleted your note.' })
      })
      .catch(next)
  })

module.exports = tasksRouter;