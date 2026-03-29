import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { sessionHandler, createSession, deleteSession } from "./models/session.js";
import { createUser, validatePassword } from "./models/user.js";
import notes from "./models/notes.js";

const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(sessionHandler);

function login_required(req, res, next) {
  if (res.locals.user == null) {
    res.redirect(`/login?next=${encodeURIComponent(req.path)}`);
    return;
  }
  next();
}

function canEdit(note, user) {
  return user != null && (note.author_id === user.id || user.is_admin === true);
}

app.get("/", (req, res) => {
  const allNotes = notes.getAllNotes();
  res.render("index", { notes: allNotes, user: res.locals.user });
});

app.get("/add", login_required, (req, res) => {
  res.render("add", { user: res.locals.user, error: null });
});

app.post("/add", login_required, (req, res) => {
  const text = req.body.text?.trim();
  if (!text) {
    res.render("add", { user: res.locals.user, error: "Treść notatki nie może być pusta." });
    return;
  }
  notes.addNote(text, res.locals.user.id);
  res.redirect("/");
});

app.get("/edit/:id", login_required, (req, res) => {
  const note = notes.getNoteById(req.params.id);
  if (note == null) { res.sendStatus(404); return; }
  if (!canEdit(note, res.locals.user)) {
    res.status(403).send("Brak uprawnień do edycji tej notatki.");
    return;
  }
  res.render("edit", { note, user: res.locals.user });
});

app.post("/edit/:id", login_required, (req, res) => {
  const note = notes.getNoteById(req.params.id);
  if (note == null) { res.sendStatus(404); return; }
  if (!canEdit(note, res.locals.user)) {
    res.status(403).send("Brak uprawnień do edycji tej notatki.");
    return;
  }
  notes.updateNote(note.id, req.body.text);
  res.redirect("/");
});

app.post("/delete/:id", login_required, (req, res) => {
  const note = notes.getNoteById(req.params.id);
  if (note == null) { res.sendStatus(404); return; }
  if (!canEdit(note, res.locals.user)) {
    res.status(403).send("Brak uprawnień do usunięcia tej notatki.");
    return;
  }
  notes.deleteNote(note.id);
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  res.render("signup", { error: null, user: res.locals.user });
});

app.post("/signup", async (req, res) => {
  const { username, password, password_confirm } = req.body;

  if (!username || username.length < 3) {
    res.render("signup", { error: "Nazwa użytkownika musi mieć min. 3 znaki.", user: null });
    return;
  }
  if (!password || password.length < 8) {
    res.render("signup", { error: "Hasło musi mieć min. 8 znaków.", user: null });
    return;
  }
  if (password !== password_confirm) {
    res.render("signup", { error: "Hasła nie są identyczne.", user: null });
    return;
  }

  const new_user = await createUser(username, password);
  if (new_user == null) {
    res.render("signup", { error: "Użytkownik o tej nazwie już istnieje.", user: null });
    return;
  }

  createSession(new_user.id, res);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  const next = req.query.next ?? "/";
  res.render("login", { error: null, next, user: res.locals.user });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const next = req.query.next || "/";

  const user_id = await validatePassword(username, password);
  if (user_id == null) {
    res.render("login", { error: "Niepoprawna nazwa użytkownika lub hasło.", next, user: null });
    return;
  }

  createSession(user_id, res);
  res.redirect(next);
});

app.get("/logout", (req, res) => {
  deleteSession(res);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
