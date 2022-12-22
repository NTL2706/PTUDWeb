const User = require("../models/User");
const passport = require("passport");

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {      // ma hoa
    // console.log(user);
    done(null, {
        email: user.email,
        name: user.name,
        address: user.address,
        id: user._id,
        status: user.status
    });
});

passport.deserializeUser(function (user, done) {      // giai ma
    return done(null, user);
});


module.exports = passport