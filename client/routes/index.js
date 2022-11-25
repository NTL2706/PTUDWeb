const home_router = require("./homeRouter");
const product_router = require("./productRouter");
const shoping_cart_router = require("./shopingCartRouter");

function route(app) {
    app.use("/", home_router);
    // app.use("/product", product_router);
    app.use("/cart", shoping_cart_router);
}

module.exports = route;