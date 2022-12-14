const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    address: String,
    status: Boolean,
    idShoppingCart: { type: Schema.Types.ObjectId },
  },
  { collection: "user" }
);

module.exports = mongoose.model("User", UserSchema);
