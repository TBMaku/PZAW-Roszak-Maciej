import express from "express";
import cookieParser from "cookie-parser";
import { db } from "./db.js";

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  const visits = Number(req.cookies.visits ?? 0) + 1;
  res.cookie("visits", visits, { maxAge: 1000 * 60 * 60 * 24 * 365 });

  db.all("SELECT * FROM notes", (err, notes) => {
    res.render("index", { notes, visits });
  });
});

app.get("/reset-visits", (req, res) => {
  res.clearCookie("visits");
  res.redirect("/");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  db.run("INSERT INTO notes (text) VALUES (?)", [req.body.text], () => {
    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  db.get("SELECT * FROM notes WHERE id = ?", [req.params.id], (err, note) => {
    res.render("edit", { note });
  });
});

app.post("/edit/:id", (req, res) => {
  db.run(
    "UPDATE notes SET text = ? WHERE id = ?",
    [req.body.text, req.params.id],
    () => {
      res.redirect("/");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", [req.params.id], () => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
