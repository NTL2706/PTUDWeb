const home_router = require("./homeRouter");
const admin_router = require("./adminRouter");
function route(app) {
    app.use("/", home_router);
    app.use("/admin", admin_router);
    // app.use("/login", login_router);
    // app.use("/register", register_router);
    // app.use("/cart", shoping_cart_router);
    // app.use("/product", product_router);
}

module.exports = route;