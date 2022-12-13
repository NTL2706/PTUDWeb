const homeController = {
  index: function (req, res) {
    if (req.user) {
      res.render("./home/home.hbs", {
        user: req.user
      });
    }
    else {
      res.render("./home/home.hbs", {});
    }
  },
};

module.exports = homeController;
