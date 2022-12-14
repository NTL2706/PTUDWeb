const passport = require("passport");
const Admin = require("../models/admin.model");

passport.use(Admin.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function (err, user) {
      done(err, user);
    });
  });

module.exports = passport;