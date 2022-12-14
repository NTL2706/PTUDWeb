const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: String,
    idCategory: String,
    image: String,
    listIdProduct: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { collection: "category" }
);


module.exports = mongoose.model("Category", CategorySchema);
