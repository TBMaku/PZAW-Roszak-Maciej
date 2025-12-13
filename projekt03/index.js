import express from "express";
import { db } from "./db.js";

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  db.all("SELECT * FROM notes", (err, notes) => {
    res.render("index", { notes });
  });
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
