import express from "express";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.user = null;
  next();
});

app.get("/bootstrap.min.css", (req, res) =>
  res.sendFile("node_modules/bootstrap/dist/css/bootstrap.min.css", {
    root: import.meta.dirname,
  })
);

app.get("/", (req, res) => {
  res.render("dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

const port = 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
