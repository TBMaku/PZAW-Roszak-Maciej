import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import { getUser } from "./user.js";

const db = new DatabaseSync("./notes.db", { readBigInts: true });

const SESSION_COOKIE = "notatki-session";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id         INTEGER PRIMARY KEY,
    user_id    INTEGER,
    created_at INTEGER
  ) STRICT;
`);

const db_ops = {
  create_session: db.prepare(
    "INSERT INTO sessions (id, user_id, created_at) VALUES (?, ?, ?) RETURNING id, user_id, created_at;"
  ),
  get_session: db.prepare(
    "SELECT id, user_id, created_at FROM sessions WHERE id = ?;"
  ),
  delete_session: db.prepare(
    "DELETE FROM sessions WHERE id = ?;"
  ),
};

export function createSession(user_id, res) {
  const session_id = randomBytes(8).readBigInt64BE();
  const session = db_ops.create_session.get(session_id, user_id ?? null, Date.now());

  res.cookie(SESSION_COOKIE, session.id.toString(), {
    maxAge: ONE_WEEK,
    httpOnly: true,
  });

  res.locals.session = session;
  return session;
}

export function deleteSession(res) {
  if (res.locals.session) {
    db_ops.delete_session.run(res.locals.session.id);
    res.clearCookie(SESSION_COOKIE);
    res.locals.session = null;
    res.locals.user = null;
  }
}

export function sessionHandler(req, res, next) {
  let session_id = req.cookies[SESSION_COOKIE];

  if (session_id != null) {
    if (!session_id.match(/^-?[0-9]+$/)) {
      session_id = null;
    } else {
      session_id = BigInt(session_id);
    }
  }

  let session = session_id != null ? db_ops.get_session.get(session_id) : null;

  if (session != null && session.user_id != null) {
    res.locals.session = session;
    res.locals.user = getUser(Number(session.user_id));

    res.cookie(SESSION_COOKIE, session.id.toString(), {
      maxAge: ONE_WEEK,
      httpOnly: true,
    });
  } else {
    res.locals.user = null;
  }

  next();
}

export default { createSession, deleteSession, sessionHandler };
