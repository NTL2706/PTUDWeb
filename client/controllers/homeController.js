const homeController = {
  index: function (req, res) {
    res.render("./home/home.hbs", {});
  },
};

module.exports = homeController;
