const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  id: Number,
  title: String,
  updatedOn: Date,
  items: [
    {
      itemId: Number,
      itemName: String,
    },
  ],
});

module.exports = mongoose.model("shoppingList", listSchema);
