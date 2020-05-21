const PresetTasksServices = {
  getAllPresetTasks(db) {
    return db.select('*').from('preset_tasks')
  },
  getById(db, id) {
    return db('preset_tasks')
      .select('*')
      .where('id', id)
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