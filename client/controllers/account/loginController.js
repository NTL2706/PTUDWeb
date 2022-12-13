const User = require("../../models/User");
const passport = require("passport");

function getLogin(req, res) {
    if (req.user) {
        res.redirect("/");
    }
    res.render("login/login", {
        layout: false,
    });
}

function postLogin(req, res, next) {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login/login.hbs', {
                layout: false,
                wrongLogin: true
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

module.exports = {
    getLogin,
    postLogin
}
