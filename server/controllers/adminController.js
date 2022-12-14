const Admin = require("../models/admin.model");
const passport = require("../config/passport");
module.exports = {
  getLogin: (req, res, next) => {
    res.render("admin/login.hbs", {
      layout: false,
    });
  },

  getAddAdmin: (req, res, next) => {
    if (!req.user) {
      res.render("admin/add-admin");
    } else {
      res.redirect("/admin/login");
    }
  },

  postAddAdmin: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    console.log(email, password, name);
    await Admin.register(
      { email: email, name: name },
      password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.render("admin/add-admin");
        } else {
          res.redirect("/");
        }
      }
    );
  },

  // getEditProfile: async (req, res, next) => {
  //     if (!req.user) {
  //         return res.redirect("/admin/login");
  //     }
  //     // find admin by id using await
  //     const admin = await Admin.findById(res.locals.authUser._id);
  //     return res.render("admin/edit-profile", {
  //         id: res.locals.authUser._id,
  //         admin,
  //     });
  // },

  getChangePassword: async (req, res, next) => {
    return res.render("admin/change-password", {
      // id: res.locals.authUser._id,
    });
  },
};
