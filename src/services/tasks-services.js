const TasksServices = {
  getAllTasks(db) {
    return db.select('*').from('tasks')
  },
  insertTask(db, task) {
    return db
      .insert(task)
      .into('tasks')
      .returning('*')
      .then(rows => rows[0])
  },
  getById(db, id) {
    return db('tasks')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteTask(db, id) {
    return db('tasks')
      .where('id', id)
      .del()
  },
  updateTask(db, id, newData) {
    return db('tasks')
      .where('id', id)
      .update(newData)
  },
}

module.exports = TasksServices;