const User = require("../../models/User");

module.exports = {
    getMyAccount: (req, res) => {
        if (req.user) {
            res.render("my-account/my-account.hbs", {
                user: req.user
            });
        }
        else {
            res.redirect("/")
        }
    },

    getEditMyAccount: (req, res) => {
        if (req.user) {
            res.render("my-account/edit-account.hbs", {
                layout: false,
                user: req.user
            });
        } else {
            res.redirect("/")
        }
    },

    postEditMyAccount: async (req, res) => {
        const user = await User.findOne({ email: req.body.email }).lean();
        if (user && user.email !== req.user.email) {
            return res.render("my-account/edit-account", {
                layout: false,
                error: "Email đã tồn tại",
            });
        }

        await User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        })
            .then(() => {
                req.user.name = req.body.name;
                req.user.address = req.body.address;
                req.user.email = req.body.email;
                res.redirect("/my-account");
            })
            .catch((err) => {
                console.log(err);
                res.render("errors/404");
            });
    },

    getChangePassWordMyAccount: (req, res) => {
        if (req.user) {
            res.render("my-account/change-password.hbs", {
                layout: false,
            });
        }
        else {
            res.redirect("/")
        }
    },

    getLogout: (req, res, next) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
}