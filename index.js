const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const config = { port: process.env.PORT || 3000 };
const shoppingList = require("./models/shoppingList");
const mongoDB =
  "mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD@cluster0.lohdtbg.mongodb.net/?retryWrites=true&w=majority";

app.get("/shoppingList", (req, res) => {
  shoppingList.find().then((results) => res.status(200).json(results));
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});
