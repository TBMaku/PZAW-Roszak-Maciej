import express from "express";

const port = 8000;

const app = express(); 
app.set("view engine", "ejs");
app.use(express.static('./public'));

// app.get("/", (req, res) => { 
//   res.set("Content-Type", "text/plain"); 
//   res.send("Hello world"); 
// });

// app.get('/', (req, res) => {  

//   res.render('index');
// });


app.listen(port, () => { 
  console.log(`Server listening on http://localhost:${port}`);
});