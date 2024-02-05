const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  listId: { type: Number },
  title: { type: String, maxLength: 50 },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now },
  //   items: [
  //     {
  //       itemId: Number,
  //       itemName: String,
  //     },
  //   ],
});

module.exports = mongoose.model("shoppingList", listSchema);
