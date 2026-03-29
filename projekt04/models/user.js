import { DatabaseSync } from "node:sqlite";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER;
if (PEPPER == null) {
  console.error("Brak zmiennej PEPPER. Uruchom: node utils/generate_env.js");
  process.exit(1);
}

const HASH_PARAMS = {
  secret: Buffer.from(PEPPER, "hex"),
};

const db = new DatabaseSync("./notes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    passhash   TEXT NOT NULL,
    attributes TEXT DEFAULT NULL,
    created_at INTEGER NOT NULL
  ) STRICT;
`);

const db_ops = {
  create_user: db.prepare(
    "INSERT INTO users (username, passhash, created_at) VALUES (?, ?, ?) RETURNING id;"
  ),
  get_user: db.prepare(
    "SELECT id, username, attributes, created_at FROM users WHERE id = ?;"
  ),
  find_by_username: db.prepare(
    "SELECT id, username, attributes, created_at FROM users WHERE username = ?;"
  ),
  get_auth_data: db.prepare(
    "SELECT id, passhash FROM users WHERE username = ?;"
  ),
  get_attributes: db.prepare(
    "SELECT attributes FROM users WHERE id = ?;"
  ),
  update_attributes: db.prepare(
    "UPDATE users SET attributes = ? WHERE id = ?;"
  ),
};

function parseUser(row) {
  if (row == null) return null;
  const { id, username, created_at, attributes } = row;
  return {
    id,
    username,
    created_at,
    ...JSON.parse(attributes),
  };
}

export async function createUser(username, password) {
  if (db_ops.find_by_username.get(username) != null) return null;
  const passhash = await argon2.hash(password, HASH_PARAMS);
  return db_ops.create_user.get(username, passhash, Date.now());
}

export async function validatePassword(username, password) {
  const auth = db_ops.get_auth_data.get(username);
  if (auth != null && await argon2.verify(auth.passhash, password, HASH_PARAMS)) {
    return auth.id;
  }
  return null;
}

export function getUser(id) {
  return parseUser(db_ops.get_user.get(id));
}

const FORBIDDEN_ATTRS = new Set(["id", "username", "passhash", "attributes", "created_at"]);

export function addAttribute(user_id, name, value) {
  if (FORBIDDEN_ATTRS.has(name)) return "niedozwolona nazwa atrybutu";
  const row = db_ops.get_attributes.get(user_id);
  const attrs = row.attributes != null ? JSON.parse(row.attributes) : {};
  attrs[name] = value;
  db_ops.update_attributes.run(JSON.stringify(attrs), user_id);
  return null;
}

export default { createUser, validatePassword, getUser, addAttribute };
