import bcryptjs from "bcryptjs";
import { readFile } from "fs/promises";
import {
  Cuisine,
  Location,
  Menu,
  Reservation,
  Restaurant,
  Review,
  User,
} from "../models.js";

const restaurantLines = (await readFile("initial-data/restaurants.csv"))
  .toString()
  .split("\r\n")
  .slice(1, -1);

for (const line of restaurantLines) {
  const fields = line.split(",");
  const [location, locationCreated] = await Location.findOrCreate({
    where: { name: fields[2] },
  });
  const [cuisise, cuisiseCreated] = await Cuisine.findOrCreate({
    where: { name: fields[3] },
  });
  await Restaurant.create({
    id: parseInt(fields[0]),
    name: fields[1],
    LocationId: location.id,
    CuisineId: cuisise.id,
  });
}

const menuLines = (await readFile("initial-data/menus.csv"))
  .toString()
  .split("\r\n")
  .slice(1, -1);

for (const line of menuLines) {
  const fields = line.split(",");
  Menu.create({
    id: parseInt(fields[0]),
    RestaurantId: parseInt(fields[1]),
    dishName: fields[2],
    price: fields[3],
  });
}

const reservationLines = (await readFile("initial-data/reservations.csv"))
  .toString()
  .split("\r\n")
  .slice(1, -1);

for (const line of reservationLines) {
  const fields = line.split(",");
  Reservation.create({
    id: parseInt(fields[0]),
    RestaurantId: parseInt(fields[1]),
    userName: fields[2],
    dateTime: new Date(fields[3] + " " + fields[4]),
    partySize: parseInt(fields[5]),
  });
}

const reviewLines = (await readFile("initial-data/reviews.csv"))
  .toString()
  .split("\r\n")
  .slice(1, -1);

for (const line of reviewLines) {
  const fields = line.split(",");
  Review.create({
    id: parseInt(fields[0]),
    RestaurantId: parseInt(fields[1]),
    userName: fields[2],
    rating: parseFloat(fields[3]),
    comment: fields[4],
  });
}

User.create({
  email: "ferenc.kis@sze.hu",
  name: "Ferenc Kis",
  role: "restaurantAdmin",
  RestaurantId: 1,
  password: bcryptjs.hashSync("12345678"),
});

User.create({
  email: "laszlo.nagy@dineeasy.com",
  name: "Laszlo Nagy",
  role: "dineEasyAdmin",
  password: bcryptjs.hashSync("12345678"),
});
