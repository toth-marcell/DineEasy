import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("sqlite:data/db.sqlite");

export const Location = sequelize.define("Location", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Cuisine = sequelize.define("Cuisine", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Restaurant = sequelize.define("Restaurant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Restaurant.belongsTo(Location);
Location.hasMany(Restaurant);

Restaurant.belongsTo(Cuisine);
Cuisine.hasMany(Restaurant);

export const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.belongsTo(Restaurant);
Restaurant.hasOne(User);

export const Menu = sequelize.define("Menu", {
  dishName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

Menu.belongsTo(Restaurant);
Restaurant.hasMany(Menu);

export const Reservation = sequelize.define("Reservation", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
  },
  partySize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Reservation.belongsTo(Restaurant);
Restaurant.hasMany(Reservation);

export const Review = sequelize.define("Review", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Review.belongsTo(Restaurant);
Restaurant.hasMany(Review);

await sequelize.sync({ force: true });
