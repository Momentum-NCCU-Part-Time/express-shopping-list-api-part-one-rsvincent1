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

var cors = require("cors");
app.use(cors());

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

//**** only adds title with an empty array
// app.post("/shoppingList/:listId/items", (req, res) => {
//   const newShoppingList = new shoppingList({
//     title: req.body.title,
//     $push: {
//       items: req.body.items,
//     },
//   });

//   newShoppingList
//     .save()
//     .then((newShoppingList) => {
//       res.status(200).json(newShoppingList);
//     })
//     .catch((error) => {
//       res.status(400).json({ error: "Bad request" });
//     });
// });

// update shopping list title
app.patch("/shoppingList/:listId", (req, res) => {
  shoppingList
    .findById(req.params.listId)
    .then((shoppingList) => {
      if (shoppingList) {
        shoppingList.title = req.body.title || shoppingList.title;
        shoppingList.updatedAt = req.body.updatedAt;
        shoppingList.save();
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

// update list by adding items
app.patch("/shoppingList/:listId/items", (req, res) => {
  shoppingList
    .findByIdAndUpdate(req.params.listId, {
      $push: {
        items: req.body.items,
      },
    })
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).send(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    });
});

// Removes individual item from shopping list
// app.patch("/shoppingList/:listId/:itemId", (req, res) => {
//   shoppingList
//     .findByIdAndUpdate(req.params.listId, {
//       $pull: {
//         items: { _id: req.params.itemId },
//       },
//     })
//     .then((shoppingList) => {
//       if (shoppingList) {
//         res.status(200).json(shoppingList);
//       } else {
//         res.status(404).json({ message: "not found" });
//       }
//     });
// });

// Deletes individual item from shopping list
app.delete("/shoppingList/:listId/:itemId", (req, res) => {
  shoppingList
    .findById(req.params.listId)
    .then((shoppingList) => {
      if (shoppingList) {
        shoppingList.items.id(req.params.itemId).deleteOne();
        shoppingList.save();
        res.status(200).json({ message: "item deleted" });
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

// Delete shopping list
app.delete("/shoppingList/:listId", (req, res) => {
  shoppingList
    .findByIdAndDelete(req.params.listId)
    .then((shoppingList) => {
      if (shoppingList) {
        res.status(200).json({ message: "deleted" });
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});

module.exports = router;
