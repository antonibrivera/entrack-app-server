const TasksServices = {
  getAllUserTasks(db, userId) {
    return db('tasks')
      .select('*')
      .where('user_id', userId)
  },
  getByIdForUser(db, id, userId) {
    return db('tasks')
      .select('*')
      .where({ id: id, user_id: userId })
      .first()
  },
  insertTask(db, task) {
    return db
      .insert(task)
      .into('tasks')
      .returning('*')
      .then(rows => rows[0])
  },
  updateTask(db, id, newData) {
    return db('tasks')
      .where('id', id)
      .update(newData)
  },
  deleteTask(db, id) {
    return db('tasks')
      .where('id', id)
      .del()
  },
}

module.exports = TasksServices;