const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = { port: process.env.PORT || 3000 };

app.use(morgan("dev"));
const shoppingList = require("./models/shoppingList");
// const mongoDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lohdtbg.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lohdtbg.mongodb.net/?retryWrites=true&w=majority`
);

// get all shopping list
app.get("/shoppingList", (req, res) => {
  shoppingList.find().then((results) => res.status(200).json(results));
});

// get shopping list by list id
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

// get individual item from list--might not need
app.get("/shoppingList/:listId/:itemId", (req, res) => {
  shoppingList
    .findById(req.params.listId, {
      { items: { _id: req.params.itemId } },
    )
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

// create shopping list with empty array
app.post("/shoppingList", (req, res) => {
  const newShoppingList = new shoppingList({
    title: req.body.title,
  });

  newShoppingList
    .save()
    .then((newShoppingList) => {
      res.status(200).json(newShoppingList);
    })
    .catch((error) => {
      res.status(400).json({ error: "Bad request" });
    });
});

// create shopping list with items array--- probably dont need or might 
// need to change it to add title and items
app.post("/shoppingList/:listId/items", (req, res) => {
  const newShoppingList = new shoppingList({
    title: req.body.title,
    items: {
      itemName: req.body.itemName,
      quantity: req.body.quantity,
      done: req.body.done,
    },
  });

  newShoppingList
    .save()
    .then((newShoppingList) => {
      res.status(200).json(newShoppingList);
    })
    .catch((error) => {
      res.status(400).json({ error: "Bad request" });
    });
});

//update shopping list title
// app.patch("/shoppingList/:listId", (req, res) => {
//   shoppingList
//     .findById(req.params.listId)
//     .then((shoppingList) => {
//       if (shoppingList) {
//         shoppingList.title = req.body.title || shoppingList.title;
//         shoppingList.updatedAt = req.body.updatedAt;
//         shoppingList.save();
//         res.status(200).json(shoppingList);
//       } else {
//         res.status(404).json({ message: "not found" });
//       }
//     })
//     .catch((error) => res.status(400).json({ message: "Bad request" }));
// });

// ** update list by adding items
app.patch("/shoppingList/:listId/items", (req, res) => {
  shoppingList
    .findByIdAndUpdate(req.params.listId, {
      $push: {
        items: req.body.items,
      },
    })
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    });
});

// Removes individual item from shopping list
app.patch("/shoppingList/:listId/:itemId", (req, res) => {
  shoppingList
    .findByIdAndUpdate(req.params.listId, {
      $pull: {
        items: { _id: req.params.itemId },
      },
    })
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    });
});

// Delete shopping list
app.delete("/shoppingList/:listId", async (req, res) => {
  try {
    await shoppingList.findByIdAndDelete(req.params.listId);
    if (!shoppingList) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});

module.exports = router;
