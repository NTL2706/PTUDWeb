const User = require("../../models/User");

function getRegister(req, res) {
    res.render("./register/register.hbs", {
        layout: false,
    });
}

function postRegister(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const address = req.body.address;

    console.log(email);
    if (password != req.body.re_password) {
        res.render("./register/register.hbs", {
            layout: false,
        });
    }
    else {
        User.register({ email: email, name: name, address: address, status: true}, password, function (err, user) {
            if (err) {
                console.log(err);
                res.render("./register/register.hbs", {
                    error: "Tài khoản đã được tạo",
                });
            }
            else {
                res.redirect("/login");
            }
        });
    }
}

module.exports = {
    getRegister,
    postRegister
}