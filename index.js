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

app.get("/shoppingList/:listId", (req, res) => {
  shoppingList
    .findById(req.params.listId)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.post("/shoppingList", (req, res) => {
  const newShoppingList = new shoppingList(req.body);
  newShoppingList.save();

  res.status(200).json(newShoppingList);
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});
