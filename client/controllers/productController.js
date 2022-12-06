const product_model = require("../models/Product");

function getProduct(req, res) {
    
    res.render("./shop-grid/shop-grid.hbs", {});
}

module.exports = {
    getProduct
}