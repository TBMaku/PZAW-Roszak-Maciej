import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./notes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY,
    text       TEXT NOT NULL,
    author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL
  ) STRICT;
`);

const db_ops = {
  get_all: db.prepare(`
    SELECT notes.id, notes.text, notes.author_id, notes.created_at,
           users.username AS author_name
    FROM notes
    JOIN users ON users.id = notes.author_id
    ORDER BY notes.id DESC;
  `),
  get_by_id: db.prepare(`
    SELECT notes.id, notes.text, notes.author_id, notes.created_at,
           users.username AS author_name
    FROM notes
    JOIN users ON users.id = notes.author_id
    WHERE notes.id = ?;
  `),
  insert: db.prepare(
    "INSERT INTO notes (text, author_id, created_at) VALUES (?, ?, ?) RETURNING id;"
  ),
  update: db.prepare(
    "UPDATE notes SET text = ? WHERE id = ?;"
  ),
  delete: db.prepare(
    "DELETE FROM notes WHERE id = ?;"
  ),
};

function noteEditableBy(user) {
  return user != null && (this.author_id === user.id || user.is_admin === true);
}

function withEditableBy(note) {
  if (note == null) return null;
  note.editableBy = noteEditableBy;
  return note;
}

export function getAllNotes() {
  return db_ops.get_all.all().map(withEditableBy);
}

export function getNoteById(id) {
  return withEditableBy(db_ops.get_by_id.get(id));
}

export function addNote(text, author_id) {
  return db_ops.insert.get(text, author_id, Date.now());
}

export function updateNote(id, text) {
  db_ops.update.run(text, id);
}

export function deleteNote(id) {
  db_ops.delete.run(id);
}

export default { getAllNotes, getNoteById, addNote, updateNote, deleteNote };
