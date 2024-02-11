const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: { type: String, maxLength: 50 },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now },
  items: [
    {
      itemName: { String },
      quantity: { Number },
      done: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("shoppingList", listSchema);
