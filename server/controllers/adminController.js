const Admin = require("../models/admin.model");
const passport = require("../config/passport");
module.exports = {
  getLogin: (req, res, next) => {
    res.render("admin/login.hbs", {
      layout: false,
    });
  },

  getLogout: (req, res, next) => {
    req.logout();
    req.session.destroy(function (err) {
      if (err) { return next(err); }
      // The response should indicate that the user is no longer authenticated.
      res.redirect("/admin/login");
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

  getProfile: async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }
    // find admin by id using await
    const admin = await Admin.findById(req.user._id);
    return res.render("admin/profile", {
      id: req.user._id,
      admin,
    });
  },

  getEditProfile: async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }
    // find admin by id using await
    const admin = await Admin.findById(req.user._id);
    return res.render("admin/edit-profile", {
      id: req.user._id,
      admin,
    });
  },

  postEditProfile: async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }

    const admin = await Admin.findById(req.user._id);
    admin.name = req.body.name;
    admin.email = req.body.email;
    await admin.save();
    return res.redirect("/admin/profile");
  },

  getChangePassword: async (req, res, next) => {
    return res.render("admin/change-password", {
      // id: res.locals.authUser._id,
    });
  },
};
