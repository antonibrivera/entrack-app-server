const NotesServices = {
  getAllNotes(db) {
    return db.select('*').from('notes')
  },
  insertNote(db, note) {
    return db
      .insert(note)
      .into('notes')
      .returning('*')
      .then(rows => rows[0])
  },
  getById(db, id) {
    return db('notes')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteNote(db, id) {
    return db('notes')
      .where('id', id)
      .del()
  },
  updateNote(db, id, newData) {
    return db('notes')
      .where('id', id)
      .update(newData)

  }
}

module.exports = NotesServices;