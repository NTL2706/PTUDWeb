const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const AdminSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
  },
  { collection: "admin" }
);

AdminSchema.plugin(passportLocalMongoose, {
  usernameField: "email", 
});

module.exports = mongoose.model("Admin", AdminSchema);
