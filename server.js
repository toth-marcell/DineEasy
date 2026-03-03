import bcryptjs from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import JWT from "jsonwebtoken";
import { Cuisine, Location, Restaurant, User } from "./models.js";

dotenv.config({ quiet: true });

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    const token = req.cookies.user;
    const id = JWT.verify(token, process.env.SECRET).UserId;
    const user = await User.findByPk(id, {
      include: { model: Restaurant, include: [Cuisine, Location] },
    });
    res.locals.user = user;
  } catch {
    res.locals.user = null;
  }
  next();
});

app.get("/bootstrap.min.css", (req, res) =>
  res.sendFile("node_modules/bootstrap/dist/css/bootstrap.min.css", {
    root: import.meta.dirname,
  })
);

app.get("/", (req, res) => {
  res.render("dashboard", { email: "", password: "" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(400).render("dashboard", {
      msg: "No such user!",
      email,
      password,
    });
  if (!bcryptjs.compareSync(password, user.password))
    return res.status(401).render("dashboard", {
      msg: "Wrong password!",
      email,
      password,
    });
  res.cookie("user", JWT.sign({ UserId: user.id }, process.env.SECRET));
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register", {
    resturantName: "",
    resturantCuisine: "",
    resturantLocation: "",
    name: "",
    email: "",
    password: "",
  });
});

app.post("/register", async (req, res) => {
  const {
    resturantName,
    resturantCuisine,
    resturantLocation,
    name,
    email,
    password,
  } = req.body ?? {};
  if (
    !(
      resturantName &&
      resturantCuisine &&
      resturantLocation &&
      name &&
      email &&
      password
    )
  )
    return res.status(400).render("register", {
      msg: "You must fill out all fields!",
      resturantName,
      resturantCuisine,
      resturantLocation,
      name,
      email,
      password,
    });
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return res.status(409).render("register", {
      msg: "That email is already in use!",
      resturantName,
      resturantCuisine,
      resturantLocation,
      name,
      email,
      password,
    });
  const [location, locationCreated] = await Location.findOrCreate({
    where: { name: resturantLocation },
  });
  const [cuisise, cuisiseCreated] = await Cuisine.findOrCreate({
    where: { name: resturantCuisine },
  });
  const restaurant = await Restaurant.create({
    name: resturantName,
    LocationId: location.id,
    CuisineId: cuisise.id,
  });
  const user = await User.create({
    name,
    email,
    password: bcryptjs.hashSync(password),
    role: "restaurantAdmin",
    RestaurantId: restaurant.id,
  });
  res.cookie("user", JWT.sign({ UserId: user.id }, process.env.SECRET));
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/selectRestaurant", async (req, res) => {
  res.render("selectRestaurant", {
    restaurants: await Restaurant.findAll(),
  });
});

app.post("/selectRestaurant", async (req, res) => {
  const { RestaurantId } = req.body ?? {};
  if (RestaurantId) await res.locals.user.update({ RestaurantId });
  else await res.locals.user.update({ RestaurantId: null });
  res.redirect("/");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`http://localhost:${port}`));
