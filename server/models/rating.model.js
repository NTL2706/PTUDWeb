const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RatingSchema = new Schema(
  {
    rating: Number,
    content: String,
  },
  { collection: "rating" }
);

module.exports = mongoose.model("Rating", RatingSchema);
