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

app.post("/shoppingList/:listId/items", (req, res) => {
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

// app.post("/shoppingList/:listId/items", (req, res) => {
//   const newShoppingList = new shoppingList({
//     title: req.body.title,
//     items: [
//       {
//         itemName: req.body.itemName,
//         quantity: req.body.quantity,
//         done: req.body.done,
//       },
//     ],
//   });

//   newShoppingList
//     .save()
//     .then((newShoppingList) => {
//       res.status(200).json(newShoppingList);
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "Internal server error" });
//     });
// });

// update shopping list title
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

//update shopping list items
// app.patch("/shoppingList/:listId", async (req, res) => {
//   try {
//     const updatedList = await shoppingList.findByIdAndUpdate(
//       req.params.listId,
//       {
//         $push: {
//           items: {
//             itemName: req.body.itemName,
//             quantity: req.body.quantity,
//             done: req.body.done,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           },
//         },
//         // updatedAt: new Date(), // Update the updatedAt field of the list
//       },
//       { new: true } // Return the updated document
//     );

//     if (updatedList) {
//       res.status(200).json(updatedList);
//     } else {
//       res.status(404).json({ message: "List not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: "Bad request" });
//   }
// });

app.patch("/shoppingList/:listId/items", (req, res) => {
  shoppingList
    .findById(req.params.listId)
    .then((shoppingList) => {
      if (shoppingList) {
        const items = {
          itemName: req.body.itemName,
          quantity: req.body.quantity,
          done: req.body.done,
        };
        console.log(req.body.itemName);
        shoppingList.items.push(items);
        res.status(200).json(shoppingList);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.delete("/shoppingList/:listId", async (req, res) => {
  try {
    await shoppingList.findByIdAndDelete(req.params.listId);
    if (!shoppingList) res.status(404).json({ message: "not found" });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});

module.exports = router;
