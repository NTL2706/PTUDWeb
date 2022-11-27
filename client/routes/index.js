const home_router = require("./homeRouter");
const product_router = require("./productRouter");
const shoping_cart_router = require("./shopingCartRouter");
const login_router = require("./loginRouter");
const register_router = require("./registerRouter");

function route(app) {
    app.use("/", home_router);
    app.use("/login", login_router);
    app.use("/register", register_router);
    app.use("/cart", shoping_cart_router);
    app.use("/product", product_router);
}

module.exports = route;