const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    purchasedDate: Date,
  },
  { collection: "order" }
);

module.exports = mongoose.model("Order", OrderSchema);
