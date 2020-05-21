const TasksServices = {
  getAllTasks(db) {
    return db.select('*').from('tasks')
  },
  getById(db, id) {
    return db('tasks')
      .select('*')
      .where('id', id)
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