import express from "express";

const app = express();
const port = 8000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));


const notes = [];


app.get("/", (req, res) => {
  res.render("index", { notes });
});


app.get("/add", (req, res) => {
  res.render("add");
});


app.post("/add", (req, res) => {
  const { text } = req.body;


  if (typeof text === "string" && text.trim() !== "") {
    notes.push(text.trim());
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Serwer działa: http://localhost:${port}`);
});