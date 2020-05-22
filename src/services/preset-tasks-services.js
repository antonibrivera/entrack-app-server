const PresetTasksServices = {
  getAllUserPresetTasks(db, userId) {
    return db('preset_tasks')
      .select('*')
      .where('user_id', userId)
  },
  getByIdForUser(db, id, userId) {
    return db('preset_tasks')
      .select('*')
      .where({ id: id, user_id: userId })
      .first()
  },
  insertPresetTask(db, presetTask) {
    return db
      .insert(presetTask)
      .into('preset_tasks')
      .returning('*')
      .then(rows => rows[0])
  },
  updatePresetTask(db, id, newData) {
    return db('preset_tasks')
      .where('id', id)
      .update(newData)
  },
  deletePresetTask(db, id) {
    return db('preset_tasks')
      .where('id', id)
      .del()
  },
}

module.exports = PresetTasksServices;