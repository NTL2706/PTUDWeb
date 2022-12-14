const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProducerSchema = new Schema(
  {
    name: String,
    listIdProduct: [{ type: Schema.Types.ObjectId }],
  },
  { collection: "producer" }
);

module.exports = mongoose.model("Order", OrderSchema);
